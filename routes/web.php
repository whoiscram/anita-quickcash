<?php

use App\Http\Controllers\LoanController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\DataController;
use App\Http\Controllers\UserController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/


Route::get('/{any?}', function ($any = null) {
    if (strpos($any, 'dashboard/') === 0) {
        return view('welcome'); // Return the welcome view for dashboard routes
    } else {
        return view('welcome'); // Return the default welcome view for other routes
    }
})->where('any', '.*');

// Logi & Registration
Route::controller(AuthController::class)->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
});

// Authenticated Routes
Route::middleware('auth:sanctum')->group(function () {
    // Company Routes
    Route::prefix('/')->group(function () {
        Route::post('/company', [DataController::class, 'company']);
        Route::post('/company/add', [DataController::class, 'store']);
        Route::post('/company/edit/{id}', [DataController::class, 'edit']);
        Route::post('/company/update/{id}', [DataController::class, 'updateCompany']);
    });

    // User Routes
    Route::prefix('users')->group(function () {
        Route::post('/owner', [UserController::class, 'index']);
        Route::post('/filter', [UserController::class, 'filterUsers']);
        Route::post('/create', [UserController::class, 'create']);
    });

    // Loan Routes
    Route::prefix('loans')->group(function () {
        Route::post('/', [LoanController::class, 'loans']);
        Route::post('/approve/{id}', [LoanController::class, 'approvedLoan']);
        Route::post('/filter/{id}', [LoanController::class, 'filterLoansByCompanyId']);
        Route::post('/createLoanForEmployee', [LoanController::class, 'createLoanForEmployee']);
        // Route::post('/loans/add', [LoanController::class, 'addLoan']);
        Route::post('/request_loan', [LoanController::class, 'requestLoan']);
        Route::post('/update/{id}', [LoanController::class, 'aproveRequest']); //di gumagana
       
    });

    // Employee Routes
    Route::prefix('/')->group(function () {
        Route::post('/employees/add', [DataController::class, 'createEmployee']);
        Route::post('/employees', [DataController::class, 'employee']);
        Route::post('employees/{id}', [UserController::class, 'filterEmployee']);
        Route::post('pending_loans', [DataController::class, 'pending_loans']);
        Route::post('userByID', [UserController::class, 'userByID']);
        Route::post('filterUser/{id}', [UserController::class, 'filterUser']);
        // Route::post('/update/{id}', [LoanController::class, 'aproveRequest']);
    });

    Route::post('/amortizations', [DataController::class, 'amortizations']);


    Route::post('roles', [AuthController::class, 'roles'])->middleware('auth:sanctum');
//Route::post('/amortizations', [DataController::class, 'amortizations']);
Route::post('/update/{id}', [LoanController::class, 'aproveRequest']);
Route::post('/loans/add', [LoanController::class, 'addLoan']);
Route::post('/loans/payment/{id}', [LoanController::class, 'loanPayment']);
Route::post('/profile/update/{id}', [LoanController::class, 'aproveRequest']);
});

// // Public Routes
// Route::post('roles', [AuthController::class, 'roles'])->middleware('auth:sanctum');
// //Route::post('/amortizations', [DataController::class, 'amortizations']);
// Route::post('/update/{id}', [LoanController::class, 'aproveRequest']);
// Route::post('/loans/add', [LoanController::class, 'addLoan']);
// Route::post('/loans/add', [LoanController::class, 'addLoan']);
// Route::post('/loans/payment/{id}', [LoanController::class, 'loanPayment']);
// Route::post('/profile/update/{id}', [LoanController::class, 'aproveRequest']);












