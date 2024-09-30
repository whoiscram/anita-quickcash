import * as React from "react";

import Layout from "../components/Layout";

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
import {useAuth} from '../hooks/loginAuth';
import { Typography } from "@mui/material";

function EditToolbar(props) {

    const navigate = useNavigate();


    const handleClick = () => {
        //api call new page 
        navigate('/dashboard/company/add');
      };

    return (
        <GridToolbarContainer>
             <Typography variant="h3" component="h2">
                Companies
            </Typography>
            <Button
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleClick}
            >
                Add record
            </Button>
        </GridToolbarContainer>
    );
}

export default function CompanyGrid() {
    const [rowModesModel, setRowModesModel] = React.useState({});
    const [state, actions] = useAuth();
    const {userRoles} = state;
    const [company, setCompany] = useState([]);
    const navigate = useNavigate();
    const [rows, setRows] = React.useState(company);

    //API Call
    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = {
                    'Authorization': `Bearer ${token}`
                };
    
                const response = await axios.post("/company", {}, { headers: headers });
                setCompany(response.data);
            } catch (error) {
                console.error("Error fetching company data:", error);
            }
        };
    
        fetchCompany();
    }, []);
    
    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    //API CALL CRUD
    const handleEditClick = (id) => async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = {
                Authorization: `Bearer ${token}`,
            };
    
            const response = await axios.post(`/company/edit/${id}`, {}, { headers });
            console.log(response.data);
            navigate(`/dashboard/company/edit/${id}`); // Navigate to the edit page
        } catch (error) {
            console.error("Error:", error);
            window.alert("Error occurred You dont Have The Right Permission"); 
        }
    };
    
    

    const handleSaveClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View },
        });
    };

    const handleDeleteClick = (id) => () => {
        // setRows(rows.filter((row) => row.id !== id));
        console.log("Delete me");
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
        { field: "id", headerName: "ID", width: 180, editable: true },
        {
            field: "name",
            headerName: "Company",
            width: 500,
            align: "left",
            headerAlign: "left",
            editable: true,
        },
        {
            field: "capital",
            headerName: "Capital",
            width: 100,
            align: "left",
            headerAlign: "left",
            editable: true,
            valueFormatter: (params) => {
                // Format the capital amount with commas
                return parseFloat(params.value).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' });
                
            }
        },

        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 100,
            cellClassName: "actions",
            getActions: ({ id }) => {
                const isInEditMode =
                    rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            sx={{
                                color: "primary.main",
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
                        color="inherit"
                    />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        onClick={handleDeleteClick(id)}
                        color="inherit"
                    />,
                ];
            },
        },
    ];

    return (
        <Layout>
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
                    rows={company}
                    columns={columns}
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
                />
            </Box>
        </Layout>
    );
}
