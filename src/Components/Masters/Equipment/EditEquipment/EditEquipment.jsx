import * as React from 'react';
import { useState,useRef,useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import {
    Typography, Box, IconButton, Button, TextField,Table, TableBody,FormControlLabel,Checkbox, TableCell, TableContainer, TableHead, TableRow
} from "@mui/material";
import '../Attribute/Attribute.scss';
import './EditEquipment.scss';
import { Textarea } from '@mui/joy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUpload, faEdit, faTrashAlt, faXmark } from '@fortawesome/pro-regular-svg-icons';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

export default function EditEquipment({onClose,equipmentData,onSave}) {
    const [open, setOpen] = useState(true);
    const [equipment, setEquipment] = useState('');
    const [equipmentMake, setEquipmentMake] = useState('');
    const [equipmentDescription, setEquipmentDescription] = useState('');
    const [attributes, setAttributes] = useState([]);
    const [attributeName, setAttributeName] = useState('');
    const [description, setDescription] = useState('');
    const [unit, setUnit] = useState(null);
    const [tableName, setTableName] = useState(null);
    const [value, setValue] = useState(null);
    const [uploadedFileName, setUploadedFileName] = useState('');
    const [selectedAttribute, setSelectedAttribute] = useState(null);
    const [editing, setEditing] = useState(false);
    const [equipmentModel, setEquipmentModel] = useState('');
    const [equipmentYear, setEquipmentYear] = useState('');
    const [equipmentImage, setEquipmentImage] = useState('');
    const [isCharacteristicCurveChecked, setIsCharacteristicCurveChecked] = useState(false);
    const [image, setImage] = useState('');
    const BASE_URL = useSelector(state => state.editableReducer.baseUrlIs);
    //Clear Equipment Field
    const handleClearEquipment = () => {
        setEquipment('');
        setEquipmentDescription('');
        setEquipmentModel('');
        setEquipmentYear('');
        setEquipmentMake('')
    }
    //Clear the Attribute fields
    const handleClearAttribute = () => {
        setAttributeName('')
        setDescription('')
        setUnit('')
        setValue('')
        setTableName('')
    };
    //close the Edit tab
    const handleClose = () => {
        setOpen(false);
        onClose();
    };
    const handleSave = async () => {
        handleClose();  
       
        const url = `${BASE_URL}global_master_app/api/equipment/?id=${equipmentData[0].id}`;   
        const putData = {
            name: equipment,
            description: equipmentDescription,
            make: equipmentMake,
            model: equipmentModel,
            year: equipmentYear,
            image: equipmentImage , 
            parameters: attributes.map((attribute) => ({
                id: attribute.id || null,
                attribute_name: attribute.attributeName,
                description: attribute.description,
                characteristics_curve: attribute.tableName ? 1 : 0, 
                value: attribute.value || null,
                unit: attribute.unitOfMeasure || null,
                table_name: attribute.tableName || null,
                document: attribute.document,
            })),
        };
    
        try {
            const response = await axios.put(url, putData);
            if (response.status === 200) {
                console.log('Equipment updated successfully!');
            }
        } catch (error) {
            console.error('Error while making the PUT request:', error.message);
        }
    };
    //Add or update the Attribute
    const handleAdd = () => {
        if (selectedAttribute) {
            const updatedAttributes = attributes.map(attribute =>
                attribute.sNo === selectedAttribute.sNo ? { ...attribute, attributeName, unitOfMeasure: unit, value, document: uploadedFileName, description,tableName } : attribute
            );
            setAttributes(updatedAttributes);
            setSelectedAttribute(null);
        } else {
            const newAttribute = {
                sNo: attributes.length + 1,
                attributeName,
                unitOfMeasure: unit,
                value,
                document: uploadedFileName,
                description,
                tableName,
            };
            setAttributes([...attributes, newAttribute]);
        }
        setAttributeName('');
        setDescription('');
        setUnit('');
        setValue('');
        setUploadedFileName('');
        setEditing(false);
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
             setUploadedFileName(file.name);
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
     //Edit the selected row of the table
     const handleEditTable = (attribute) => {
        setEditing(true)
        setSelectedAttribute(attribute);
        setAttributeName(attribute.attributeName);
        setDescription(attribute.description);
        setUnit(attribute.unitOfMeasure);
        setValue(attribute.value);
        setTableName(attribute.tableName)
        setUploadedFileName(attribute.document);
        if(attribute.tableName !=  ''){
            setIsCharacteristicCurveChecked(true);
        }
    };
    //Delete the Selected row
    const handleDeleteTable = (sNo) => {
        const updatedAttributes = attributes.filter(attribute => attribute.sNo !== sNo);
        setAttributes(updatedAttributes);
    };
     //Image Upload
     const fileInputRefImage = useRef(null);
     const handleUploadClick = () => {
         fileInputRefImage.current.click();
     };
 
     const handleFileChangeImage = (event) => {
         const file = event.target.files[0];
         if (file) {
             if (file.type.startsWith('image/')) {
                 const reader = new FileReader();
                 reader.onload = (e) => {
                     document.getElementById('uploadedImage').src = e.target.result;
                     setEquipmentImage(e.target.result);
                 };
                 reader.readAsDataURL(file);
             } else {
                 alert('Please select an image file.');
             }
         }
     };
  //useEffect to prefill the datas in fields  
     useEffect(() => {
        if (equipmentData) {
            const { equipment_name, description, make, model, year, image, attributes } = equipmentData[0];  
            // Set equipment data
            setEquipment(equipment_name || '');
            setEquipmentDescription(description || '');
            setEquipmentMake(make || '');
            setEquipmentModel(model || '');
            setEquipmentYear(year || '');
            setImage(image || '');   
            
            // Set attributes data
            if (attributes && attributes.length > 0) {
                const updatedAttributes = attributes.map((attribute) => ({             
                    id: attribute.id,
                    attributeName: attribute.attribute_name || '',
                    unitOfMeasure: attribute.uom || '',
                    value: attribute.value || '',
                    document: attribute.document || '',
                    description: attribute.description || '',
                    tableName:attribute.table_name || '',                    
                }));
                setAttributes(updatedAttributes);
          

            }
        }
    }, [equipmentData]);
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
                        Edit Equipment & Attribute
                        <IconButton className="attribute-close"  >
                        <FontAwesomeIcon icon={faXmark} onClick={handleClose} />
                        </IconButton>
                    </Typography>
                </Box>
                <Box className='attribute-content'>
                <Box className='equipment-content-edit'>
                <Box className='vertical-content'>
                    <Box  className='equipment-asset-name'>
                    <Box className='equipment-name'>
                    <Typography className='vertical-content-label'>Equipment Name</Typography>
                    <TextField className='vertical-text' placeholder='Enter the Equipment Name'
                        value={equipment}
                        onChange={(e) => setEquipment(e.target.value)} />
                    </Box>                 
                    <Box className='equipment-asset'>
                            <img id="uploadedImage" src={image} alt='equip'></img>
                            <Button className='equipment-asset-button' onClick={handleUploadClick}>Upload</Button>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRefImage}
                                        style={{ display: 'none' }}
                                        onChange={handleFileChangeImage}
                                    />
                                </Box>
                    </Box>                                     
                    <Typography className='vertical-content-label'>Description</Typography>
                    <Textarea className='vertical-description' placeholder='Enter the Description'
                        value={equipmentDescription}
                        onChange={(e) => setEquipmentDescription(e.target.value)} />
                   
                   <Box className='equipment-make-model'>
                    <Box>
                    <Typography className='vertical-content-label'>Make</Typography>
                    <TextField className='vertical-make-text' placeholder='Make'
                     value={equipmentMake}
                     onChange={(e) => setEquipmentMake(e.target.value)}/>
                    </Box>
                    <Box>
                    <Typography className='vertical-content-label'>Model</Typography>
                    <TextField className='vertical-make-text' placeholder='Model'
                     value={equipmentModel}
                     onChange={(e) => setEquipmentModel(e.target.value)}/>
                    </Box>
                    <Box>
                    <Typography className='vertical-content-label'>Year</Typography>
                    <TextField className='vertical-make-text' placeholder='Year'
                     value={equipmentYear}
                     onChange={(e) => setEquipmentYear(e.target.value)}/>
                    </Box>
                   </Box>

                </Box>
                </Box>
                    <Typography className='label'> Attribute Name</Typography>
                    <TextField className='attribute-textfield' placeholder='Enter the Attribute Name' value={attributeName} onChange={(e) => setAttributeName(e.target.value)}></TextField>
                    <FormControlLabel className='attribute-checkbox' control={<Checkbox checked={isCharacteristicCurveChecked} onChange={(e) => setIsCharacteristicCurveChecked(e.target.checked)} />} label="Characteristic Curve" />
                    <Typography className='label'> Description</Typography>
                    <Textarea className='attribute-textfield' placeholder='Enter the Description' value={description} onChange={(e) => setDescription(e.target.value)}> </Textarea>
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
                        <FontAwesomeIcon icon={faCloudUpload} className='cloud-upload' />
                        <div>
                            <Typography className='upload-text'>
                                Drag and Drop Files or
                                <Button onClick={handleBoxClick}> Browse</Button>
                            </Typography>
                            <Typography className='upload-format'>Supported Formats: .xlss, .pdf</Typography>
                            {uploadedFileName && <Typography className='upload-format'>File Uploaded: {uploadedFileName}</Typography>}
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
                        <Button className='clear-btn' onClick={handleClearAttribute}>Clear </Button>
                        {editing &&  <Button className='upload-btn' onClick={handleAdd}> Update</Button>}
                        { !editing && <Button className='upload-btn' onClick={handleAdd}> Add</Button> }
                    </Box>                           
                <TableContainer  className='table-container-attribute'>
                    <Table className='attribute-table'>
                        <TableHead className='table-head'>
                            <TableRow className='table-row'>
                                <TableCell className='table-cell'>S.No</TableCell>
                                <TableCell className='table-cell'>Attribute Name</TableCell>
                                <TableCell className='table-cell'>Table Name</TableCell>
                                <TableCell className='table-cell'>Unit Of Measure</TableCell>
                                <TableCell className='table-cell'>Value</TableCell>
                                <TableCell className='table-cell'>Document</TableCell>
                                <TableCell className='table-cell'>Description</TableCell>
                                <TableCell className='table-cell'>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className='table-body'>
                            {attributes.map((attribute,index) => (
                                <TableRow className='table-row' key={attribute.sNo}>
                                    <TableCell className='table-cell'>{index+1}</TableCell>
                                    <TableCell className='table-cell'>{attribute.attributeName}</TableCell>
                                    <TableCell className='table-cell'>{attribute.tableName || '-'}</TableCell>
                                    <TableCell className='table-cell'>{attribute.unitOfMeasure || '-'}</TableCell>
                                    <TableCell className='table-cell'>{attribute.value || '-'}</TableCell>
                                    <TableCell className='table-cell'>{attribute.document || '-'}</TableCell>
                                    <TableCell className='table-cell'>{attribute.description || '-'}</TableCell>
                                    <TableCell className='table-cell'>
                                        <div className='actions'>
                                        <FontAwesomeIcon icon={faEdit} onClick={() => handleEditTable(attribute)} />
                                        <FontAwesomeIcon icon={faTrashAlt} onClick={()=> handleDeleteTable(attribute.sNo)} />
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
