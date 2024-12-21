import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { Typography, Box, IconButton, Button,} from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/pro-regular-svg-icons';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

export default function ViewDocument({ open, onClose, base64Content }) {

    const handleClose = () => {
        onClose();
    };

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
                        View Document
                        <IconButton className="close">
                        <FontAwesomeIcon className="icon" icon={faXmark} onClick={handleClose}/>
                        </IconButton>
                    </Typography>
                </Box>
                <Box className='document-viewer' style={{height:"87%"}}>
                    <iframe src={`data:application/pdf;base64,${base64Content}`} width="100%" height="100%" title="Document" />
                </Box>
                <Box className='vertical-footer'>
                    <Button className='vertical-save' onClick={handleClose}>Close</Button>
                </Box>
            </Dialog>
        </div>
    );
}
