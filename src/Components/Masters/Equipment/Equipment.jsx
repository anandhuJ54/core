import * as React from 'react';
import { useState, useRef } from 'react';
import { Typography, Box, IconButton, Button, TextField,Dialog,Slide} from "@mui/material";
import './Equipment.scss'
import { Textarea } from '@mui/joy';
import Attribute from './Attribute/Attribute';
import axios from 'axios';
import { faXmark } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

export default function Equipment({ onClose, onSaveEquipment }) {
    const [open, setOpen] = useState(true);
    const [equipment, setEquipment] = useState('');
    const [equipmentDescription, setEquipmentDescription] = useState('');
    const [addEquipment, setAddEquipment] = useState(false);
    const [equipmentMake, setEquipmentMake] = useState('');
    const [equipmentModel, setEquipmentModel] = useState('');
    const [equipmentYear, setEquipmentYear] = useState('');
    const [equipmentImage, setEquipmentImage] = useState('');
    const [equipmentData, setEquipmentData] = useState({ });
    const BASE_URL = useSelector(state => state.editableReducer.baseUrlIs);
    const handleClear = () => {
        setEquipment('');
        setEquipmentDescription('');
        setEquipmentMake('');
        setEquipmentModel('');
        setEquipmentYear('');
        setEquipmentImage('')
    };
    const handleClose = () => {
        setOpen(false);
        onClose();
    };
    const handleSave = async () => {
        const postData = {
            name: equipment,
            description: equipmentDescription,
            make: equipmentMake,
            model: equipmentModel,
            year: equipmentYear,
            image: equipmentImage,
            parameters: [],
        };
        onSaveEquipment();
        axios.post(`${BASE_URL}global_master_app/api/equipment/`, postData)
            .then(response => {
                console.log('POST success:', response.data);
            })
            .catch(error => {
                console.error('Error making POST request:', error);
            });
    };
    const handleEquipmentAdd = () => {
        const equipmentData = { name: equipment,description: equipmentDescription, make: equipmentMake, model: equipmentModel, year: equipmentYear, image: equipmentImage,};
        setAddEquipment(true);
        setEquipmentData(equipmentData);
    };

    //Image Upload
    const fileInputRef = useRef(null);
    const handleUploadClick = () => {
        fileInputRef.current.click();
    };
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    document.getElementById('uploadedImage').src = e.target.result;
                    setEquipmentImage(e.target.result);
                };
                reader.readAsDataURL(file);
            }
        }
    };
    //Disable add button if field is empty
    const isAddButtonDisabled = () => {
        return (
            equipment.trim() === '' ||
            equipmentDescription.trim() === '' ||
            equipmentMake.trim() === '' ||
            equipmentModel.trim() === '' ||
            equipmentYear.trim() === ''
        );
    };
    const handleAtributeClear = ()=>{
        setAddEquipment(false);
    }
    const handleCloseAllTabs = ()=>{
        onSaveEquipment()
    }

    return (
        <div className='verticals-dialog'>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                aria-describedby="alert-dialog-slide-description"
                onClose={handleClose}
            >
                <Box className="box-main">
                    <Typography className="title" >
                        Create Equipment
                        <IconButton className="close"  >
                        <FontAwesomeIcon icon={faXmark} onClick={handleClose} />
                        </IconButton>
                    </Typography>
                </Box>
                <Box className='vertical-content'>
                    <Box className='equipment-asset-name'>
                        <Box className='equipment-name'>
                            <Typography className='vertical-content-label'>Equipment Name</Typography>
                            <TextField className='vertical-text' placeholder='Enter the Equipment Name'
                                value={equipment}
                                onChange={(e) => setEquipment(e.target.value)} />
                        </Box>
                        <Box className='equipment-asset'>
                            <img id="uploadedImage" src='../../asset/uploadimage.png' alt='equip'></img>
                            <Button className='equipment-asset-button' onClick={handleUploadClick}>Upload</Button>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
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
                                onChange={(e) => setEquipmentMake(e.target.value)} />
                        </Box>
                        <Box>
                            <Typography className='vertical-content-label'>Model</Typography>
                            <TextField className='vertical-make-text' placeholder='Model'
                                value={equipmentModel}
                                onChange={(e) => setEquipmentModel(e.target.value)} />
                        </Box>
                        <Box>
                            <Typography className='vertical-content-label'>Year</Typography>
                            <TextField className='vertical-make-text' placeholder='Year'
                                value={equipmentYear}
                                onChange={(e) => setEquipmentYear(e.target.value)} />
                        </Box>
                    </Box>
                    <Box className='equipment-control-btn'>
                        <Button className='equipment-clear' onClick={handleClear}>Clear</Button>
                        <Button className={`equipment-add ${isAddButtonDisabled() ? 'disabled' : ''}`}
                            onClick={handleEquipmentAdd} disabled={isAddButtonDisabled()}>
                            Add
                        </Button>
                    </Box>

                </Box>
                <Box className='vertical-footer'>
                    <Button className='vertical-clear' onClick={handleClose}> Back</Button>
                    <Button className='vertical-save' onClick={handleSave} >Save</Button>
                </Box>
            </Dialog>
            {addEquipment && <Attribute equipmentData = {equipmentData} handleAtributeClear = {handleAtributeClear} handleCloseAllTabs = {handleCloseAllTabs}/>}
        </div>
    );
}
