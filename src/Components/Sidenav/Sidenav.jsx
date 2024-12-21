import React, {  useEffect } from 'react';
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemButton from "@mui/joy/ListItemButton";
import Box from "@mui/joy/Box";
import './Sidenav.scss';
import { useNavigate, useLocation } from "react-router-dom";
export default function Sidenav() {
    const navigate = useNavigate();
    const location = useLocation();
   
    const menuItems = [
        // {
        //     text: 'Customer Details',
        //     route: '/dashboard'
        // },
        // {
        //     text: 'License Type',
        //     route: '/license-type'
        // },
        {
            text: 'Hierarchy',
            route: '/hierarchy'
        },
        {
            text: 'Masters',
            route: '/masters'
        },
    ];
   

    const [index, setIndex] = React.useState(0);
    useEffect(() => {
        const currentIndex = menuItems.findIndex(item => item.route === location.pathname);
        if (currentIndex !== -1) {
            setIndex(currentIndex);
        }
    }, [location.pathname, menuItems]);
    const handleMenuItemClick = (idx) => {
        setIndex(idx);
        navigate(menuItems[idx].route);
    };

    return (
        <>            
            <Box className="Box side-nav-box" sx={{ py: 2, pr: 1, width: 300 }}>      
                    <List>
                        {menuItems.map((item, idx) => (
                            <ListItem key={item.route}>
                                 <ListItemButton
                                className="ListItemButton"
                                selected={index === idx}
                                onClick={() => handleMenuItemClick(idx)}
                                sx={{
                                    backgroundColor: index === idx ? '#CA7300' : 'transparent',
                                    color: index === idx ? 'white' : 'inherit',
                                }}
                            >
                                <ListItemContent className="ListItemContent">{item.text}</ListItemContent>
                            </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                          
            </Box>
        </>
    );
}
