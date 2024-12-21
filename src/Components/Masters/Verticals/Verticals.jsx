import  React, {useEffect,useState} from 'react';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import {
    Typography, Box, IconButton, Button, TextField
} from "@mui/material";
import './Verticals.scss'
import { Textarea } from '@mui/joy';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/pro-regular-svg-icons';
import { useSelector } from 'react-redux';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

export default function Verticals({ onClose, onSave,isEditMode,verticalEditData  }) {
    const [open, setOpen] = useState(true);
    const [verticalName, setVerticalName] = useState('');
    const [description, setDescription] = useState('');
    const BASE_URL = useSelector(state => state.editableReducer.baseUrlIs);
    const handleClear = () => {
        setVerticalName('');
        setDescription('');
    };
    const handleClose = () => {
        setOpen(false);
        onClose();
    };
    //End point to post and Put
    const handleSave = async () => {
        try {
            const postData = {
                name: verticalName,
                description: description,
            };
    
            if (isEditMode && verticalEditData && verticalEditData.id) {
                const putUrl = `${BASE_URL}global_master_app/api/verticals/?id=${verticalEditData.id}`;
                const response = await axios.put(putUrl, postData);
            } else {
                const response = await axios.post(`${BASE_URL}global_master_app/api/verticals/`, postData);
                console.log('Response:', response.data);
            }   
            onSave();
            handleClose();
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };
    
    const isSaveDisabled = verticalName.trim() === '' || description.trim() === '';
    useEffect(() => {
        if (isEditMode && verticalEditData) {
            setVerticalName(verticalEditData.name || '');
            setDescription(verticalEditData.description || '');
        }
    }, [isEditMode, verticalEditData]);
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
                        {isEditMode ? 'Edit Verticals' : 'Create Verticals'}
                        <IconButton className="close">
                        <FontAwesomeIcon className="icon" icon={faXmark} onClick={handleClose}/>
                        </IconButton>
                    </Typography>
                </Box>
                <Box className='vertical-content'>
                    <Typography className='vertical-content-label'>Vertical Name</Typography>
                    <TextField className='vertical-text' placeholder='Enter the Verticals'
                        value={verticalName}
                        onChange={(e) => setVerticalName(e.target.value)} />
                    <Typography className='vertical-content-label'>Description</Typography>
                    <Textarea className='vertical-description-area' placeholder='Enter the Description'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)} />
                </Box>
                <Box className='vertical-footer'>
                    <Button className='vertical-clear' onClick={handleClear}> Clear</Button>
                    {isEditMode && verticalEditData&&
                    <Button className={`vertical-save ${isSaveDisabled ? 'disabled' : ''}`} onClick={handleSave} disabled={isSaveDisabled}>Update</Button>
                    }
                     {!isEditMode &&
                    <Button className={`vertical-save ${isSaveDisabled ? 'disabled' : ''}`} onClick={handleSave} disabled={isSaveDisabled}>Save</Button>
                     }
                </Box>
            </Dialog>
        </div>
    );
}
