import { useContext, useState } from 'react';
import { GlobalStoreContext } from '../store'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import UploadModal from './UploadModal'

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
import TextField from '@mui/material/TextField';
import TextsmsOutlinedIcon from '@mui/icons-material/TextsmsOutlined';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

export default function AppBanner() {
    const { store } = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const [anchorE2, setAnchorE2] = useState(null);
    const isUploadMenuOpen = Boolean(anchorE2);
    const location = useLocation();
    const navigate = useNavigate();
    let disabled = false;
    const map = store.currentMap;
    let StyledIconButton = styled(IconButton)({
        color: "black",
        '&:hover': {
            border: '2px solid green',
            backgroundColor: "transparent",
            padding: "3px 3px 3px 3px",
            borderRadius: "1px 1px",
        }
    });
    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleUploadMenuOpen = (event) => {
        setAnchorE2(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    function handleClick(path) {
        navigate(path);
        disabled = false;
        // store.setSearch("");
    }

    function handleComment() {
        store.openCommentView();
        console.log(store.openComment);
    }

    // disable the comment button
    // if (map && map.published.isPublished === true) {
    //     disabled = true;
    // }

    // const handleLogout = () => {
    //     handleMenuClose();
    // }

    // const handleShowUpload = () => {
    //     store.showUpload();
    // }

    const handleUploadMenuClose = () => {
        setAnchorE2(null);
    };

    const handleUploadShapefile = () => {
        console.log("shp/dbf")
        setAnchorE2(null);
        store.showUpload("shp/dbf")
    };

    const handleUploadGeojson = () => {
        console.log("geojson")
        setAnchorE2(null);
        store.showUpload("geojson")
    };

    const menuId = 'primary-search-account-menu';
    const uploadMenuId = 'upload-account-menu';

    const uploadMenu = (
        <Menu
            anchorE2={anchorE2}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={uploadMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isUploadMenuOpen}
            onClose={handleUploadMenuClose}
        >
            <MenuItem onClick={handleUploadShapefile}> Upload Shapefile/DBF Combo</MenuItem>
            <MenuItem onClick={handleUploadGeojson}> Upload GeoJSON</MenuItem>
        </Menu>
    );

    const loggedOutMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem component={Link} to="/login" onClick={handleMenuClose}><Link to='/login'>Login</Link></MenuItem>
            <MenuItem component={Link} to="/register" onClick={handleMenuClose}><Link to='/register'>Create New Account</Link></MenuItem>
        </Menu>
    );

    let editToolbar = "";
    let menu = loggedOutMenu;
    let menu2 = uploadMenu;
    // if (auth.loggedIn) {
    //     console.log("we are loggioned in so menu should change");
    //     menu = loggedInMenu;
    // }

    // function getAccountMenu(loggedIn) {
    //     let userInitials = 'JD'
    //     // console.log("userInitials: " + "JD");
    //     if (loggedIn)
    //         return <div>{userInitials}</div>;
    //     // else
    //     //     return <AccountCircle />;
    // }

    function handleHomescreen() {
        // store.closeCurrentList();
    }

    let editToolbarMenu = "";
    // if (auth.user || auth.type) {
    if (location.pathname !== '/' && location.pathname !== '/register' && location.pathname !== '/login') {
        editToolbarMenu =
            (<Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" id="appBar">
                    <Toolbar>
                        <Typography
                            variant="h4"
                            noWrap
                            component="div"
                            sx={{ display: { xs: 'none', sm: 'block' }, zIndex: 3 }}
                            onClick={handleHomescreen}
                        >
                            <StyledIconButton
                                edge="start"
                                color="inherit"
                                aria-label="open drawer"
                                sx={{ mr: 2 }}
                            // disabled={disabled}
                            // onClick={() => handleClick("/home")}
                            >
                                <PublicIcon style={{ fontSize: "45px", float: "right" }} onClick={handleProfileMenuOpen}></PublicIcon>
                            </StyledIconButton>
                            <StyledIconButton
                                edge="start"
                                color="inherit"
                                aria-label="open drawer"
                                sx={{ mr: 2 }}
                            // disabled={disabled}
                            // onClick={() => handleClick("/home")}
                            >
                                <HomeIcon style={{ fontSize: "45px", float: "right" }} ></HomeIcon>
                            </StyledIconButton>

                            <StyledIconButton
                                edge="start"
                                color="inherit"
                                aria-label="open drawer"
                                sx={{ mr: 2 }}
                            // disabled={disabled}
                            // onClick={() => handleClick("/home")}
                            >
                                <MenuIcon style={{ fontSize: "45px", float: "right" }}></MenuIcon>
                            </StyledIconButton>

                            <StyledIconButton
                                edge="start"
                                color="inherit"
                                aria-label="open drawer"
                                sx={{ mr: 2 }}
                            // disabled={disabled}
                            // onClick={() => handleClick("/home")}
                            >
                                <SearchIcon style={{ fontSize: "45px", float: "right" }}></SearchIcon>
                            </StyledIconButton>

                            <Box
                                component="form"
                                sx={{
                                    '& > :not(style)': { width: '40ch', backgroundColor: "white" },
                                    display: 'inline',
                                    fontSize: "40px",
                                    marginLeft: 'auto',
                                }}
                            >
                                <TextField
                                    id="outlined-basic"
                                    label="Search the map"
                                    variant="outlined"
                                    size="small"
                                    // label={store.search ? "" : "Search"}
                                    // disabled={disabled}

                                    // defaultValue={store ? store.search : ""}
                                    // onKeyPress={event => store.setSearch("keypress", event)}
                                    // onChange={event => store.setSearch("change", event)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            // let search = e.target.value;
                                            // store.setSearch(search);
                                            e.target.value = "";

                                        }
                                    }}
                                />
                            </Box>

                        </Typography>
                        <Box sx={{ flexGrow: 1 }}>{editToolbar}</Box>
                        <StyledIconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            sx={{ mr: 2 }}
                            // disabled={disabled}
                            // onClick={() => handleClick("/mapview-comment")}
                            onClick={() => handleComment()}
                        >
                            <TextsmsOutlinedIcon style={{ fontSize: "45px", float: "right" }} />
                        </StyledIconButton>
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <StyledIconButton
                                edge="start"
                                color="inherit"
                                aria-label="open drawer"
                                sx={{ mr: 2 }}
                            // disabled={disabled}
                            // onClick={() => handleClick("/user-lists")}
                            >
                                <AddToPhotosIcon
                                    size="large"
                                    edge="end"
                                    aria-label="account of current user"
                                    aria-controls={menuId}
                                    aria-haspopup="true"
                                    onClick={handleUploadMenuOpen}
                                    fontSize='large'
                                    style={{ fontSize: "45px", color: "black" }}
                                >
                                    {/* {getAccountMenu(auth.loggedIn)} */}
                                </AddToPhotosIcon>
                            </StyledIconButton>
                        </Box>
                    </Toolbar>
                </AppBar>
                {
                    menu
                }
                {
                    menu2
                }
                {
                    <UploadModal />
                }
                {/* {
                    menu
                } */}
            </Box>);
    }
    return (
        editToolbarMenu
    );

}