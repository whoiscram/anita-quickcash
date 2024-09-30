import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Form, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, InputLabel } from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useAuth } from "../../hooks/loginAuth";
export default function AddUser() {
    const [state, actions] = useAuth();
    const { userRoles, company_id, access_token } = state;
    const [companies, setCompanies] = useState([]);
    const navigate = useNavigate();

    const [roles, setUserRoles] = useState();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    useEffect(() => {
        const userRolesFromStorage = localStorage.getItem("roles");
        if (userRolesFromStorage) {
            setUserRoles(userRolesFromStorage);
        } else {
            // Fetch user roles from server and set in state
        }
    }, []);

    const handleNav = () => {
        //api call new page
        navigate("/dashboard/users");
    };
    const getAvailableRoles = () => {
        console.log("User Roles:", userRoles); // Check the value of userRoles

        if (roles === "owner") {
            console.log("Owner Role");
            return [
                { value: "", label: "Select Role" },
                { value: 2, label: "Admin" },
                { value: 3, label: "Payroll Officer" },
                { value: 4, label: "Employee" },
            ];
        } else if (roles === "admin") {
            console.log("Admin Role");
            return [
                { value: "", label: "Select Role" },
                { value: 3, label: "Payroll Officer" },
                { value: 4, label: "Employee" },
            ];
        } else if (roles === "payroll_officer") {
            console.log("Payroll Officer Role");
            return [
                { value: "", label: "Select Role" },
                { value: 4, label: "Employee" },
            ];
        } else {
            console.log("Default Role");
            return [{ value: "", label: "Select Role" }];
        }
    };

    const availableRoles = getAvailableRoles();
    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const token = localStorage.getItem("token");

                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                const response = await axios.post(
                    "/company",
                    {},
                    { headers: headers }
                );
                setCompanies(response.data);
            } catch (error) {
                console.error("Error fetching companies:", error);
            }
        };

        fetchCompanies();
    }, []);

    useEffect(() => {
        if (roles === "admin" || roles === "payroll_officer") {
            setSelectedCompany(company_id);
        }
    }, [roles, company_id]);

    const [selectedRole, setSelectedRole] = useState("");
    const [selectedCompany, setSelectedCompany] = useState("");

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "/users/create",
                {
                    ...formData,
                    roles: [selectedRole],
                    company_id: selectedCompany,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("User created:", response.data);
            navigate("/dashboard/users");
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    return (
        <Layout>
            <Card>
                <CardContent>
                    <Button variant="contained" onClick={handleNav}>
                        BACK
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <FormControl fullWidth>
                                <TextField
                                    id="name"
                                    label="Name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </FormControl>

                            <FormControl fullWidth>
                                <TextField
                                    id="password"
                                    label="Password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </FormControl>
                            <FormControl fullWidth>
                                <TextField
                                    id="email"
                                    label="Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </FormControl>

                            {/* <FormControl fullWidth>
                                <InputLabel>Role</InputLabel>
                                <Select
                                    id="role"
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                >
                                    <MenuItem value="">Select Role</MenuItem>
                                    <MenuItem value={2}>admin</MenuItem>
                                    <MenuItem value={3}>
                                        payroll_officer
                                    </MenuItem>
                                    <MenuItem value={4}>
                                        employee
                                    </MenuItem>
                                </Select>
                            </FormControl> */}

                            <FormControl fullWidth>
                                <InputLabel>Role</InputLabel>
                                <Select
                                    id="role"
                                    value={selectedRole}
                                    onChange={(e) =>
                                        setSelectedRole(e.target.value)
                                    }
                                >
                                    {availableRoles.map((role) => (
                                        <MenuItem
                                            key={role.value}
                                            value={role.value}
                                        >
                                            {role.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel>Company</InputLabel>
                                <Select
                                    id="company"
                                    type="text"
                                    value={selectedCompany}
                                    onChange={(e) =>
                                        setSelectedCompany(e.target.value)
                                    }
                                    disabled={
                                        roles === "admin" ||
                                        roles === "payroll_officer"
                                    }
                                >
                                    <MenuItem value="">Select Company</MenuItem>
                                    {companies.map((company) => (
                                        <MenuItem
                                            key={company.id}
                                            value={company.id}
                                        >
                                            {company.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button variant="contained" type="submit">
                                SAVE
                            </Button>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Layout>
    );
}
