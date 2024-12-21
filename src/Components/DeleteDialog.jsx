import React from 'react';
import {  Typography, Button , Dialog, DialogTitle, DialogContent, DialogActions} from '@mui/material';

export default function DeleteDialog(props) {
    const {Cancel,Confirm,show}=props;
    const handleConfirm = () => {
       Confirm();
    };
    return (
        <Dialog open={show} onClose={Cancel} maxWidth="xs" className='delete-confirm'>
        <DialogTitle className='delete-title'>Confirm Delete</DialogTitle>
        <DialogContent className='delete-content'>
            <Typography className='delete-message'>Are you sure you want to delete?</Typography>
        </DialogContent>
        <DialogActions className='delete-actions'>
            <Button className='delete-btn-confirm' onClick={handleConfirm}>Yes</Button>
            <Button className='delete-btn-confirm delete-btn' onClick={Cancel}>Cancel</Button>
        </DialogActions>
    </Dialog>
      );
    }
    