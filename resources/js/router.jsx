import ReactDOM from 'react-dom';
import Main from './Main';
import React from 'react';
import NotFound from './pages/NotFound'
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import DefaultLayout from './layouts/DefaultLayout';
import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
import GuestLayout from './layouts/GuestLayout';
import Signup from './layouts/DefaultLayout';
import Dashboard from './pages/Dashboard';



const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout/>,
        children: [
            {
                path: '/home',
                elemet: <Home/>
              },
              {
                path: '/about',
                elemet: <About/>
              },
              {
                path: '/login',
                elemet: <Login/>
              },
              {
                path: 'dashboard',
                element: <Dashboard/>
              }
        ]
    },
    {
        path: '/',
        element: <GuestLayout/>,
        children: [
            {
                path: '/home',
                elemet: <Home/>
              },
              {
                path: '/about',
                elemet: <About/>
              },
              {
                path: '/login',
                elemet: <Login/>
              },
              {
                path: 'signup',
                element: <Signup/>
              }
        ]
    },
    {
        path: '*',
        element: <NotFound/>
    }
  ]);

  export default router;