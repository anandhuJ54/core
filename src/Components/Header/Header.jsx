import { Toolbar, Typography, Avatar, Menu, } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.scss';
import { Button } from '@mui/base';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRightFromBracket, faCircleQuestion, faXmark } from '@fortawesome/pro-regular-svg-icons';
import { baseUrlIs } from'../../Store/EditReducer';
import { useDispatch } from 'react-redux';

export default function Header() {
  const navigate = useNavigate();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const dispatch = useDispatch()

  const handleAvatarClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    navigate('/');
    dispatch(baseUrlIs(""))
  };

  const designation = "Admin";
const name='Sabari';
const handleBackClick = () => {
  navigate(-1);
};
  return (
    <>
      <Toolbar className="header">
        <div className="logo">
          <img className="asset1" src="../../asset/Login/SustainHeader.svg" alt="Sustain-Logo" />
       <FontAwesomeIcon icon={faArrowLeft} className="icon-back"  onClick={handleBackClick}/>
        </div>
        <div className="profile">
        <FontAwesomeIcon className='help-icon'icon={faCircleQuestion} />
          <div className="user-name">
            <Typography className='login-time'>Log in: 05/02/2024 - 12:00PM</Typography>
            <Typography variant="h3"> {name}({designation})</Typography>
          </div>
          <div className="userBadge">
            <Avatar className="avatar" onClick={handleAvatarClick}>
              U
            </Avatar>
            {/*Logout popup*/}
            <div className='new-logoutmenu'>
              <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
                className='logoutmenu'
              >
                <div className='new-log'>
                <FontAwesomeIcon className='new-close' onClick={handleMenuClose} icon={faXmark} />
                </div>
                <Avatar className="avatar-logout">
                  U
                </Avatar>
                <Typography className='name-new'>Hi..{name} ..!</Typography>
                <div className='logout-btn' >Manage Profile</div>
                <Button className='logout-btn2' onClick={handleLogout}>Logout  <FontAwesomeIcon className='logout-icon' icon={faArrowRightFromBracket} /> </Button>
              </Menu>
            </div>
          </div>
        </div>
      </Toolbar>
    </>
  );
}
