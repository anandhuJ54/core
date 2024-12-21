
import * as React from 'react';
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import {
    Typography, Box, IconButton, Button, InputAdornment,TextField
} from "@mui/material";
import { Close } from "@mui/icons-material";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import './Upload.scss'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

export default function Upload({ onClose, onSave }) {
    const [open, setOpen] = useState(true);
    const handleClear = () => {
      
    };
    const handleClose = () => {
        setOpen(false);
        onClose();
    };
    const handleSave = () => {
        // Pass the data back to the parent component
        onSave();
        handleClose();
    };
    const isSaveDisabled =  '';
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
                        Import File
                        <IconButton className="close"  >
                            <Close fontSize="24px" onClick={handleClose} />
                        </IconButton>
                    </Typography>
                </Box>
                <Box className='upload-main'>
               <Box className='upload-card'>
                <CloudUploadOutlinedIcon className='cloud-upload'/>
                <Typography className='upload-text'>Drag and Drop Files or <Button> Browse</Button></Typography>
                <Typography className='upload-format'>Supported Formats: Excel</Typography>
               </Box>
               <Box className='upload-btns'>
                <Button className='clear-btn'>
                    Clear
                </Button>
                <Button className='upload-btn'> Upload</Button>
               </Box>
               <Box className='upload-rename'>
               <Typography className='asset-list-name'>Uploads  </Typography>
                                <TextField className='asset-list-rename' placeholder='Rename'
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <CloseOutlinedIcon className='icon-search' />
                                        </InputAdornment>
                                    ),
                                }} />
               </Box>
               </Box>
                <Box className='vertical-footer'>
                    <Button className='vertical-clear' onClick={handleClear}> Clear</Button>
                    <Button className={`vertical-save ${isSaveDisabled ? 'disabled' : ''}`} onClick={handleSave} disabled={isSaveDisabled}>Save</Button>
                </Box>
            </Dialog>
        </div>
    );
}
