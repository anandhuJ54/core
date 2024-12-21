import  React, { useState,useRef } from 'react';
import axios from 'axios';
import {
    Typography, Box, IconButton, Button, TextField, FormControlLabel, Checkbox, Table,
     TableBody, TableCell, TableContainer, TableHead, TableRow,Slide,Dialog
} from "@mui/material";
import './Attribute.scss';
import { Textarea } from '@mui/joy';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { faEdit, faTrashAlt, faXmark } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

export default function Attribute(props) {
    const { equipmentData ,handleAtributeClear,handleCloseAllTabs} = props
    const [open, setOpen] = useState(true);
    const [isCharacteristicCurveChecked, setIsCharacteristicCurveChecked] = useState(false);
    const [attributes, setAttributes] = useState([]);
    const [attributeName, setAttributeName] = useState('');
    const [description, setDescription] = useState('');
    const [unit, setUnit] = useState(null);
    const [tableName, setTableName] = useState(null);
    const [value, setValue] = useState(null);
    const [documentName, setDocumentName] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingAttribute, setEditingAttribute] = useState(null);
    const [uploadedFileName, setUploadedFileName] = useState('');
    const [parameters, setParameters] = useState([]);
    const BASE_URL = useSelector(state => state.editableReducer.baseUrlIs);

    // Clear the attribute field
    const handleClear = () => {
        setAttributeName('');
        setDescription('');
        setUnit('');
        setValue('');
        setDocumentName('');
        setTableName('')
    };
    const handleClose = () => {
        setOpen(false);
        handleAtributeClear()
    };
    const handleSave = () => {
        handleClose();
        const postData = {
            name:  equipmentData.name,
            description: equipmentData.description,
            make: equipmentData.make,
            model: equipmentData.model,
            year: equipmentData.year,
            image: { key: equipmentData.Image },
            parameters: parameters,
        };
        axios.post(`${BASE_URL}global_master_app/api/equipment/`, postData)
        .then(response => {
            console.log('POST success:', response.data);
        })
        .catch(error => {
            console.error('Error making POST request:', error);
        });
        handleCloseAllTabs()
    };

    const handleAdd = () => {
        if (editingIndex !== null && editingAttribute) {
            // Update the existing attribute after Edit
            const updatedAttributes = [...attributes];
            updatedAttributes[editingIndex] = {
                sNo: editingAttribute.sNo,
                attributeName: attributeName,
                unitOfMeasure: unit,
                value: value ,
                document: uploadedFileName,
                description: description,
            };
            setAttributes(updatedAttributes);
            setParameters(updatedAttributes)
            handleClear();
        } else {
            // Add a new attribute to the table and parameters state
            const newAttribute = {
                sNo: attributes.length + 1,
                attributeName: attributeName,
                characteristics_curve:tableName ? 1 : 0,
                tableName:isCharacteristicCurveChecked ? tableName : null,
                unitOfMeasure: !isCharacteristicCurveChecked ? unit : null,
                value: !isCharacteristicCurveChecked ? value : null,
                document:uploadedFileName || null,
                documentName:documentName||null,
                description: description,
            };
            setAttributes([...attributes, newAttribute]);
            setParameters([...parameters, {
                attribute_name: newAttribute.attributeName,
                description: newAttribute.description,
                characteristics_curve: newAttribute.characteristics_curve,
                value: newAttribute.value,
                unit: newAttribute.unitOfMeasure,
                table_name: tableName,
                documentName:documentName||null,
                document: newAttribute.document,
            }]);
            handleClear(); 
        }
    };
    
//Delete the attribute from the table
    const handleDelete = (index) => {
        const updatedAttributes = [...attributes];
        updatedAttributes.splice(index, 1);
        setAttributes(updatedAttributes);
        setParameters(updatedAttributes)
    };
    //Prefill the attribute from the table on click of edit
    const handleEdit = (index) => {
        setEditingIndex(index);
        setEditingAttribute(attributes[index]);
        setAttributeName(attributes[index].attributeName);
        setTableName(attributes[index].tableName);
        setDescription(attributes[index].description);
        setUnit(attributes[index].unitOfMeasure);
        setValue(attributes[index].value ); 
    };
    //File upload and Drag & drop
    const fileInputRef = useRef(null);
    const handleBoxClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const files = event.target.files || event.dataTransfer.files;  
        if (files.length > 0) {
            const file = files[0];
            setDocumentName(file.name);
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Content = reader.result.split(',')[1];
                setUploadedFileName(base64Content);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleDragOver = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    };
    const handleDrop = (event) => {
        event.preventDefault();
        handleFileChange(event);
    };
    return (
        <div className='attribute-dialog'>
            <Dialog
                className="attribute-dialog-main"
                open={open}
                TransitionComponent={Transition}
                keepMounted
                aria-describedby="alert-dialog-slide-description"
                onClose={handleClose}
            >
                <Box className="attribute-box-main">
                    <Typography className="attribute-title" >
                        Create New Attribute
                        <IconButton className="attribute-close"  >
                        <FontAwesomeIcon icon={faXmark} onClick={handleClose} />
                        </IconButton>
                    </Typography>
                </Box>
                <Box className='attribute-content vertical-content'>
                    <Box className='equipment-table'>
                        <Typography className='equipment-table-head'> Equipment Name:<span>{equipmentData.name}</span></Typography>
                        <Typography className='equipment-table-content'> Model:<span>{equipmentData.model}</span></Typography>
                        <div className='attribute-make'>
                            <Typography className='equipment-table-content'> Make:<span>{equipmentData.make}</span></Typography>
                            <Typography className='equipment-table-content'> Year:<span>{equipmentData.year}</span></Typography>
                        </div>
                        <Typography className='equipment-table-content'> Description:<br></br><span>{equipmentData.description}</span></Typography>
                    </Box>
                    <Typography className='label'> Attribute Name</Typography>
                    <TextField className='attribute-textfield' placeholder='Enter the Attribute Name' value={attributeName} onChange={(e) => setAttributeName(e.target.value)}></TextField>
                    <FormControlLabel className='attribute-checkbox' control={<Checkbox checked={isCharacteristicCurveChecked} onChange={(e) => setIsCharacteristicCurveChecked(e.target.checked)} />} label="Characteristic Curve" />
                    <Typography className='label'> Description</Typography>
                    <Textarea className='attribute-textfield vertical-description' placeholder='Enter the Description' value={description} onChange={(e) => setDescription(e.target.value)}> </Textarea>
                    <div className='attribute-unit'>
                    {isCharacteristicCurveChecked &&
                        <div style={{ width:'100%' }}>
                            <Typography className='label'> Table Name</Typography>
                            <TextField className='attribute-textfield' placeholder='Enter the Table Name' value={tableName} onChange={(e) => setTableName(e.target.value)}></TextField>
                        </div>
}
                        {!isCharacteristicCurveChecked && (<>
                            <div style={{ width:'48%' }}>
                            <Typography className='label'> Unit Of Measure</Typography>
                            <TextField className='attribute-textfield' placeholder='Enter the Unit' value={unit} onChange={(e) => setUnit(e.target.value)}></TextField>
                        </div>
                            <div style={{ width: '48%' }}>
                                <Typography className='label'> Value</Typography>
                                <TextField className='attribute-textfield' placeholder='Enter the Value' value={value} onChange={(e) => setValue(e.target.value)} />
                            </div>
                            </>
                        )}
                    </div>
                    <Typography className='label'> Upload</Typography>
                    <Box
                        className='upload-card'
                        onClick={handleBoxClick}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        <CloudUploadOutlinedIcon className='cloud-upload' />
                        <div>
                            <Typography className='upload-text'>
                                Drag and Drop Files or
                                <Button onClick={handleBoxClick}> Browse</Button>
                            </Typography>
                            <Typography className='upload-format'>Supported Formats: .xlss, .pdf</Typography>
                            {uploadedFileName && <Typography className='upload-format'>File Uploaded: {documentName}</Typography>}
                        </div>
                        <input
                            type="file"
                            accept=".xlsx, .pdf"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                    </Box>
                    <Box className='upload-btns'>
                        <Button className='clear-btn' onClick={handleClear}>Clear </Button>
                        <Button className='upload-btn' onClick={handleAdd}> Add</Button>
                    </Box>
                    <TableContainer className='table-container-attribute'>
                        <Table className='attribute-table'>
                            <TableHead className='table-head'>
                                <TableRow className='table-row'>
                                    <TableCell className='table-cell'>S.No</TableCell>
                                    <TableCell className='table-cell'>Attribute Name</TableCell>
                                    <TableCell className='table-cell'>TableName</TableCell>
                                    <TableCell className='table-cell'>Unit Of Measure</TableCell>
                                    <TableCell className='table-cell'>Value</TableCell>
                                    <TableCell className='table-cell'>Document</TableCell>
                                    <TableCell className='table-cell'>Description</TableCell>
                                    <TableCell className='table-cell'>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody className='table-body'>
                                {attributes.map((attribute, index) => (
                                    <TableRow className='table-row' key={attribute.sNo}>
                                        <TableCell className='table-cell'>{attribute.sNo}</TableCell>
                                        <TableCell className='table-cell'>{attribute.attributeName}</TableCell>
                                        <TableCell className='table-cell'>{attribute.tableName || '-'}</TableCell>
                                        <TableCell className='table-cell'>{attribute.unitOfMeasure || '-'}</TableCell>
                                        <TableCell className='table-cell'>{attribute.value || '-'}</TableCell>
                                        <TableCell className='table-cell'>{attribute.documentName || ''}</TableCell>
                                        <TableCell className='table-cell'>{attribute.description || ''}</TableCell>
                                        <TableCell className='table-cell'>
                                            <div className='actions'>
                                                <FontAwesomeIcon icon={faEdit} onClick={() => handleEdit(index)} />
                                                <FontAwesomeIcon icon={faTrashAlt} onClick={() => handleDelete(index)} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                <Box className='attribute-vertical-footer'>
                    <Button className='attribute-vertical-clear' onClick={handleClose}> Back</Button>
                    <Button className='attribute-vertical-save' onClick={handleSave} >Save</Button>
                </Box>
            </Dialog>
        </div>
    );
}
