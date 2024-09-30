import "./bootstrap";
import React from "react";
import ReactDOM from "react-dom";
//Packages
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoutes";

//pages
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Users from "./pages/Users";
import Register from "./pages/Register";
import Loans from "./pages/Loans";
import Company from "./pages/Company";
import AddCompany from "./pages/Company/AddCompany";
import EditCompany from "./pages/Company/EditCompany";
import AddLoan from "./pages/Loans/AddLoans";
import PendingLoans from "./pages/Loans/PendingLoans";
import AddUser from "./pages/Users/AddUser";
import Profile from "./pages/Profile"
import RequestLoan from "./pages/Loans/RequestLoan";
import Layout from "./components/Layout";
import LoanRequest from "./pages/Loans/LoanRequest";
const rootElement = document.getElementById("root");

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/home",
        element: <Home />,
        errorElement: <NotFound />,
    },
    {
        path: "/not-found",
        element: <NotFound />,
        errorElement: <NotFound />,
    },
    {
        path: "/about",
        element: <About />,
        errorElement: <NotFound />,
    },
    {
        path: "/login",
        element: <Login />,
        errorElement: <NotFound />,
    },
    {
        path: "/register",
        element: <Register />,
        errorElement: <NotFound />,
    },
    {
        path: "/dashboard",
        children: [
            {
                path: "loans",
                element: (
                    <ProtectedRoute
                        element={<Loans />}
                        requiredRoles={[
                            "admin",
                            "owner",
                            "payroll_officer",
                        ]}
                    />
                ),
            },
            {
                path: "users",
                element: (
                    <ProtectedRoute
                        element={<Users />}
                        requiredRoles={["owner", "admin",  "payroll_officer"]}
                    />
                ),
            },
            {
                path: "company",
                element: (
                    <ProtectedRoute
                        element={<Company />}
                        requiredRoles={[
                            "admin",
                            "owner",
                            "payroll_officer",
                        ]}
                    />
                ),
            },
            {
                path: "company/add",
                element: (
                    <ProtectedRoute
                        element={<AddCompany />}
                        requiredRoles={[
                            "admin",
                            "owner",
                        ]}
                    />
                ),
            },
            {
                path: "company/edit/:id",
                element: (
                    <ProtectedRoute
                        element={<EditCompany />}
                        requiredRoles={[
                            "admin",
                            "owner",
                            "payroll_officer",
                        ]}
                    />
                ),
            },

            {
                path: "users/add",
                element: (
                    <ProtectedRoute
                        element={<AddUser />}
                        requiredRoles={["owner", "admin",  "payroll_officer"]}
                    />
                ),
            },
            {
                path: "loans/add",
                element: (
                    <ProtectedRoute
                        element={<AddLoan />}
                        requiredRoles={["owner", "admin",  "payroll_officer"]} //payroll officer can only create loans for employees under their company
                    />
                ),
            },
            {
                path: "amortizations",
                element: (
                    <ProtectedRoute
                        element={<PendingLoans />}
                        requiredRoles={["owner", "admin",  "payroll_officer"]}
                    />
                ),
            },
            {
                path: "requestloan",
                element: (
                    <ProtectedRoute
                        element={<RequestLoan />}
                        requiredRoles={["employee"]}
                    />
                ),
            },

            {
                path: "loanRequest", //employee pending request
                element: (
                    <ProtectedRoute
                        element={<LoanRequest />}
                        requiredRoles={["owner","admin","payroll_officer", "employee"]}
                    />
                ),
            },

            {
                path: "profile",
                element: (
                    <ProtectedRoute
                        element={<Profile />}
                        requiredRoles={["owner","admin","payroll_officer", "employee"]}
                    />
                ),
            },
        ],
    },
]);

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
