<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
    use HasFactory;


    protected $fillable = [
        'receivable',
        'payment',
        'employee_id',
        'amortization',
        'company',
        'date',
        'loan_date',
        'end_of_term',
    ];
}
