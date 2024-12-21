import  React,{useState} from 'react';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { Typography, Box, IconButton, Card,} from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faXmark } from '@fortawesome/pro-regular-svg-icons';
import axios from 'axios';
import './DocumentCllick.scss';
import ViewDocument from '../ViewDocument/ViewDocument';
import { useSelector } from 'react-redux';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

export default function DocumentClick({  onClose,documentId,certificateIds,value}) {
    const [open, setOpen] = useState(true);
    const [base64Content, setBase64Content] = useState(null);
    const [viewDocument, setViewDocument] = useState(false);
    const BASE_URL = useSelector(state => state.editableReducer.baseUrlIs);
    const handleClose = () => {
        onClose();
        setOpen(false);

    };
    const fetchDocumentData = async (productId, documentName, documentId) => {
        try {
            const response = await axios.get(`${BASE_URL}global_master_app/api/${value}/?id=${productId}&document_name=${documentName}&document_id=${documentId}`);
            console.log('Fetched document data:', response.data);
            if(documentId==''){
                setBase64Content(response.data[0].value);
                setViewDocument(true);
            }else{
                setBase64Content(response.data.value);
                setViewDocument(true);
            }
          
        } catch (error) {
            console.error('Error fetching document data:', error);
        }
    };
    const handleFileIconClick = (documentName, documentId, product) => {
        const productId = product;
        if (documentName === 'Certificate' ) {
                fetchDocumentData(productId, documentName, documentId);
            
        } else {
            fetchDocumentData(productId, documentName, '');
        }
    };

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
                   Documents
                    <IconButton className="close">
                    <FontAwesomeIcon className="icon" icon={faXmark} onClick={handleClose}/>
                    </IconButton>
                </Typography>
            </Box>
            <Box className='document-page'>
            <Typography className='label'>Release Notes</Typography>
            <Card className='card' onClick={() => handleFileIconClick('Release', '', documentId)}>
                <Box className='card-box'>
                                <FontAwesomeIcon className="card-icon" icon={faFile} />
                                </Box>
            <Typography className='card-name'>Release Notes</Typography>
            </Card>

            </Box> 
            <Box className='document-page'>
            <Typography className='label'>PRD & Design Documents</Typography>
            <Card className='card' onClick={() => handleFileIconClick('PRD', '', documentId)}>
                <Box className='card-box'>
                                <FontAwesomeIcon className="card-icon" icon={faFile} />
                                </Box>
            <Typography className='card-name'>PRD & Design Documents</Typography>
            </Card>

            </Box> 
            <Box className='document-page'>
            <Typography className='label'>MRD Documents</Typography>
            <Card className='card' onClick={() => handleFileIconClick('MRD', '', documentId)}>
                <Box className='card-box'>
                                <FontAwesomeIcon className="card-icon" icon={faFile} />
                                </Box>
            <Typography className='card-name'>MRD Documents</Typography>
            </Card>

            </Box> 
            <Box className='document-page'>
            <Typography className='label'>Certificate Documents</Typography>
            {certificateIds.map((certificateId, index) => (
        <Card key={index} className='card card-map' onClick={() => handleFileIconClick('Certificate', certificateId, documentId)}>
            <Box className='card-box'>
                <FontAwesomeIcon className="card-icon" icon={faFile} />
            </Box>
            <Typography className='card-name'>Certificate Document {index + 1}</Typography>
        </Card>
    ))}

            </Box> 
        </Dialog>
        {viewDocument && <ViewDocument open={viewDocument} onClose={() => setViewDocument(false)} base64Content={base64Content} />}
    </div>
    
    );
}
