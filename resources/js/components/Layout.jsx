import React from "react";
import { AppBar, Box, CardContent, Card, Paper } from "@mui/material";
import Header from "./Header";

const Layout = ({ children }) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                padding: "20px",
                borderColor: "primary.main",
            }}
        >
            <Paper
                variant="outlined"
                sx={{
                    backgroundColor: "black",
                    color: "white",
                    borderColor: "primary.main",
                    border: 1,
                    padding: "20px",
                    paddingLeft: "20px",
                    height: 575,
                }}
            >
                <Header />
            </Paper>
            <Box
                sx={{
                    flex: "1 1 auto",
                    borderColor: "primary.main",
                    padding: "10px",
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default Layout;
