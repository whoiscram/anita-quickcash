<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{



    public function login(Request $request)
    {
        $loginUserData = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|min:8'
        ]);

        $user = User::where('email', $loginUserData['email'])->first();

        if (!$user || !Hash::check($loginUserData['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid Credentials'
            ], 401);
        }

        // Retrieve roles and permissions
        $roles = $user->getRoleNames();
        $permissions = $user->getAllPermissions();
        $email = $user->email;

        // Create token
        $token = $user->createToken($user->name . '-AuthToken')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'roles' => $roles,
            'permissions' => $permissions,
            'email_' => $email,
            "company_id" => $user->company_id,
            "userID" => $user->id,
        ]);
    }
    public function register(Request $request)
    {
        $registerUserData = $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|min:8'
        ]);
        $user = User::create([
            'name' => $registerUserData['name'],
            'email' => $registerUserData['email'],
            'password' => Hash::make($registerUserData['password']),
        ]);
        return response()->json([
            'message' => 'User Created ',
        ]);
    }

    public function logout()
    {
        auth()->user()->tokens()->delete();

        return response()->json([
            "message" => "logged out"
        ]);
    }


    //Check Role // you dont need this ata
    public function checkRole(Request $request)
    {
        if ($request->user() && $request->user()->hasRole('admin')) {
            return response()->json(['message' => 'hello'], 200);

        }
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    public function roles(Request $request)
    {
        // Retrieve authenticated user
        $user = $request->user();

        // Check if user is authenticated
        if (!$user) {
            return response()->json([
                'error' => 'Unauthenticated'
            ], 401);
        }

        // Retrieve user's roles
        $roles = $user->getRoleNames();

        // Check if roles are available
        if (!$roles) {
            return response()->json([
                'error' => 'Roles not found'
            ], 404);
        }

        // Return user's roles
        return response()->json([
            'roles' => $roles
        ]);
    }





}



