import React, { useState, useEffect } from "react";
import {
    AppBar, Toolbar, Typography, TextField, InputAdornment, Button, Box, List, ListItem, ListItemButton, Table, TableBody, TableCell, CircularProgress,
    TableContainer, TableHead, TableRow, Paper, Card, Switch, FormControlLabel, styled, IconButton, Dialog
} from "@mui/material";
import ListItemContent from "@mui/joy/ListItemContent";
import "./Masters.scss";
import Verticals from "./Verticals/Verticals";
import Role from "./Role/Role";
import UnitConversion from "./UnitConversion/UnitConversion";
import ProductModules from "./ProductModules/Product";
import Equipment from "./Equipment/Equipment";
import Upload from "../Upload/Upload";
import ViewEquipment from "./Equipment/ViewEquipment/ViewEquipment";
import EditEquipment from "./Equipment/EditEquipment/EditEquipment";
import axios from 'axios';
import DeleteDialog from "../DeleteDialog";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye, faFile, faFileUpload, faSearch, faTrashAlt, faXmark } from "@fortawesome/pro-regular-svg-icons";
import ViewDocument from "./ViewDocument/ViewDocument";
import Slide from '@mui/material/Slide';
import DocumentClick from "./Document/DocumentClick";
import { useSelector } from 'react-redux';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});
function Masters() {
    const [searchTerm, setSearchTerm] = useState("");
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };
    const [isLoading, setLoading] = useState(true);
    const [showNewButton, setShowNewButton] = useState(false);
    const [showProduct, setShowProduct] = useState(false);
    const [showModule, setShowModule] = useState(false);
    const [upload, setUpload] = useState(false);
    const [editEquipmentButton, setEditEquipmentButton] = useState(false);
    const [editVertical, setEditVertical] = useState(false);
    const [editRole, setEditRole] = useState(false);
    const [viewEquipment, setViewEquipment] = useState(false);
    const [editVerticalData, setEditVerticalData] = useState(null);
    const [editRoleData, setEditRoleData] = useState(null);
    const [editEquipmentData, setEditEquipmentData] = useState(null);
    const [viewEquipmentData, setViewEquipmentData] = useState(null);
    const [verticalProps, setVerticalProps] = useState({});
    const [roleProps, setRoleProps] = useState({});
    const [index, setIndex] = useState(0);
    const [items, setItems] = useState("Verticals");
    const [tableData, setTableData] = useState([]);
    const [tableDataRole, setTableDataRole] = useState([]);
    const [tableDataEquipment, setTableDataEquipment] = useState([]);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [equipmentId, setEquipmentId] = useState('');
    const [products, setProducts] = useState([]);
    const [modules, setModules] = useState([]);
    const [productIdToDelete, setProductIdToDelete] = useState(null);
    const [moduleIdToDelete, setModuleIdToDelete] = useState(null);
    const [roleIdToDelete, setRoleIdToDelete] = useState(null);
    const [verticalIdToDelete, setVerticalIdToDelete] = useState(null);
    const [base64Content, setBase64Content] = useState(null);
    const [viewDocument, setViewDocument] = useState(false);
    const [editProduct, setEditProduct] = useState(false);
    const [productIdToEdit, setProductIdToEdit] = useState(false);
    const [editModule, setEditModule] = useState(false);
    const [moduleIdToEdit, setModuleIdToEdit] = useState(false);
    const [viewDocumentFile, setViewDocumentFile] = useState(false);
    const [documentId, setDocumentId] = useState(false);
    const [certificateIds, setCertificateIds] = useState([]);
    const [value, setValue] = useState('products');
    const BASE_URL = useSelector(state => state.editableReducer.baseUrlIs);

    const handleNewButtonClick = () => {
        setShowNewButton(true);
    };
    const handleClose = () => {
        setShowNewButton(false);
        setShowProduct(false);
        setShowModule(false);
        setUpload(false);
        setEditVertical(false);
        setEditRole(false);
        setEditProduct(false);
        setEditModule(false);
        setViewDocumentFile(false);
    }
    const menuItems = [
        'Verticals', 'Product Modules', 'Currency/ TimeZone/ Unit Conversion', 'Equipment Master', 'Role Privileges'
    ];

    const IOSSwitch = styled((props) => (
        <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />))
        (({ theme }) => ({
            width: 42, height: 26, padding: 0,
            '& .MuiSwitch-switchBase': {
                padding: 0,
                margin: 2,
                transitionDuration: '300ms',
                '&.Mui-checked': {
                    transform: 'translateX(16px)',
                    color: '#efefef',
                    '& + .MuiSwitch-track': {
                        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
                        opacity: 1,
                        border: 0,
                    },
                    '&.Mui-disabled + .MuiSwitch-track': {
                        opacity: 0.5,
                    },
                },
                '&.Mui-focusVisible .MuiSwitch-thumb': {
                    color: '#33cf4d',
                    border: '6px solid #efefef',
                },
                '&.Mui-disabled .MuiSwitch-thumb': {
                    color:
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[100]
                            : theme.palette.grey[600],
                },
                '&.Mui-disabled + .MuiSwitch-track': {
                    opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
                },
            },
            '& .MuiSwitch-thumb': {
                boxSizing: 'border-box',
                width: 22,
                height: 22,
            },
            '& .MuiSwitch-track': {
                borderRadius: 26 / 2,
                backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
                opacity: 1,
                transition: theme.transitions.create(['background-color'], {
                    duration: 500,
                }),
            },
        }));

    const handleMenuItemClick = (idx,item) => {
        setLoading(true);
        setIndex(idx);
        setItems(item)
        // fetchTable();
        // fetchVertical();
        // fetchDataRole();
        // fetchDataProduct();
        // handleViewModuleClick();
    };
    const handleAddClick = () => {
        setShowProduct(true);
        setShowModule(false);
    }
    const handleModuleAddClick = () => {
        setShowModule(true);
        setShowProduct(false);
    }
    const handleUploadBtn = () => {
        setUpload(true);
    }
    const handleSaveData = () => {
        fetchVertical();
        fetchDataProduct();
        handleViewModuleClick();
        setEditVertical(false);
        setShowNewButton(false);
        fetchDataRole();
        setVerticalProps({});
        setEditProduct(false);
        setEditModule(false)
    };

    const handleSaveDataEquipment = () => {
        setShowNewButton(false);
        setEditEquipmentButton(false);
        fetchTable();
    };
    const handleDocumentView = (product, certificateIds) => {
        setViewDocumentFile(true);
        setDocumentId(product);
        setCertificateIds(certificateIds);
        setValue('products');
    }
    const handleDocumentViewModule = (product, certificateIds) => {
        setViewDocumentFile(true);
        setDocumentId(product);
        setCertificateIds(certificateIds);
        setValue('modules');
    }
    //Endpoint for Equipment list table
    const fetchTable = () => {
        const apiUrl = `${BASE_URL}global_master_app/api/equipment/`;
        axios.get(apiUrl)
            .then(response => {
                setLoading(false);
                setTableDataEquipment(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };
    //Endpoint for ViewEquipment
    const handleViewEquipmentClick = async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}global_master_app/api/equipment/?id=${id}`);
            setViewEquipmentData(response.data);
            setViewEquipment(true);
        } catch (error) {
            console.error('Error fetching equipment data:', error);
        }
    };
    //Endpoint for Edit Equipment
    const handleEditEquipmentClick = async (id, rowIndex3) => {
        setEditEquipmentButton(true);
        try {
            const response = await axios.get(`${BASE_URL}global_master_app/api/equipment/?id=${id}`);
            if (response.data) {
                const editedEquipmentData = response.data;
                setEditEquipmentData(editedEquipmentData);
            }
        } catch (error) {
            console.error('Error fetching equipment data for editing:', error);
        }
    };
    //Endpoint for DeleteEquipment
    const handleDeleteButtonClick = (itemId) => {
        if (itemId !== null) {
            setShowDeleteConfirmation(true);
            setEquipmentId(itemId);
        }
    };
    const handleDeleteCancel = () => {
        setShowDeleteConfirmation(false);
    };
    const handleDeleteEquipment = async () => {
        try {
            const response = await axios.delete(`${BASE_URL}global_master_app/api/equipment/?id=${equipmentId}`);
            if (response.status === 200) {
                const updatedTableData = [...tableDataEquipment];
                setTableDataEquipment(updatedTableData);
                fetchTable();
            }
        } catch (error) {
            console.error('Error occurred during deletion:', error.message);
        }
        setShowDeleteConfirmation(false);
    };
    //EndPoint for vertical table
    const fetchVertical = () => {
        axios.get(`${BASE_URL}global_master_app/api/verticals/`)
            .then(response => {
                setLoading(false);
                setTableData(response.data);
            })
            .catch(error => console.error('Error fetching data:', error));
    };

    useEffect(() => {
        if(items === "Verticals"){
            fetchVertical();
        } else if(items === "Role Privileges"){
            fetchDataRole();
        }else if(items === "Product Modules"){
            fetchDataProduct();
        }else if(items === "Equipment Master"){
            fetchTable();
        }else if(items === "Currency/ TimeZone/ Unit Conversion"){
            setLoading(false)
        }
    }, [items]);
    //EndPOiont for delete Verticals
    const handleDeleteVerticalClick = (rowId) => {
        setVerticalIdToDelete(rowId);
        setShowDeleteConfirmation(true);
    };
    const handleDeleteVertical = async () => {
        try {
            await axios.delete(`${BASE_URL}global_master_app/api/verticals/?id=${verticalIdToDelete}`);
            console.log("delete successful")
        } catch (error) {
            console.error('Error deleting data:', error);
        }
        fetchVertical();
    };
    const handleEditVerticalClick = async (rowIndex) => {
        setEditVertical(!editVertical);
        if (!editVertical) {
            setShowNewButton(true);
            const editedVerticalData = tableData[rowIndex];
            setEditVerticalData(editedVerticalData);
        }
    };
    //EndPoint for Role table
    const fetchDataRole = async () => {
        try {
            const response = await axios.get(`${BASE_URL}global_master_app/api/roles_privileges/`);
            const data = response.data;
            setLoading(false)
            const processedData = data.map((item) => ({
                id: item.id,
                name: item.name,
                selectedPrivileges: item.privileges.map(privilege => privilege.name).join(', '),
                roleDescription: item.description,
            }));

            setTableDataRole(processedData);
        } catch (error) {
            console.error('Error fetching role data:', error);
        }
    };
    //endpoint to delete the Role
    const handleDeleteRoleClick = (roleId) => {
        setRoleIdToDelete(roleId);
        setShowDeleteConfirmation(true);
    };
    const handleDeleteRole = async () => {
        try {
            const response = await axios.delete(`${BASE_URL}global_master_app/api/roles_privileges/?id=${roleIdToDelete}`);
            console.log('DELETE request successful:', response.data);
        } catch (error) {
            console.error('Error making DELETE request:', error);
        }
        setShowDeleteConfirmation(false);
        fetchDataRole();
    };

    const handleEditRole = async (rowIndex4) => {
        setEditRole(!editRole);
        if (!editRole) {
            setShowNewButton(true);
            setEditRoleData(rowIndex4)
        }
    };
    const handleSaveDataRole = () => {
        fetchDataRole();
        setEditRole(false);
        setShowNewButton(false);
        //  setEditButton(false);
        setRoleProps({});
    };
    //Endpoint to fetch the product table
    const fetchDataProduct = async () => {
        axios.get(`${BASE_URL}global_master_app/api/products/`)
            .then(response => {
                setLoading(false)
                setProducts(response.data);
            })
            .catch(error => console.error('Error fetching data:', error));
    };
    //Endpoint to delete the product table
    const handleDeleteProductClick = (productId) => {
        setProductIdToDelete(productId);
        setShowDeleteConfirmation(true);
    };

    const handleDeleteProductConfirmed = () => {
        if (productIdToDelete !== null) {
            axios.delete(`${BASE_URL}global_master_app/api/products/?id=${productIdToDelete}`)
                .then(response => {
                    console.log('Product deleted successfully:', response.data);
                    fetchDataProduct();
                })
                .catch(error => {
                    console.error('Error deleting product:', error);
                });
            setProductIdToDelete(null);
        }
        setShowDeleteConfirmation(false);
    };
    //handleEditProduct
    const handleEditProductClick = (productId) => {
        setProductIdToEdit(productId);
        setEditProduct(true);

    }
    const handleEditModuleClick = (moduleId) => {
        setModuleIdToEdit(moduleId);
        setEditModule(true);

    }
    //Endpoint to fetch the Module table
    const handleViewModuleClick = (productId) => {
        axios.get(`${BASE_URL}global_master_app/api/modules/?product_id=${productId}`)
            .then(response => {
                setModules(response.data);
            })
            .catch(error => console.error('Error fetching data:', error));

    }
    //Endpoint to Delete the Module table
    const handleDeleteModuleClick = (moduleId) => {
        setModuleIdToDelete(moduleId);
        setShowDeleteConfirmation(true);
    };
    const handleDeleteModuleConfirmed = () => {
        if (moduleIdToDelete !== null) {
            axios.delete(`${BASE_URL}global_master_app/api/modules/?id=${moduleIdToDelete}`)
                .then(response => {
                    console.log('Module deleted successfully:', response.data);
                    handleViewModuleClick();
                })
                .catch(error => {
                    console.error('Error deleting product:', error);
                });
            setModuleIdToDelete(null);
        }     
    };

    const handleSwitchChange = (event, productId, status) => {
        const isActive = event.target.checked;
        const productIds = productId;

        axios.put(`${BASE_URL}global_master_app/api/products/?id=${productIds}&active=${isActive}`)
            .then(response => {
                console.log('Product activation status updated successfully:', response.data);
                fetchDataProduct();
            })
            .catch(error => {
                console.error('Error updating product activation status:', error);
            });
    };
    const handleSwitchChangeModule = (event, moduleId) => {
        const isActiveModule = event.target.checked;
        const moduleIds = moduleId;

        axios.put(`${BASE_URL}global_master_app/api/modules/?id=${moduleIds}&active=${isActiveModule}`)
            .then(response => {
                console.log('Product activation status updated successfully:', response.data);
                handleViewModuleClick();
            })
            .catch(error => {
                console.error('Error updating product activation status:', error);
            });
    };
    return (
        <>
            <AppBar position="static" className="appbar">
                <Toolbar className="masters-toolbar">
                    <Typography variant="h6" className="masters-title" component="div">Masters</Typography>
                    <div className="masters-head-right">
                        <TextField id="search" type="search" className="search" value={searchTerm} onChange={handleSearchChange}
                            placeholder="Search"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end" className="search-icon"> <FontAwesomeIcon className="table-icon" icon={faSearch} /></InputAdornment>
                                ),
                            }}
                        />
                        {index === 3 && <Button className="masters-btn-upload" onClick={handleUploadBtn}><FontAwesomeIcon className="table-icon" icon={faFileUpload} /> Upload</Button>}
                        {index !== 1 && <Button className="masters-btn-new" onClick={handleNewButtonClick}> +New</Button>}
                    </div>
                </Toolbar>
            </AppBar>
            <Box className="Box sub-side-nav-box" sx={{ py: 2, pr: 1, width: 300 }}>
                <List>
                    {menuItems.map((item, idx) => (
                        <ListItem>
                            <ListItemButton
                                className="sub-ListItemButton" selected={index === idx} onClick={() => handleMenuItemClick(idx,item)}
                                sx={{
                                    backgroundColor: index === idx ? '#CA7300' : 'transparent',
                                    color: index === idx ? 'white' : 'inherit',
                                }}
                            >
                                <ListItemContent className="sub-ListItemContent">{item}</ListItemContent>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
            {isLoading ? (
                <Box className='new-loader'>
                    <CircularProgress className="circular-progress-lens" />
                </Box>
            ) : (
                index === 0 && (
                    <TableContainer component={Paper} className="table-container">
                        <Table>
                            <TableHead className="vertical-table-head">
                                <TableRow className="vertical-tabel-row">
                                    <TableCell className="vertical-head-cell">S.No</TableCell>
                                    <TableCell className="vertical-head-cell">Vertical Name</TableCell>
                                    <TableCell className="vertical-head-cell">Description</TableCell>
                                    <TableCell className="vertical-head-cell">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            {tableData.length === 0 ? (
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={4} align="center">No data found</TableCell>
                    </TableRow>
                </TableBody>
            ) : (
                            <TableBody>
                                {tableData.map((row, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                        <TableCell className="vertical-column-cell">{rowIndex + 1}</TableCell>
                                        <TableCell className="vertical-column-cell">{row.name}</TableCell>
                                        <TableCell className="vertical-column-cell">{row.description}</TableCell>
                                        <TableCell className="vertical-column-cell">
                                            <FontAwesomeIcon className="table-icon" icon={faEdit} onClick={() => handleEditVerticalClick(rowIndex)} />
                                            <FontAwesomeIcon className="table-icon" icon={faTrashAlt} onClick={() => handleDeleteVerticalClick(row.id)} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
            )}
                        </Table>
                    </TableContainer>
                )
            )}
            {isLoading ? (
                <Box className='new-loader'>
                    <CircularProgress className="circular-progress-lens" />
                </Box>
            ) : (
                index === 4 &&
                <TableContainer component={Paper} className="table-container">
                    <Table>
                        <TableHead className="vertical-table-head">
                            <TableRow className="vertical-tabel-row">
                                <TableCell className="vertical-head-cell">S.No</TableCell>
                                <TableCell className="vertical-head-cell">Role</TableCell>
                                <TableCell className="vertical-head-cell">Privileges</TableCell>
                                <TableCell className="vertical-head-cell">Description</TableCell>
                                <TableCell className="vertical-head-cell">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        {tableDataRole.length === 0 ? (
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={4} align="center">No data found</TableCell>
                    </TableRow>
                </TableBody>
            ) : (
                        <TableBody>
                            {tableDataRole.map((row4, rowIndex4) => (
                                <TableRow key={rowIndex4}>
                                    <TableCell className="vertical-column-cell">{rowIndex4 + 1}</TableCell>
                                    <TableCell className="vertical-column-cell">{row4.name}</TableCell>
                                    <TableCell className="vertical-column-cell">{row4.selectedPrivileges}</TableCell>
                                    <TableCell className="vertical-column-cell">{row4.roleDescription}</TableCell>
                                    <TableCell className="vertical-column-cell">
                                        <FontAwesomeIcon className="table-icon" icon={faEdit} onClick={() => handleEditRole(row4.id)} />
                                        <FontAwesomeIcon className="table-icon" icon={faTrashAlt} onClick={() => handleDeleteRoleClick(row4.id)} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
            )}
                    </Table>
                </TableContainer>
            )}
            {isLoading ? (
                <Box className='new-loader'>
                    <CircularProgress className="circular-progress-lens" />
                </Box>
            ) : (
                index === 3 && tableDataEquipment && tableDataEquipment.length > 0 &&
                <TableContainer component={Paper} className="table-container">
                    <Table>
                        <TableHead className="vertical-table-head">
                            <TableRow className="vertical-tabel-row">
                                <TableCell className="vertical-head-cell">Image</TableCell>
                                <TableCell className="vertical-head-cell">Equipment Name</TableCell>
                                <TableCell className="vertical-head-cell">Description</TableCell>
                                <TableCell className="vertical-head-cell">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        {tableDataEquipment.length === 0 ? (
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={4} align="center">No data found</TableCell>
                    </TableRow>
                </TableBody>
            ) : (
                        <TableBody>
                            {tableDataEquipment.map((row3, rowIndex3) => (
                                <TableRow >
                                    <TableCell className="vertical-column-cell">
                                        <img src={row3.image} alt="Equipment" style={{ height: '40px', width: '40px' }} />
                                    </TableCell>
                                    <TableCell className="vertical-column-cell">{row3.name}</TableCell>
                                    <TableCell className="vertical-column-cell">{row3.description}</TableCell>
                                    <TableCell className="vertical-column-cell action-cell" >
                                        <FontAwesomeIcon className="table-icon" icon={faEye} onClick={() => handleViewEquipmentClick(row3.id)} />
                                        <FontAwesomeIcon className="table-icon" icon={faEdit} onClick={() => handleEditEquipmentClick(row3.id)} />
                                        <FontAwesomeIcon className="table-icon" icon={faTrashAlt} onClick={() => handleDeleteButtonClick(row3.id)} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
            )}
                    </Table>
                </TableContainer>
            )}
            {isLoading ? (
                <Box className='new-loader'>
                    <CircularProgress className="circular-progress-lens" />
                </Box>
            ) : (
                index === 1 &&
                <TableContainer component={Paper} className="table-container" style={{ display: 'flex' }}>
                    <Box className='product-content-box'>
                        <Box className='product-title'>
                            <Typography className="product-title-name">Product</Typography>
                            <Card className="product-add-icon" onClick={handleAddClick}>+</Card>
                        </Box>
                        {products.map((product, index) => (
                            <Box className='product-table-main'>
                                <Box className='product-table'>
                                    <Typography className="product-table-text">Product Name: <span>{product.name}</span></Typography>

                                    <Box className='icon-table'>
                                        <FormControlLabel
                                            control={<IOSSwitch sx={{ m: 1 }} onChange={(event) => handleSwitchChange(event, product.id, product.status)} checked={product.status} />}
                                            label={product.status ? "Active" : "Inactive"}
                                        />
                                        <Box className="product-table-delete" onClick={() => handleDocumentView(product.id, product.certificate_documents_ids)} >
                                            <FontAwesomeIcon className="table-icon" icon={faFile} /></Box>
                                        <Box className="product-table-delete" onClick={() => handleEditProductClick(product.id)}>
                                            <FontAwesomeIcon className="table-icon" icon={faEdit} /></Box>
                                        <Box className="product-table-delete" onClick={() => handleDeleteProductClick(product.id)}>
                                            <FontAwesomeIcon className="table-icon" icon={faTrashAlt} /></Box>
                                    </Box>

                                </Box>
                                <Box className='product-table-release'>
                                    <Typography className='version'>Version:<span>{product.version_type}</span></Typography>
                                    <Typography className='version'>Release Date:<span>{product.release_date}</span></Typography>
                                </Box>
                                <Box className='product-table-release version-description'>
                                    <Typography className='version '>Description:<span>{product.description}</span></Typography>

                                </Box>
                                <Box className='view-modules-box'>
                                    <Button className='view-modules' onClick={() => handleViewModuleClick(product.id)}>View Modules</Button>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                    <Box className='product-content-box'>
                        <Box className='product-title'>
                            <Typography className="product-title-name">Module</Typography>
                            <Card className="product-add-icon" onClick={handleModuleAddClick}>+</Card>
                        </Box>
                        {modules.map((module, index) => (
                            <Box className='product-table-main'>
                                <Box className='product-table'>
                                    <Typography className="product-table-text">Module Name: <span>{module.name}</span></Typography>

                                    <Box className='icon-table'>
                                        <FormControlLabel
                                            control={<IOSSwitch sx={{ m: 1 }} onChange={(event) => handleSwitchChangeModule(event, module.id, module.status)} checked={module.status} />}
                                            label={module.status ? "Active" : "Inactive"}
                                        />
                                        <Box className="product-table-delete" onClick={() => handleDocumentViewModule(module.id, module.certificate_documents_ids)} >
                                            <FontAwesomeIcon className="table-icon" icon={faFile} /></Box>
                                        <Box className="product-table-delete" onClick={() => handleEditModuleClick(module.id)}>
                                            <FontAwesomeIcon className="table-icon" icon={faEdit} /></Box>
                                        <Box className="product-table-delete" onClick={() => handleDeleteModuleClick(module.id)}> <FontAwesomeIcon className="table-icon" icon={faTrashAlt} /></Box>
                                    </Box>
                                </Box>
                                <Box className='product-table-release'>
                                    <Typography className='version'>Product Name:<span>{module.product_name}</span></Typography>
                                </Box>
                                <Box className='product-table-release'>
                                    <Typography className='version'>Version:<span>{module.version_type}</span></Typography>
                                    <Typography className='version'>Release Date:<span>{module.release_date}</span></Typography>
                                </Box>
                                <Box className='product-table-release'>
                                    <Typography className='version'>Description:<span> {module.description}</span></Typography>
                                </Box>

                            </Box>
                        ))}
                    </Box>
                </TableContainer>
            )}
            {viewDocumentFile && <DocumentClick onClose={handleClose} documentId={documentId} certificateIds={certificateIds} value={value} />}
            {index === 0 && showNewButton === true && <Verticals onClose={handleClose} onSave={handleSaveData} isEditMode={editVertical} verticalEditData={editVerticalData}{...verticalProps} />}
            {index === 4 && showNewButton === true && <Role onClose={handleClose} onSaveRole={handleSaveDataRole} isEditModeRole={editRole} roleEditData={editRoleData} {...roleProps} />}
            {index === 3 && showNewButton === true && <Equipment onClose={handleClose} onSaveEquipment={handleSaveDataEquipment} />}
            {index === 2 && <TableContainer component={Paper} className="table-container"><UnitConversion /></TableContainer>}
            {(editProduct || showProduct) && <ProductModules onClose={handleClose} showProduct={showProduct} onSave={handleSaveData} productIdToEdit={productIdToEdit} editProduct={editProduct} />}
            {(editModule || showModule) && <ProductModules onClose={handleClose} showModule={showModule} onSave={handleSaveData} moduleIdToEdit={moduleIdToEdit} editModule={editModule} />}
            {upload && <Upload onClose={handleClose} />}
            {viewEquipment && (<ViewEquipment onClose={() => setViewEquipment(false)} equipmentData={viewEquipmentData} />)}
            {editEquipmentButton && (<EditEquipment onClose={() => setEditEquipmentButton(false)} equipmentData={editEquipmentData} />)}
            {showDeleteConfirmation && <DeleteDialog
                Cancel={handleDeleteCancel}
                Confirm={() => {
                    handleDeleteEquipment();
                    handleDeleteProductConfirmed();
                    handleDeleteRole();
                    handleDeleteModuleConfirmed();
                    handleDeleteVertical();
                }}
                show={showDeleteConfirmation}
            />}

        </>
    );
}

export default Masters;
