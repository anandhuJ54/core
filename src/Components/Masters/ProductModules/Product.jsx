import * as React from 'react';
import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import {
    Typography, Box, IconButton, Button, TextField, Card, InputAdornment, MenuItem, Select
} from "@mui/material";
import { faCloudUpload, faFileUpload, faTrashAlt, faXmark } from '@fortawesome/pro-regular-svg-icons';
import './Product.scss'
import { Textarea } from '@mui/joy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from 'axios';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

export default function ProductModules({ onClose, onSave, showModule, showProduct,productIdToEdit,editProduct,moduleIdToEdit,editModule }) {

    const [open, setOpen] = useState(true);
    const [productName, setProductName] = useState('');
    const [productList, setProductList] = useState('');
    const [products, setProducts] = useState([]);
    const [moduleName, setModuleName] = useState('');
    const [description, setDescription] = useState('');
    const [version, setVersion] = useState('');
    const [date, setDate] = useState(null);
    const [uploadedFile, setUploadedFile] = useState('');
    const [uploadedFileName, setUploadedFileName] = useState('');
    const [uploadedFileMrd, setUploadedFileMrd] = useState('');
    const [uploadedFileMrdName, setUploadedFileMrdName] = useState('');
    const [uploadedFilePrd, setUploadedFilePrd] = useState('');
    const [uploadedFilePrdName, setUploadedFilePrdName] = useState('');
    const BASE_URL = useSelector(state => state.editableReducer.baseUrlIs);
    const handleClear = () => {
        setProductName('');
        setModuleName('');
        setDescription('');
        setVersion('');
        setDate('');
    };
    const handleClose = () => {
        setOpen(false);
        onClose();
    };
    //Upload document MRD
    const handleFileChangeMrd = (event) => {
        const files = event.target.files || event.dataTransfer.files;  
        if (files.length > 0) {
            const file = files[0];
            setUploadedFileMrdName(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Content = reader.result.split(',')[1];
                setUploadedFileMrd(base64Content);
            };
            reader.readAsDataURL(file);
        }
    };
    

    const handleDragOverMrd = (event) => {
        event.preventDefault();
    };

    const handleDropMrd = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        setUploadedFileMrd(file);
    };
    const handleDeleteClickMrd = () => {
        setUploadedFileMrd(null);
    };
    const uploadCardStyleMrd = {
        background: uploadedFileMrd ? '#e8e8e8' : '#FBEDDB',
        pointerEvents: uploadedFileMrd ? 'none' : 'auto',
    };
    
    const handleFileChange = (event) => {
        const files = event.target.files || event.dataTransfer.files;  
        if (files.length > 0) {
            const file = files[0];
            setUploadedFileName(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Content = reader.result.split(',')[1];
                setUploadedFile(base64Content);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        setUploadedFile(file);
    };
    const handleDeleteClick = () => {
        setUploadedFile(null);
    };
    const uploadCardStyle = {
        background: uploadedFile ? '#e8e8e8' : '#FBEDDB',
        pointerEvents: uploadedFile ? 'none' : 'auto',
    };
    //Upload Card Prd
    const handleFileChangePrd = (event) => {
        const files = event.target.files || event.dataTransfer.files;  
        if (files.length > 0) {
            const file = files[0];
            setUploadedFilePrdName(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Content = reader.result.split(',')[1];
                setUploadedFilePrd(base64Content);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleDragOverPrd = (event) => {
        event.preventDefault();
    };

    const handleDropPrd = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        setUploadedFilePrd(file);
    };
    const handleDeleteClickPrd = () => {
        setUploadedFilePrd(null);
    };
    const uploadCardStylePrd = {
        background: uploadedFilePrd ? '#e8e8e8' : '#FBEDDB',
        pointerEvents: uploadedFilePrd ? 'none' : 'auto',
    };
    //Multiple Upload
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const handleFileChangeMUlti = (event) => {
        const files = event.target.files || event.dataTransfer.files;  
        if (files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Content = reader.result.split(',')[1];
                setUploadedFiles([...uploadedFiles, { file, base64Content }]);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleDragOverMulti = (event) => {
        event.preventDefault();
    };

    const handleDropMulti = (event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        setUploadedFiles([...uploadedFiles, ...files]);
    };

    const handleDeleteClickMulti = (index) => {
        const updatedFiles = [...uploadedFiles];
        updatedFiles.splice(index, 1);
        setUploadedFiles(updatedFiles);
    };
    const handleSave = () => {
        const formattedDate = date.toISOString().split('T')[0];   
        const commonData = {
            name: (showProduct ||editProduct) ? productName : moduleName,
            version_type: version,
            release_date: formattedDate,
            description: description,
            release_notes:[{name:uploadedFileName.name,value:uploadedFile}]  || "",
            MRD_documents: [{name:uploadedFileMrdName.name,value:uploadedFileMrd}] || "",
            PRD_design_document: [{name:uploadedFilePrdName.name,value:uploadedFilePrd}]|| "",
            certificate_documents: uploadedFiles.map(file => ({
                name:file.file.name,
                value: file.base64Content
            })),
        };
        const requestData = showProduct ? commonData : { ...commonData, product_id: productList };
    
        if (editModule) {
            const apiUrl = `${BASE_URL}global_master_app/api/modules/?id=${moduleIdToEdit}&active=true`;
            axios.put(apiUrl, requestData)
                .then(response => {
                    console.log('Module updated successfully:', response.data);
                })
                .catch(error => {
                    console.error('Error updating module:', error);
                });
        } else if (editProduct) {
            const apiUrl = `${BASE_URL}global_master_app/api/products/?id=${productIdToEdit}&active=true`;
            axios.put(apiUrl, requestData)
                .then(response => {
                    console.log('Product updated successfully:', response.data);
                })
                .catch(error => {
                    console.error('Error updating product:', error);
                });
        } else {
            const apiUrl = showProduct ? `${BASE_URL}global_master_app/api/products/` : `${BASE_URL}global_master_app/api/modules/`;
            axios.post(apiUrl, requestData)
                .then(response => {
                    console.log('Data created successfully:', response.data);
                })
                .catch(error => {
                    console.error('Error creating data:', error);
                });
        }  
        onSave();
        handleClose();
    };
    
   
    useEffect(() => {
        const fetchDataProduct = async () => {
            try {
                const response = await axios.get(`${BASE_URL}global_master_app/api/products/`);
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchDataProduct();
    }, []);
    
    useEffect(() => {
        const fetchDataProduct = async () => {
            try {
                if (editProduct && productIdToEdit) {
                    const response = await axios.get(`${BASE_URL}global_master_app/api/products/?id=${productIdToEdit}`);
                    const productData = response.data;
                   
                    setProductName(productData.name);
                    setProductList(productData.product_id);
                    setModuleName(productData.name);
                    setVersion(productData.version_type);
                    setDescription(productData.description);
                    setDate(dayjs(productData.release_date));
                    setUploadedFileName(productData.release_notes);
                    setUploadedFileMrdName(productData.MRD_documents);
                    setUploadedFilePrdName(productData.PRD_design_document);
                    setUploadedFile("null");
                    setUploadedFileMrd("null");
                    setUploadedFilePrd("null");
                    const certificateFiles = productData.certificate_documents.map((fileName, index) => {
                        return {
                            file: { name: fileName },
                            base64Content: "mull",  
                        };
                    });
                    setUploadedFiles(certificateFiles);
                }
                const productsResponse = await axios.get(`${BASE_URL}global_master_app/api/products/`);
                setProducts(productsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchDataProduct();
    }, [editProduct, productIdToEdit]);

    useEffect(() => {
        const fetchModuleData = async () => {
            try {
                if (editModule && moduleIdToEdit) {
                    const response = await axios.get(`${BASE_URL}global_master_app/api/modules/?id=${moduleIdToEdit}`);
                    const moduleData = response.data;
                    setProductList(moduleData.product.id)
                    setModuleName(moduleData.name);
                    setDescription(moduleData.description);
                    setVersion(moduleData.version_type);                
                    setUploadedFile("null");
                    setUploadedFileName(moduleData.release_notes);
                    setUploadedFileMrdName(moduleData.MRD_documents);
                    setUploadedFileMrd("null");
                    setUploadedFilePrdName(moduleData.PRD_design_document);
                    setUploadedFilePrd("null");
                    setDate(dayjs(moduleData.release_date));
                    const certificateFiles = moduleData.certificate_documents.map((fileName, index) => {
                        return {
                            file: { name: fileName},
                            base64Content: "null", 
                        };
                    });
                    setUploadedFiles(certificateFiles);
                }
            } catch (error) {
                console.error('Error fetching module data:', error);
            }
        };
    
        fetchModuleData();
    }, [editModule, moduleIdToEdit]);
    return (
        <div className='product-dialog'>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                aria-describedby="alert-dialog-slide-description"
                onClose={handleClose}
            >
                <Box className="box-main-product">
                    <Typography className="title">
                    {editModule ? 'Edit Module' : ''}
                    {editProduct ? 'Edit Product' : ''}
                        {showProduct ? 'Create Product' : ''}
                        {showModule ? 'Create Module' : ''}
                        <IconButton className="close">
                        <FontAwesomeIcon className="icon" icon={faXmark} onClick={handleClose}/>
                        </IconButton>
                    </Typography>
                </Box>
                <Box className='vertical-content'>
                    {(showProduct || editProduct) && (
                        <>
                            <Typography className='vertical-content-label'>Product Name</Typography>
                            <TextField className='vertical-text' placeholder='Enter the Product'
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)} />
                        </>
                    )}
                    {(showModule || editModule) && (
                        <>
                            <Typography className='vertical-content-label'>Product </Typography>
                            <Select
                                className='vertical-text'
                                placeholder='Enter the Product'
                                value={productList}
                                onChange={(e) => setProductList(e.target.value)}
                            >
                                {products.map((product) => (
                                    <MenuItem key={product.id} value={product.id} className='item-select'>
                                        {product.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <Typography className='vertical-content-label'>Module Name</Typography>
                            <TextField className='vertical-text' placeholder='Enter the Module'
                                value={moduleName}
                                onChange={(e) => setModuleName(e.target.value)} />
                        </>
                    )}
                    <div className='version'>
                        <div className='version-type'>
                            <Typography className='version-label'>Version Type</Typography>
                            <TextField className='version-text' placeholder='Enter the Version'
                                value={version}
                                onChange={(e) => setVersion(e.target.value)} />
                        </div>
                        <div className='version-type'>
                            <Typography className='version-label'>Release Date</Typography>
                            <LocalizationProvider dateAdapter={AdapterDayjs} className='version-text'>
                                <DemoContainer components={['DatePicker']} className='version-container'>
                                    <DatePicker format="YYYY-MM-DD" value={date}
                                        onChange={(newDate) => setDate(newDate)} className='version-picker'/>
                                </DemoContainer>
                            </LocalizationProvider>
                        </div>
                    </div>
                    <Typography className='vertical-content-label'>Description</Typography>
                    <Textarea className='vertical-description' placeholder='Enter the Description'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)} />

                    <Typography className='vertical-content-label'>Release Notes</Typography>
                    <Box
                        className='single-upload'
                        onClick={() => document.getElementById('fileInput1').click()}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        style={uploadCardStyle}
                    >
                        <FontAwesomeIcon className="icon" icon={faCloudUpload} />
                        <Typography className='product-upload-text'>Only Single File Can Upload</Typography>
                        <Card className='product-upload-icon'>
                        <FontAwesomeIcon className="icon" icon={faFileUpload} />
                        </Card>
                    </Box>
                    <input
                        id='fileInput1'
                        type='file'
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    {uploadedFile && (
                        <Box className='single-upload-complete'>
                            <Typography className='product-complete-text'>Name: {uploadedFileName.name || uploadedFileName }</Typography>
                            <Card className='product-delete-icon' onClick={handleDeleteClick}>
                            <FontAwesomeIcon className="icon" icon={faTrashAlt} />
                            </Card>
                        </Box>
                    )}
                    <Typography className='vertical-content-label'>MRD Documents</Typography>
                    <Box
                        className='single-upload'
                        onClick={() => document.getElementById('fileInput2').click()}
                        onDragOver={handleDragOverMrd}
                        onDrop={handleDropMrd}
                        style={uploadCardStyleMrd}
                    >
                        <FontAwesomeIcon className="icon" icon={faCloudUpload} />
                        <Typography className='product-upload-text'>Only Single File Can Upload</Typography>
                        <Card className='product-upload-icon'>
                        <FontAwesomeIcon className="icon" icon={faFileUpload} />
                        </Card>
                    </Box>
                    <input
                        id='fileInput2'
                        type='file'
                        style={{ display: 'none' }}
                        onChange={handleFileChangeMrd}
                    />
                    {uploadedFileMrd && (
                        <Box className='single-upload-complete'>
                            <Typography className='product-complete-text'>Name: {uploadedFileMrdName.name ||uploadedFileMrdName }</Typography>
                            <Card className='product-delete-icon' onClick={handleDeleteClickMrd}>
                            <FontAwesomeIcon className="icon" icon={faTrashAlt} />
                            </Card>
                        </Box>
                    )}
                    <Typography className='vertical-content-label'>PRD & Design Documents</Typography>
                    <Box
                        className='single-upload'
                        onClick={() => document.getElementById('fileInput3').click()}
                        onDragOver={handleDragOverPrd}
                        onDrop={handleDropPrd}
                        style={uploadCardStylePrd}
                    >
                        <FontAwesomeIcon className="icon" icon={faCloudUpload} />
                        <Typography className='product-upload-text'>Only Single File Can Upload</Typography>
                        <Card className='product-upload-icon'>
                        <FontAwesomeIcon className="icon" icon={faFileUpload} />
                        </Card>
                    </Box>
                    <input
                        id='fileInput3'
                        type='file'
                        style={{ display: 'none' }}
                        onChange={handleFileChangePrd}
                    />
                    {uploadedFilePrd && (
                        <Box className='single-upload-complete'>
                            <Typography className='product-complete-text'>Name: {uploadedFilePrdName.name || uploadedFilePrdName}</Typography>
                            <Card className='product-delete-icon' onClick={handleDeleteClickPrd}>
                            <FontAwesomeIcon className="icon" icon={faTrashAlt} />
                            </Card>
                        </Box>
                    )}
                    <Typography className='vertical-content-label'>Certificate Documents</Typography>
                    <Box
                        className='multi-upload'
                        onClick={() => document.getElementById('multiFileInput').click()}
                        onDragOver={handleDragOverMulti}
                        onDrop={handleDropMulti}
                    >
                        <FontAwesomeIcon className="icon" icon={faCloudUpload} />
                        <Typography className='multi-upload-text'>Multiple Files Can Upload</Typography>
                        <Card
                            className='multi-upload-icon'
                        >
                             <FontAwesomeIcon className="icon" icon={faFileUpload} />
                        </Card>
                    </Box>
                    <input
                        id='multiFileInput'
                        type='file'
                        style={{ display: 'none' }}
                        onChange={handleFileChangeMUlti}
                        multiple
                    />
                    {uploadedFiles.map((item, index) => (
                        <Box key={index} className='multi-upload-complete'>
                            <Typography className='product-complete-text'>Name: {item.file.name}</Typography>
                            <Card className='product-delete-icon' onClick={() => handleDeleteClickMulti(index)}>
                            <FontAwesomeIcon className="icon" icon={faTrashAlt} />
                            </Card>
                        </Box>
                    ))}
                </Box>
                <Box className='vertical-footer'>
                    <Button className='vertical-clear' onClick={handleClear}> Clear</Button>
                    {(editModule || editProduct) &&  <Button className='vertical-save' onClick={handleSave}>Update</Button>}
                    {!editModule && !editProduct &&<Button className='vertical-save' onClick={handleSave}>Save</Button>}
                </Box>
            </Dialog>
        </div>
    );
}
