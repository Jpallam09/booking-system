<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Models\Service;
use Illuminate\Auth\Access\AuthorizationException;

class DentalServiceManager
{
    public function getAllServices(array $filters = [])
    {
        $query = Service::query();

        if (!empty($filters['search'])) {
            $term = $filters['search'];
            $query->where(function ($q) use ($term) {
                $q->whereLike('title', "%{$term}%")
                  ->orWhereLike('description', "%{$term}%");
            });
        }

        if (!empty($filters['status']) && in_array($filters['status'], ['active', 'inactive'], true)) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['min_price']) && is_numeric($filters['min_price'])) {
            $query->where('price', '>=', $filters['min_price']);
        }

        if (isset($filters['max_price']) && is_numeric($filters['max_price'])) {
            $query->where('price', '<=', $filters['max_price']);
        }

        return $query->latest()->paginate(10);
    }

    public function getService(int $id): Service
    {
        return Service::findOrFail($id);
    }

    public function createService(array $data, $user)
    {
        $this->ensureAdmin($user);

        return Service::create($data);
    }

    public function updateService(Service $service, array $data, $user): Service
    {
        $this->ensureAdmin($user);

        $service->fill($data);
        $service->save();

        return $service;
    }

    public function deleteService(Service $service, $user): void
    {
        $this->ensureAdmin($user);

        $service->delete();
    }

    private function ensureAdmin($user): void
    {
        if (!$user || $user->role !== UserRole::Admin) {
            throw new AuthorizationException('Unauthorized. Only admins can manage services.');
        }
    }
}
