<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Models\Service;
use Illuminate\Auth\Access\AuthorizationException;

class DentalServiceManager
{
    public function getAllServices()
    {
        return Service::all();
    }

    public function createService(array $data, $user)
    {
        // Only admins can create services
        if (!$user || $user->role !== UserRole::Admin) {
            throw new AuthorizationException('Unauthorized. Only admins can create services.');
        }

        return Service::create($data);
    }
}
