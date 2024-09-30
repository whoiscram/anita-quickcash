import * as React from "react";
import Layout from "../../components/Layout";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import axios from "axios";
import {
    GridRowModes,
    DataGrid,
    GridToolbarContainer,
    GridActionsCellItem,
    GridRowEditStopReasons,
} from "@mui/x-data-grid";

import { useAuth } from "../../hooks/loginAuth";
import { Typography } from "@mui/material";

function EditToolbar(props) {
    const navigate = useNavigate();

    const handleClick = () => {
        //api call new page
        navigate("/dashboard/employees/add");
    };

    return <GridToolbarContainer>
              <Typography variant="h3" component="h2">
                Amortization
            </Typography>
    </GridToolbarContainer>;
}

export default function PendingLoans() {
    const [state, actions] = useAuth();
    const { userRoles } = state;
    const [rowModesModel, setRowModesModel] = React.useState({});

    const [amortizations, setAmortizations] = useState([]);
    const navigate = useNavigate();
    const [rows, setRows] = React.useState(amortizations);

    //API Call
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const headers = {
                Authorization: `Bearer ${token}`,
            };
            axios
                .post("/amortizations", {}, { headers: headers })
                .then((response) => {
                    console.log("API Response:", response.data);
                    const amortizationData = response.data.map((item) => ({
                        ...item,
                        term: item.term,
                    }));
                    setAmortizations(amortizationData);
                    console.log(amortizationData);
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            console.error("Token not found in local storage");
        }
    }, []);

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handlePayment = (id) => async () => {
        try {
            const token = localStorage.getItem("token");
            const headers = {
                Authorization: `Bearer ${token}`,
            };
    
            const amortization = amortizations.find(
                (row) => row.payment === id
            );
            if (!amortization) {
                console.error("Amortization data not found for ID:", id);
                return;
            }
    
            const companyId = amortization.company_id;
            const amount = amortization.amount;
    
            const response = await axios.post(
                `/loans/payment/${id}`,
                { company_id: companyId, amount: amount, status: 'complete' }, // Change status to 'complete'
                { headers: headers }
            );
    
            // Update status in the local state
            const updatedAmortizations = amortizations.map((row) =>
                row.payment === id ? { ...row, status: 'completed' } : row
            );
            setAmortizations(updatedAmortizations);
    
            console.log(response.data);
            window.alert("Loan Paid ");
            navigate("/dashboard/amortizations");
        } catch (error) {
            console.error("Error:", error);
        }
    
        console.log("Edit clicked for ID:", id);
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

    const columns = [
        {
            field: "payment",
            headerName: "Payment",
            width: 95,
            align: "left",
            headerAlign: "left",
        },
        {
            field: "date",
            headerName: "Date",
            width: 250,
            align: "left",
            headerAlign: "left",
        },
        
        {
            field: "amount",
            headerName: "Amount",
            width: 100,
            align: "left",
            headerAlign: "left",
            valueFormatter: (params) => {
                return parseFloat(params.value).toLocaleString("en-PH", {
                    style: "currency",
                    currency: "PHP",
                });
            },
        },

        {
            field: "company_name",
            headerName: "Company",
            width: 150,
            align: "left",
            headerAlign: "left",
        },
        {
            field: "status",
            headerName: "Status",
            width: 250,
            align: "left",
            headerAlign: "left",
        },
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 100,
            cellClassName: "actions",
            getActions: ({ id }) => {
                const amortization = amortizations.find(row => row.payment === id);
                if (!amortization) {
                    console.error("Amortization data not found for ID:", id);
                    return null; 
                }
                
                const { status } = amortization;
        
                if (status === 'completed') {
                    return [
                        <Typography key="paid" variant="contained" disabled>
                            Paid
                        </Typography>,
                    ];
                } else {
                    return [
                        <Button key="pay" variant="contained" onClick={handlePayment(id)}>
                            Pay
                        </Button>,
                    ];
                }
            },
        },
        
    ];

    return (
        <Layout>
            <Box
                sx={{
                    height: 800,
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
                    rows={amortizations}
                    columns={columns}
                    getRowId={(row) => row.payment}
                    editMode="row"
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={handleRowModesModelChange}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    slots={{
                        toolbar: EditToolbar,
                    }}

                    initialState={{
                        ...rows.initialState,
                        pagination: { paginationModel: { pageSize: 5 } },
                      }}

                    autoPageSize {...rows}
                    slotProps={{
                        toolbar: { setRows, setRowModesModel },
                    }}
                >
                </DataGrid>
            </Box>
        </Layout>
    );
}
