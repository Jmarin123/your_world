import { useContext, useState } from 'react';
import { Link } from 'react-router-dom'
import Map from './Map.js';


import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import PublicIcon from '@mui/icons-material/Public';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';

export default function AppBanner() {
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
    }

    const menuId = 'primary-search-account-menu';
    const loggedOutMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem component={Link} to="/registerORlogin" onClick={handleMenuClose}><Link to='/registerORlogin'>Login</Link></MenuItem>
            <MenuItem component={Link} to="/registerORlogin" onClick={handleMenuClose}><Link to='/registerORlogin'>Create New Account</Link></MenuItem>
        </Menu>
    );
    const loggedInMenu =
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>

    let editToolbar = "";
    let menu = loggedOutMenu;
    // if (auth.loggedIn) {
    //     console.log("we are loggioned in so menu should change");
    //     menu = loggedInMenu;
    // }

    function getAccountMenu(loggedIn) {
        let userInitials = 'JD'
        console.log("userInitials: " + 'JD');
        if (loggedIn)
            return <div>{userInitials}</div>;
        // else
        //     return <AccountCircle />;
    }

    function handleHomescreen() {
        // store.closeCurrentList();
    }

    return (
        <Box sx={{ flexGrow: 1 }} id="homePageBackground">
            <AppBar position="static" id="appBar">
                <Toolbar>
                    <Typography
                        variant="h4"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' }, zIndex: 3 }}
                        onClick={handleHomescreen}
                    >
                    <PublicIcon fontSize='large' style={{ textDecoration: 'none', color: 'black' }} onClick={handleProfileMenuOpen}></PublicIcon>
                    <HomeIcon fontSize='large' style={{ textDecoration: 'none', color: 'black' }} ></HomeIcon>
                    <MenuIcon fontSize='large' style={{ textDecoration: 'none', color: 'black' }}></MenuIcon>
                    <SearchIcon fontSize='large' style={{ textDecoration: 'none', color: 'black' }}></SearchIcon>
                    
                    </Typography>
                    <Box sx={{ flexGrow: 1 }}>{editToolbar}</Box>
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <AddToPhotosIcon
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            fontSize='large'
                            style={{ textDecoration: 'none', color: 'black' }}
                        >
                            {/* {getAccountMenu(auth.loggedIn)} */}
                        </AddToPhotosIcon>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box id="box">
                <Map/>
            </Box>
            {
                menu
            }
        </Box>
    );
}