// ProtectedRoute.js

import React, { useEffect, useState } from "react";
import { Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/loginAuth";
import { useNavigate } from "react-router-dom";
const ProtectedRoute = ({ element, requiredRoles }) => {
    const [{ isLoggedIn }] = useAuth();

    const navigate = useNavigate();

    const [userRoles, setUserRoles] = useState(null);
    const [authToken, setAuthTokemn] = useState();

    useEffect(() => {
        const roles = localStorage.getItem("roles");
        const token = localStorage.getItem("token");

        setUserRoles(roles);
        setAuthTokemn(token);
    }, []);

    console.log(userRoles);

    if (!authToken) {
        navigate("/login");
    }

    if (requiredRoles && requiredRoles.length > 0 && userRoles !== null) {
        const handleRequiredRole = requiredRoles.some(
            (role) => userRoles === role
        );
        if(!handleRequiredRole){
          console.error("Error: Insufficient role permissions");

          navigate("/not-found");
        }
    }

    //return content
    return element;
};

export default ProtectedRoute;
