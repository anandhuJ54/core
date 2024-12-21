import * as React from 'react';
import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import {
    Typography, Box, IconButton, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from "@mui/material";
import '../Attribute/Attribute.scss'
import { Textarea } from '@mui/joy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/pro-regular-svg-icons';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

export default function ViewEquipment({ onClose, equipmentData }) {
    const [open, setOpen] = useState(true);
    const [equipment, setEquipment] = useState('');
    const [equipmentDescription, setEquipmentDescription] = useState('');
    const [equipmentModel, setEquipmentModel] = useState('');
    const [equipmentYear, setEquipmentYear] = useState('');
    const [equipmentMake, setEquipmentMake] = useState('');
    const [attributes, setAttributes] = useState([]);
    const [image, setImage] = useState('');
    //ToClose the tab
    const handleClose = () => {
        setOpen(false);
        onClose();
    };
    //To Prefill the input fields
    useEffect(() => {
        if (equipmentData) {
            const { equipment_name, description, make, model, year, attributes,image } = equipmentData[0];

            // Set equipment data
            setEquipment(equipment_name || '');
            setEquipmentDescription(description || '');
            setEquipmentMake(make || '');
            setEquipmentModel(model || '');
            setEquipmentYear(year || '');
            setImage(image || '')

            // Set attributes data
            if (attributes && attributes.length > 0) {
                const updatedAttributes = attributes.map((attribute, index) => ({
                    sNo: index + 1,
                    attributeName: attribute.attribute_name || '',
                    tableName:attribute.table_name || '',
                    unitOfMeasure: attribute.uom || '',
                    value: attribute.value || '',
                    document: attribute.document || '',
                    description: attribute.description || '',
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
                        View Equipment
                        <IconButton className="attribute-close"  >
                        <FontAwesomeIcon className="icon" icon={faXmark} onClick={handleClose}/>
                        </IconButton>
                    </Typography>
                </Box>
                <Box className='equipment-content'>
                    <Box className='vertical-content'>
                        <Box className='equipment-asset-name'>
                            <Box className='equipment-name'>
                                <Typography className='vertical-content-label'>Equipment Name</Typography>
                                <TextField className='vertical-text' placeholder='Enter the Equipment Name'
                                    value={equipment} disabled />
                            </Box>
                            <Box className='equipment-asset'>
                            <img src={image} alt='equip'></img>
                            {/* <img src={row3.image} alt="Equipment" style={{ height: '40px', width: '40px' }} /> */}
                            </Box>
                        </Box>
                        <Typography className='vertical-content-label'>Description</Typography>
                        <Textarea className='vertical-description' placeholder='Enter the Description'
                            value={equipmentDescription} disabled />
                        <Box className='equipment-make-model'>
                            <Box>
                                <Typography className='vertical-content-label'>Make</Typography>
                                <TextField className='vertical-make-text' placeholder='Make'
                                    value={equipmentMake} disabled />
                            </Box>
                            <Box>
                                <Typography className='vertical-content-label'>Model</Typography>
                                <TextField className='vertical-make-text' placeholder='Model'
                                    value={equipmentModel} disabled />
                            </Box>
                            <Box>
                                <Typography className='vertical-content-label'>Year</Typography>
                                <TextField className='vertical-make-text' placeholder='Year'
                                    value={equipmentYear} disabled />
                            </Box>
                        </Box>
                        <TableContainer className='table-container-attribute'>
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
                                    </TableRow>
                                </TableHead>
                                <TableBody className='table-body'>
                                    {attributes.map((attribute) => (
                                        <TableRow className='table-row' key={attribute.sNo}>
                                            <TableCell className='table-cell'>{attribute.sNo}</TableCell>
                                            <TableCell className='table-cell'>{attribute.attributeName}</TableCell>
                                            <TableCell className='table-cell'>{attribute.tableName || '-'} </TableCell>
                                            <TableCell className='table-cell'>{attribute.unitOfMeasure || '-'}</TableCell>
                                            <TableCell className='table-cell'>{attribute.value || '-'}</TableCell>
                                            <TableCell className='table-cell'>{attribute.document || '-'}</TableCell>
                                            <TableCell className='table-cell'>{attribute.description || '-'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
            </Dialog>
        </div>
    );
}
