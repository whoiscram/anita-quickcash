<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class DashboardController extends Controller{

public function index()
{
    if (Auth::check()) {
        echo "red";
    } else {
        return redirect()->route('/log');
    }

    
}

}
