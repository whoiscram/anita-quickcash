<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Role;
use App\Http\Controllers\DataController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });



// Route::post('test', function (Request $request) {
//     dd("test", $request->all());

// });


// Route::middleware('auth:sanctum')->post('/dashboard', function (Request $request) {
//     return $request->user();
// });


// Route::controller(AuthController::class)->group(function () {
//     Route::post('register', [AuthController::class, 'register']);
//     Route::post('login', [AuthController::class, 'login']);
//     Route::post('logout', [AuthController::class, 'logout'])
//         ->middleware('auth:sanctum');
//         Route::post('/users', [AuthController::class, 'checkRole'])
//     ->middleware(['auth', 'role:admin']);
// });



// Route::post('users', [AuthController::class, 'checkRole'])->middleware('role:admin');//specify role

// Route::post('/company', [DataController::class, 'company']);

Route::post('/company/add', [DataController::class, 'store']);

Route::post('/roles', [AuthController::class, 'roles'])->middleware('auth:sanctum');