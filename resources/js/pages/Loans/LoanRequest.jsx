import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import { Card, InputLabel, TextField } from "@mui/material";
import { useAuth } from "../../hooks/loginAuth";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import {
    GridRowModes,
    DataGrid,
    GridToolbarContainer,
    GridActionsCellItem,
    GridRowEditStopReasons,
} from "@mui/x-data-grid";

const DemoPaper = styled(Paper)(({ theme }) => ({
    width: 500,
    height: 300,
    padding: theme.spacing(2),
    ...theme.typography.body2,
    textAlign: "center",
}));


export default function LoanRequest() {
    const [state, actions] = useAuth();
    const { userRoles, company_id } = state;
    const [rowModesModel, setRowModesModel] = React.useState({});
    const [user,setUser] = useState();
    const [pending_loans, setPendingLoans] = useState([]);
    const navigate = useNavigate();
    const [rows, setRows] = React.useState(pending_loans);
    const [hasOngoingLoan, setHasOngoingLoan] = useState(false)

    useEffect(() => {
        // Fetch pending loans
        const token = localStorage.getItem("token");
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        axios
            .post("/pending_loans", {}, { headers: headers })
            .then((response) => {
                setPendingLoans(response.data);
                const hasOngoing = response.data.some(loan => loan.status === 'pending');
                setHasOngoingLoan(hasOngoing);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [company_id, userRoles]);

    useEffect(() => {
        // Fetch user data
        const token = localStorage.getItem("token");
        const headers = {
            Authorization: `Bearer ${token}`,
        };
        axios
            .post("/userByID", {}, { headers: headers })
            .then((response) => {
                setUser(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);



    const handleNav = () => {
        if (!hasOngoingLoan) {
            navigate("/dashboard/requestloan");
        } else {
            window.alert("You already have an ongoing loan.");
        }
    };



    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    //API CALL CRUD
    const handleEditClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.Edit },
        });
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View },
        });
    };

    const handleDeleteClick = (id) => () => {
        setRows(rows.filter((row) => row.id !== id));
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow = rows.find((row) => row.id === id);
        if (editedRow.isNew) {
            setRows(rows.filter((row) => row.id !== id));
        }
    };

    const processRowUpdate = (newRow) => {
        const updatedRow = { ...newRow, isNew: false };
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };
    const [status, setStatus] = useState("pending");
    const handleChange = async (id, newValue) => {
        if (newValue === "approved") {
            try {
                const token = localStorage.getItem('token');
                const headers = {
                    'Authorization': `Bearer ${token}`
                };
    
                // Make API call to update status with headers
                await axios.post(`/update/${id}`, { status: newValue }, { headers: headers });
    
                window.alert("Loan Approved");
    
                //Find the updated row and pass it to the axios call
                const updatedRow = pending_loans.find(row => row.id === id);
                if (updatedRow) {
                    await axios.post("/loans/add", { pending_loans: [updatedRow] }, { headers: headers });
                } else {
                    console.error("Error: Updated row not found");
                }
                // Update local state with the new status
                const updatedRows = pending_loans.map(row => {
                    if (row.id === id) {
                        return { ...row, status: newValue };
                    }
                    return row;
                });
                setPendingLoans(updatedRows);  
            } catch (error) {
                console.error("Error updating status:", error);
            }
        }
        // Update local state
        setStatus(newValue);
    };
    
    
    

    const isEmployee = userRoles.includes('employee');

    // Define columns for employees and non-employees
    const columnsForNonEmployee = [
        { field: "employee_id", headerName: "Employee", width: 180, editable: true },
        { field: "name", headerName: "Name", width: 180, editable: true },
        {
            field: "company_name",
            headerName: "Company",
            width: 150,
            align: "left",
            headerAlign: "left",
        },
        { field: "amount", headerName: "Amount", width: 180, editable: true },
        
        {
            field: "status",
            headerName: "Status",
            width: 150,
            align: "left",
            headerAlign: "left",
            renderCell: (params) => (
                <select
                    value={params.value}
                    onChange={(e) => handleChange(params.id, e.target.value)}
                >
                    <option
                        value="pending"
                        disabled={params.value === "approved"}
                    >
                        Pending
                    </option>
                    <option value="approved">Approved</option>
                    <option value="completed">Completed</option>
                    <option value="completed">Reject</option>
                </select>
            ),
        },
        {
            field: "created_at",
            headerName: "Created At",
            width: 100,
            align: "left",
            headerAlign: "left",
        },
        {
            field: "updated_at",
            headerName: "Updated At",
            width: 100,
            align: "left",
            headerAlign: "left",
        },
    ];

    const columnsForEmployee = [
        { field: "employee_id", headerName: "Employee", width: 180, editable: true },
        { field: "name", headerName: "Name", width: 180, editable: true },
        { field: "amount", headerName: "Amount", width: 180, editable: true },
        { field: "status", headerName: "Status", width: 180, editable: true },
        {
            field: "created_at",
            headerName: "Created At",
            width: 100,
            align: "left",
            headerAlign: "left",
        },
        {
            field: "updated_at",
            headerName: "Updated At",
            width: 100,
            align: "left",
            headerAlign: "left",
        },
    ];
    
    // Use appropriate columns based on the user's role
    const columns = isEmployee ? columnsForEmployee : columnsForNonEmployee;

    return (
        <Layout>
            <Card>
                <CardContent>
                    <Typography variant="h3" gutterBottom>
                        Pending Loans
                    </Typography>
                <Button onClick={handleNav}>Request Loan</Button>
                </CardContent>
            </Card>

            <Box
                sx={{
                    height: 500,
                    width: "100%",
                    "& .actions": {
                        color: "text.secondary",
                    },
                    "& .textPrimary": {
                        color: "text.primary",
                    },
                }}
            >
                <DataGrid
                    rows={pending_loans}
                    columns={columns}
                    editMode="row"
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={handleRowModesModelChange}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    
                    initialState={{
                        ...rows.initialState,
                        pagination: { paginationModel: { pageSize: 5 } },
                      }}

                    autoPageSize {...rows}
                    slotProps={{
                        toolbar: { setRows, setRowModesModel },
                    }}
                />
            </Box>
        </Layout>
    );
}
