import * as React from 'react';
import { useState,useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import {Typography, Box, IconButton, Button, TextField, Select, Chip, MenuItem,  ListItemText} from "@mui/material";
import './Role.scss'
import { Textarea } from '@mui/joy';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/pro-regular-svg-icons';
import { useSelector } from 'react-redux';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

export default function Role({ onClose, onSaveRole,isEditModeRole,roleEditData }) {
    const [open, setOpen] = useState(true);
    const [role, setRole] = useState('');
    const [roleDescription, setRoleDescription] = useState('');
    const [selectedPrivileges, setSelectedPrivileges] = useState([]);
    const [privilegesOptions, setPrivilegesOptions] = useState([]);
    const BASE_URL = useSelector(state => state.editableReducer.baseUrlIs);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setSelectedPrivileges(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleClear = () => {
        setRole('');
        setRoleDescription('');
        setSelectedPrivileges([]);
    };
    const handleClose = () => {
        setOpen(false);
        onClose();
    };
   
    const isSaveDisabled = role.trim() === '' || roleDescription.trim() === '';
    const handleChipMouseDown = (event) => {
        event.stopPropagation();
    };
    const handleDelete = (value) => {
        const updatedPrivileges = selectedPrivileges.filter((privilege) => privilege !== value);
        setSelectedPrivileges(updatedPrivileges);
    };
    useEffect(() => {
        if (isEditModeRole && roleEditData) {
            const fetchRoleDetails = async () => {
                try {
                    const roleId = roleEditData;
                    const response = await axios.get(`${BASE_URL}global_master_app/api/roles_privileges/?id=${roleId}`);
                    const roleDetails = response.data;
                    const { name, description, privileges } = roleDetails;
                    const selectedPrivileges = privileges.map(privilege => privilege.id);;
                    setRole(name || '');
                    setRoleDescription(description || '');
                    setSelectedPrivileges(selectedPrivileges || []);
                    console.log("selectedprivi",selectedPrivileges);
                } catch (error) {
                    console.error('Error fetching role details:', error);
                }
            };
    
            fetchRoleDetails();
        }
    }, [isEditModeRole, roleEditData]);
    //Endpoint for privileges
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}global_master_app/api/mode_details/`);
                setPrivilegesOptions(response.data);
            } catch (error) {
                console.error('Error fetching privilege options:', error);
            }
        };
        fetchData();
    }, []);
    // End point to post and put the role
    const handleSave = async () => {
        try {
          const apiUrl = `${BASE_URL}global_master_app/api/roles_privileges/`;
          const requestData = {
            privileges: selectedPrivileges,
            name: role,
            description: roleDescription,
          };
      
          if (isEditModeRole && roleEditData) {
            const roleId = roleEditData;
            await axios.put(`${apiUrl}?id=${roleId}`, requestData);
            console.log('PUT request successful.');
          } else {
            await axios.post(apiUrl, requestData);
            console.log('POST request successful.');
          }      
        } catch (error) {
          console.error(`Error making ${isEditModeRole ? 'PUT' : 'POST'} request:`, error);
        }
        onSaveRole();
        handleClose();
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
                    {isEditModeRole ? 'Edit Role / Privileges' : 'Create Role / Privileges'}
                        <IconButton className="close"  >
                        <FontAwesomeIcon className="icon" icon={faXmark} onClick={handleClose}/>
                        </IconButton>
                    </Typography>
                </Box>
                <Box className='vertical-content'>
                    <Typography className='vertical-content-label'>Role</Typography>
                    <TextField className='vertical-text' placeholder='Enter the Role'
                        value={role}
                        onChange={(e) => setRole(e.target.value)} />
                    <Typography className='vertical-content-label'>Description</Typography>
                    <Textarea className='vertical-description' placeholder='Enter the Description'
                        value={roleDescription}
                        onChange={(e) => setRoleDescription(e.target.value)} />
                    <Typography className='vertical-content-label'>Privileges</Typography>

                    <Select
                        labelId="select-access"
                        id="select-access-to"
                        value={selectedPrivileges}
                        onChange={handleChange}
                        multiple
                        renderValue={(selected) => (
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={privilegesOptions.find(option => option.id === value)?.name} onDelete={() => handleDelete(value)} onMouseDown={(event) => handleChipMouseDown(event)} />
                                ))}
                            </div>
                        )}
                    >
                        {privilegesOptions.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                                <ListItemText primary={option.name} />
                            </MenuItem>
                        ))}
                    </Select>

                </Box>
                <Box className='vertical-footer'>
                    <Button className='vertical-clear' onClick={handleClear}> Clear</Button>
                    {isEditModeRole && roleEditData&&
                    <Button className={`vertical-save ${isSaveDisabled ? 'disabled' : ''}`} onClick={handleSave} disabled={isSaveDisabled}>Update</Button>
                    }
                     {!isEditModeRole && 
                    <Button className={`vertical-save ${isSaveDisabled ? 'disabled' : ''}`} onClick={handleSave} disabled={isSaveDisabled}>Save</Button>
                     }
                </Box>
            </Dialog>
        </div>
    );
}
