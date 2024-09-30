import React, { useCallback, useMemo } from "react";
import {
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography,
    debounce,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import axios from "axios";
import Layout from "../components/Layout";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
    GridRowModes,
    DataGrid,
    GridToolbarContainer,
    GridActionsCellItem,
    GridRowEditStopReasons,
} from "@mui/x-data-grid";
import { useAuth } from "../hooks/loginAuth";
import { Clear, SearchRounded } from "@mui/icons-material";
import { escapeRegExp } from "@mui/x-data-grid/utils/utils";

function EditToolbar(props) {
    const { setRows, setRowModesModel } = props;
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/dashboard/loans/add");
    };

    return (
        <GridToolbarContainer>
            <Typography variant="h3" component="h2" gutterBottom>
                Recievable Dashboard
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

export default function LoansGrid() {
    const [state, actions] = useAuth();
    const { userRoles, company_id } = state;
    const [rowModesModel, setRowModesModel] = React.useState({});
    const [loans, setLoans] = useState([]);
    const [search, setIsSearch] = useState("");
    const [searchMemoize, setSearchMemoize] = useState("");
    const [isLoad, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const [rows, setRows] = React.useState(loans);
    useEffect(() => {
        const fetchLoans = async () => {
            try {
                // Retrieve token from local storage
                const token = localStorage.getItem("token");

                // Define headers
                const headers = {
                    Authorization: `Bearer ${token}`,
                };

                let response;
                if (userRoles == "owner" || "admin") {
                    response = await axios.post(
                        "/loans",
                        {},
                        { headers: headers }
                    );
                } else {
                    response = await axios.post(
                        `/loans/filter/${company_id}`,
                        {},
                        { headers: headers }
                    );
                }
                setLoans(response.data);
            } catch (error) {
                console.error("Error fetching loans:", error);
            }
        };
        fetchLoans();
    }, [company_id, userRoles]);

    //API CALL CRUD
    const handleEditClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.Edit },
        });
    };

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
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

    const handleChangeSearch = (event) => {
        const { value, name } = event.target;
        setIsSearch(value);
        setIsLoading(true); 
        handleSearchDebounce(value);
    };

    const handleSearchDebounce = useCallback(
        debounce((searched) => {
            setSearchMemoize(searched);
            setIsLoading(false);
        }, 1000),
        []
    );

    const clearSearch = () => {
        setSearchMemoize('');
        setIsSearch("");
    };

    // const memoizeLoans = useMemo(() => {
    //     const dataLoans = loans ?? [];
    //     if (searchMemoize != "") {
    //         const searchRegex = new RegExp(escapeRegExp(search), 'i');
    //         dataLoans = dataLoans.filter((row) =>{
    //           return Object.keys(row).some(() =>{
    //             return searchRegex.test(row['company']?.toString() ?? ''.toString());
    //           });
    //         });
    //     }
    //     return dataLoans;
    // }, [loans, searchMemoize]);

    const memoizeLoans = useMemo(() => {
        let dataLoans = loans ?? [];
        if (searchMemoize !== "") {
            console.log('i am here')
            const searchRegex = new RegExp(escapeRegExp(searchMemoize), 'i');
            dataLoans = dataLoans.filter((row) => {
                return Object.values(row).some((val) => {
                    return searchRegex.test(val?.toString() ?? '');
                });
            });
        }
        return dataLoans;
    }, [loans, searchMemoize]);
    
    const columns = [
        {
            field: "receivable",
            headerName: "Receivable",
            width: 100,
            valueFormatter: (params) => {
                return parseFloat(params.value).toLocaleString("en-PH", {
                    style: "currency",
                    currency: "PHP",
                });
            },
        },
        {
            field: "payment",
            headerName: "Payment",
            width: 80,
            align: "center",
            headerAlign: "left",
        },
        {
            field: "date",
            headerName: "Date",
            width: 150,
            align: "left",
            headerAlign: "left",
        },
        {
            field: "loan_date",
            headerName: "Loan Date",
            width: 120,
            align: "left",
            headerAlign: "left",
        },
        {
            field: "employee",
            headerName: "Employee",
            width: 120,
            align: "left",
            headerAlign: "left",
        },
        {
            field: "company",
            headerName: "Company",
            width: 150,
            align: "left",
            headerAlign: "left",
        },
        {
            field: "amortization",
            headerName: "Amortizations",
            width: 100,
            align: "center",
            headerAlign: "left",
        },
        {
            field: "total",
            headerName: "Total",
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
            field: "total_loan_amount",
            headerName: "Total Loan Amount With Interest",
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
            field: "end_of_term",
            headerName: "End of Term",
            width: 150,
            align: "left",
            headerAlign: "left",
        },
    ];

    return (
        <Layout>
            <Stack height={800} direction={"column"}>
                <Stack>
                {isLoad && <Typography>Loading...</Typography>}
                    <TextField
                        size={"small"}
                        width="25%"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => handleChangeSearch(e)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IconButton edge="end">
                                        <SearchRounded fontSize="large" />
                                    </IconButton>
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        edge="end"
                                        onClick={clearSearch}
                                    >
                                        <Clear fontSize="medium" />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Stack>
                <DataGrid
                height={800}
                    rows={memoizeLoans}
                    columns={columns}
                    editMode="row"
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={handleRowModesModelChange}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    slots={{
                        toolbar: EditToolbar,
                    }}
                    sx={{ height: 800 }}
                    initialState={{
                        ...rows.initialState,
                        pagination: { paginationModel: { pageSize: 5 } },
                    }}
                    autoPageSize
                    {...rows}
                    pageSizeOptions={[5, 10, 25]}
                    slotProps={{
                        toolbar: { setRows, setRowModesModel },
                    }}
                />
            </Stack>
        </Layout>
    );
}
