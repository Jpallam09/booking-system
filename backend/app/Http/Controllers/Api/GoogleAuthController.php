<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    protected AuthService $authService;

    protected string $frontendUrl;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
        $this->frontendUrl = rtrim(env('FRONTEND_URL', 'http://localhost:5173'), '/');
    }

    public function redirect()
    {
        $url = Socialite::driver('google')->stateless()->redirect()->getTargetUrl();

        return response()->json(['url' => $url]);
    }

    public function callback(Request $request)
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
            $result = $this->authService->loginWithGoogle($googleUser);

            $user = $result['user'];
            $payload = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role->value,
                'avatar' => $user->avatar,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ];

            $query = http_build_query([
                'token' => $result['token'],
                'user' => json_encode($payload),
            ]);

            return redirect()->away("{$this->frontendUrl}/oauth/callback?{$query}");
        } catch (\Throwable $e) {
            Log::error('Google OAuth callback failed', ['error' => $e->getMessage()]);

            return redirect()->away(
                "{$this->frontendUrl}/oauth/callback?error=" . urlencode('Google sign-in failed. Please try again.')
            );
        }
    }
}
