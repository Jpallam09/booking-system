<?php

namespace App\Enums;

enum UserRole: string
{
    case Patient = 'patient';
    case Dentist = 'dentist';
    case Admin = 'admin';
}
