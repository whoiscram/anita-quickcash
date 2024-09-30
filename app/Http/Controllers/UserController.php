<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\Company;

class UserController extends Controller
{
    // public function __construct()
    // {
    //     $this->middleware('auth');
    // }
   
    public function filterUsers(Request $request)
    {
        $user = $request->user();
        $userRoles = $user->roles->pluck('name')->toArray();
        $company_id = null;
    
        if (in_array('owner', $userRoles)) {
            // For owner, no need to filter by company_id, return all users
            $users = User::with('roles')
                         ->join('companies', 'users.company_id', '=', 'companies.id')
                         ->select('users.*', 'companies.name as company_name')
                         ->get();
        } else {
            // For other roles, filter users by company_id
            $company_id = $user->company_id;
            $users = User::where('company_id', $company_id)
                         ->with('roles')
                         ->join('companies', 'users.company_id', '=', 'companies.id')
                         ->select('users.*', 'companies.name as company_name')
                         ->get();
        }
    
        return response()->json($users);
    }
    
    

    public function index()
    {
        return response()->json(User::all());
    }

    public function create(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'company_id' => 'required',
            'roles' => 'array',
        ]);

        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
        ]);

        $user->company()->associate($validatedData['company_id']);
        $user->save();

        // Associate roles with the user
        if (isset($validatedData['roles'])) {
            $user->roles()->attach($validatedData['roles']);
        }

        return response()->json(['message' => 'User created successfully', 'user' => $user]);
    }


    public function filterEmployee(Request $request, $companyId)
    {
        // Use $companyId obtained from the URL parameter

        $filter = DB::table('users')
            ->join('companies', 'users.company_id', '=', 'companies.id')
            ->where('users.company_id', '=', $companyId)
            ->select(
                'users.*', // Select all columns from filter table
                'companies.name as company_name' // Alias the company name column
            )
            ->get();

        return response()->json($filter);
    }   

    public function userByID(Request $request)
    {
        $user = $request->user();   
        $user->load('company');
        return response()->json($user);
    }


    public function filterUser(Request $request, $company_id)
    {
        // Retrieve all users with the role of "employee" associated with the specified company
        $employees = User::whereHas('roles', function ($query) {
                $query->where('name', 'employee');
            })
            ->where('company_id', $company_id)
            ->with('company')
            ->get();
    
        return response()->json($employees);
    }
    
    





}
