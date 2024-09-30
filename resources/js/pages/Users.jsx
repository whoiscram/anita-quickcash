import * as React from "react";

import Layout from "../components/Layout";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/loginAuth";
import EditIcon from "@mui/icons-material/Edit";
import {
    GridRowModes,
    DataGrid,
    GridToolbarContainer,
    GridActionsCellItem,
    GridRowEditStopReasons,
} from "@mui/x-data-grid";
import { Typography } from "@mui/material";

function EditToolbar(props) {
    const [state, actions] = useAuth(); // Access the authentication state using useAuth
    const { userRoles, company_id } = state;
    const { setRows, setRowModesModel } = props;
    const navigate = useNavigate();

    const handleNav = () => {
        //api call new page
        navigate("/dashboard/users/add");
    };

    return (
        <GridToolbarContainer>
            <Typography variant="h3" component="h2">
                Users
            </Typography>
            <Button onClick={handleNav}>Add User</Button>
        </GridToolbarContainer>
    );
}

export default function FullFeaturedCrudGrid() {
    const [state, actions] = useAuth();
    const { userRoles, company_id, access_token } = state;
    const [users, setUsers] = useState([]);
    const [rowModesModel, setRowModesModel] = useState({});
    const [rows, setRows] = React.useState(users);
    const navigate = useNavigate();
    console.log(userRoles);
    useEffect(() => {
        const token = localStorage.getItem("token");
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        if (userRoles === "owner") {
            axios
                .post("/users/owner", {}, { headers: headers })
                .then((response) => {
                    setUsers(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            axios
                .post(
                    "/users/filter",
                    { company_id: company_id },
                    { headers: headers }
                )
                .then((response) => {
                    setUsers(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [company_id, userRoles]);

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    //API CALL CRUD
    const handleEditClick = (id) => async () => {
        console.log("soon");
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

    const columns = [
        { field: "name", headerName: "Name", width: 180, editable: true },
        {
            field: "roles",
            headerName: "Roles",
            width: 200,
            align: "left",
            headerAlign: "left",
            renderCell: (params) => {
                return (
                    <span>
                        {params.row.roles.map((role) => role.name).join(", ")}
                    </span>
                );
            },
        },
        {
            field: "email",
            headerName: "Email",
            width: 150,
            align: "left",
            headerAlign: "left",
        },
        {
            field: "company_name",
            headerName: "Company",
            width: 150,
            align: "left",
            headerAlign: "left",
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
        {
            field: "actions",
            type: "actions",
            headerName: "Actions",
            width: 100,
            cellClassName: "actions",
            getActions: ({ id }) => {
                const isInEditMode =
                    rowModesModel[id]?.mode === GridRowModes.Edit;

                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        onClick={handleEditClick(id)}
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
                    rows={users}
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
