<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Amortization extends Model
{
    use HasFactory;
    protected $primaryKey = 'payment';
    protected $fillable = ['amount', 'date', 'payment'];
}
