import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router-dom";
import { useAuthState, useAuth } from "../hooks/loginAuth";
import { useNavigate } from "react-router-dom";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

function Header() {
    const { isLoggedIn, userRoles } = useAuthState();
    const [state, actions] = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const [email, setEmail] = useState(""); // State to hold the email
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        // Retrieve email from localStorage when component mounts
        const storedEmail = localStorage.getItem("email");
        setEmail(storedEmail); // Set the email state
    }, []);

    const handleLogout = () => {
        actions.logout(navigate); // Pass navigate to the logout action
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box>
             <nav aria-label="secondary mailbox folders">
            <Typography variant="h5">Quick Cash</Typography>
            <Typography variant="h6">{email}</Typography>
            <List>
                {isLoggedIn ? (
                    <>
                        <ListItem disablePadding>
                            <ListItemButton key="home" component={Link} to="/home">
                                <ListItemText primary="Home" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/about">
                                <ListItemText primary="About" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/dashboard/loans">
                                <ListItemText primary="Loans" />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/dashboard/users">
                                <ListItemText primary="Users" />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/dashboard/company">
                                <ListItemText primary="Company" />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/dashboard/amortizations">
                                <ListItemText primary="Amortization" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/dashboard/profile">
                                <ListItemText primary="Profile" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleLogout}>
                                <ListItemText primary="Logout" />
                            </ListItemButton>
                        </ListItem>
                    </>
                ) : (
                    <>
                        <ListItem disablePadding>
                            <ListItemButton key="home" component={Link} to="/">
                                <ListItemText primary="Home" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/about">
                                <ListItemText primary="About" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton component={Link} to="/login">
                                <ListItemText primary="Login" />
                            </ListItemButton>
                        </ListItem>
                    </>
                )}
            </List>
        </nav>



        </Box>
    );
}

export default Header;
