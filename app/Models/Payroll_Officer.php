<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payroll_Officer extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'email', 'status'];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
