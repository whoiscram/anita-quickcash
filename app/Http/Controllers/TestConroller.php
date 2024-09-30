<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class TestConroller extends Controller
{
    public function index()
    {
        $users = User::all();

        return response()->json($users);
    }
}
