import * as React from "react";

import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

import { Outlet } from "react-router-dom";
import Navigation from "../components/Navigation";
import Home from "../components/Home";
import About from "../components/About";
import Login from "../components/Login";
import Dashboard from "../components/Dashboard";
function Layout() {
    return (
        <div>
            <h1>Quick_cash</h1>
            <Navigation/>
            {/* This element will render either <DashboardMessages> when the URL is
          "/messages", <DashboardTasks> at "/tasks", or null if it is "/"
      */}
            <Outlet />
        </div>
    );
}


///Main Layout na to 
//from there pwede ka na maglagay ng mga routes

export default function MainLayout({ ...props }) {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard/>}/>
                    
                </Route>
               
            </Routes>
        </Router>
    );
}
