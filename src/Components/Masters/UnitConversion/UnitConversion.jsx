import React, { useState, useEffect } from 'react';
import './UnitConversion.scss'
import { IconButton, Box, TextField ,CircularProgress} from "@mui/material";
import { faEdit, faSave } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useSelector } from 'react-redux';

function UnitConversion() {
    const [unitData, setUnitData] = useState([]);
    const [editedUnitData, setEditedUnitData] = useState([]);
    const [editMode, setEditMode] = useState([]);
    const BASE_URL = useSelector(state => state.editableReducer.baseUrlIs);
    const [isLoading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${BASE_URL}global_master_app/api/urls/`);
            setLoading(false);
            setUnitData(response.data);
            setEditedUnitData(response.data.map(() => ({ link: '', description: '' })));
            setEditMode(response.data.map(() => false));
        } catch (error) {
            console.error('Error fetching data from the API:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEditClick = (index) => {
        const newEditMode = [...editMode];
        newEditMode[index] = true;
        setEditMode(newEditMode);
    };

    const handleSaveClick = async (index) => {
        const id = unitData[index].id;
        const currentEditedData = editedUnitData[index];
        const originalData = unitData[index];
        const updatedData = {
            description: currentEditedData.description || originalData.description,
            url: currentEditedData.link || originalData.url,
        };
    
        const response = await axios.put(`${BASE_URL}global_master_app/api/urls/?id=${id}`, updatedData);
        console.log('POST request successful:', response.data);
        fetchData();
        const newEditMode = [...editMode];
        newEditMode[index] = false;
        setEditMode(newEditMode);
    }

    const handleInputChange = (event, index, field) => {
        const newEditedUnitData = [...editedUnitData];
        newEditedUnitData[index][field] = event.target.value;
        setEditedUnitData(newEditedUnitData);
    };

    return (
        
        <>
           {isLoading ? (
                <Box className='new-loader'>
                    <CircularProgress className="circular-progress-lens" />
                </Box>
            ) : (
                <>
            {unitData.map((unit, index) => (
                <Box key={index} className='unit-box'>
                    <Box className='unit-sub-box'>
                        <Box className='unit-title'>{unit.url_name}</Box>
                        <TextField
                            className='unit-input'
                            value={editedUnitData[index].link || unit.url}
                            onChange={(event) => handleInputChange(event, index, 'link')}
                            multiline
                            disabled={!editMode[index]}
                        />
                        <Box className='unit-icons'>
                            <IconButton onClick={() => handleEditClick(index)} aria-label='edit'>
                                <FontAwesomeIcon icon={faEdit} className='unit-svg' />
                            </IconButton>
                            <IconButton onClick={() => handleSaveClick(index)} aria-label='save'>
                                <FontAwesomeIcon icon={faSave} className='unit-svg' />
                            </IconButton>
                        </Box>
                    </Box>
                    <Box className='unit-sub-description'>
                        <Box className='unit-title'>Description:</Box>
                        <TextField
                            className='unit-input-des'
                            value={editedUnitData[index].description || unit.description}
                            onChange={(event) => handleInputChange(event, index, 'description')}
                            multiline
                            disabled={!editMode[index]}
                        />
                    </Box>
                </Box>
            ))}
            </>
        )}
        </>
    );
}

export default UnitConversion;
