<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;

class UserService
{
    public function getFilteredUsers(array $filters, User $user)
    {
        $this->ensureAdmin($user);

        $query = User::query();

        if (!empty($filters['role']) && in_array($filters['role'], ['patient', 'dentist', 'admin'], true)) {
            $query->where('role', $filters['role']);
        }

        if (!empty($filters['search'])) {
            $term = $filters['search'];
            $query->where(function ($q) use ($term) {
                $q->whereLike('name', "%{$term}%")
                  ->orWhereLike('email', "%{$term}%");
            });
        }

        return $query->orderBy('name')->paginate($filters['per_page'] ?? 50);
    }

    private function ensureAdmin(User $user): void
    {
        if ($user->role !== UserRole::Admin) {
            throw new AuthorizationException('Only admins can list users.');
        }
    }
}