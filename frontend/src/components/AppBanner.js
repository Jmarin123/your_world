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
import SearchIcon from '@mui/icons-material/Search';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import TextField from '@mui/material/TextField';
import TextsmsOutlinedIcon from '@mui/icons-material/TextsmsOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MapIcon from '@mui/icons-material/Map';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import AuthContext from '../auth/index'

export default function AppBanner() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const [anchorE2, setAnchorE2] = useState(null);
    const isUploadMenuOpen = Boolean(anchorE2);
    const location = useLocation();
    const navigate = useNavigate();
    const [label, setLabel] = useState("Select an option to search for maps...");
    let disabled = true;
    // const map = store.currentMap;
    let StyledIconButton = styled(IconButton)({
        color: "black",


        '&:hover': {
            opacity: 1,
            transition: "color 0.7s, transform 0.7s",
            transform: 'scale(1.1)',
            // transitionDuration: '100ms',
            color: '#FDE66B'
        }
    });

    if (store.currentMap && store.currentMap.publish) {
        disabled = false;
    }

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleUploadMenuOpen = (event) => {
        setAnchorE2(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        setAnchorEl(null);
        auth.logoutUser();
    }

    const handleSearchUser = () => {
        setLabel("Search by username")
    }

    const handleSearchMap = () => {
        setLabel("Search by map name")
    }

    const handleSearchProperty = () => {
        setLabel("Search by map properties")
    }

    function handleComment() {
        store.openCommentView();
        console.log(store.openComment);
    }

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

    const handleHomePage = () => {
        if (auth.loggedIn) {
            navigate('/home')
        }
    }

    const handlePublicMapsPage = () => {
        navigate('/public')
    }

    const handleSearchPage = (event) => {
        navigate('/search')
    }

    const menuId = 'primary-search-account-menu';
    const uploadMenuId = 'upload-account-menu';

    const uploadMenu = (
        <Menu
            anchore2={anchorE2}
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
            anchore1={anchorEl}
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
            <MenuItem component={Link} to="/login" onClick={handleMenuClose}><Link to='/login'>Login</Link></MenuItem>
            <MenuItem component={Link} to="/register" onClick={handleMenuClose}><Link to='/register'>Create New Account</Link></MenuItem>
        </Menu>
    );

    const loggedInMenu = (
        <Menu
            anchore1={anchorEl}
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
            <MenuItem component={Link} to="/" onClick={handleLogout}><Link to='/'>Log Out Of Account</Link></MenuItem>
        </Menu>
    );

    let editToolbar = "";
    let menu = loggedOutMenu;
    let menu2 = uploadMenu;
    if (auth.loggedIn) {
        menu = loggedInMenu;
    }

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

    let globeIcon = <StyledIconButton
        edge="start"
        color="inherit"
        aria-label="open drawer"
        sx={{ mr: 2, marginLeft: "5px" }}
    // disabled={disabled}
    // onClick={() => handleClick("/public")}
    >
        <PublicIcon sx={{ paddingX: "1%" }} style={{ fontSize: "45px", float: "right" }} onClick={handlePublicMapsPage}></PublicIcon>
    </StyledIconButton>

    let homeIcon = <StyledIconButton
        edge="start"
        color="inherit"
        aria-label="open drawer"
        sx={{ mr: 2 }}
        disabled={auth.loggedIn ? false : true}
    // onClick={() => handleClick("/public")}
    >
        <HomeIcon style={{ fontSize: "45px", float: "right" }} onClick={handleHomePage}></HomeIcon>
    </StyledIconButton>

    let searchIcon = <StyledIconButton
        edge="start"
        color="inherit"
        aria-label="open drawer"
        sx={{ mr: 2 }}
        onClick={handleSearchPage}
    // disabled={disabled}
    // onClick={() => handleClick("/public")}
    >
        <SearchIcon style={{ fontSize: "45px", float: "right" }}></SearchIcon>
    </StyledIconButton>

    if (location.pathname === '/public') {
        globeIcon = <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2, marginLeft: "5px", color: '#FDE66B' }}
        >
            <PublicIcon sx={{ paddingX: "1%" }} style={{ fontSize: "45px", float: "right" }} onClick={handlePublicMapsPage}></PublicIcon>
        </StyledIconButton>
    }
    else if (location.pathname === '/home') {
        homeIcon = <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2, color: '#FDE66B' }}
            disabled={auth.loggedIn ? false : true}
        >
            <HomeIcon style={{ fontSize: "45px", float: "right" }} onClick={handleHomePage}></HomeIcon>
        </StyledIconButton>
    }
    else if (location.pathname === '/search') {
        searchIcon = <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2, color: '#FDE66B' }}
        >
            <SearchIcon style={{ fontSize: "45px", float: "right" }} onClick={handleSearchPage}></SearchIcon>
        </StyledIconButton>
    }

    let editToolbarMenu = "";
    // if (auth.user || auth.type) {
    if (location.pathname !== '/' && location.pathname !== '/register' && location.pathname !== '/login') {
        editToolbarMenu =
            (<Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" id="appBar">
                    <Toolbar id="toolBar">
                        <Typography
                            variant="h4"
                            noWrap
                            component="div"
                            sx={{ display: { xs: 'none', sm: 'block' } }}
                            onClick={handleHomescreen}
                        >
                            {globeIcon}
                            {homeIcon}
                            {searchIcon}

                            <Box
                                component="form"
                                sx={{
                                    '& > :not(style)': { width: '35ch', backgroundColor: "#D9D9D9", marginTop: '0.75%', borderRadius: '5px' },
                                    display: 'inline',
                                    fontSize: "40px",
                                    marginLeft: 'auto',
                                    "& .css-v4u5dn-MuiInputBase-root-MuiInput-root:after": {
                                        borderColor: '#FDE66B'
                                    },
                                    "& label.Mui-focused": {
                                        color: '#756060'
                                    },

                                }}
                            >
                                <TextField
                                    id="outlined-basic"
                                    label={label}
                                    variant="standard"
                                    size="small"
                                    // label={store.search ? "" : "Search"}
                                    // disabled={disabled}

                                    defaultValue={store ? store.search : ""}
                                    // onKeyPress={event => store.setSearch("keypress", event)}
                                    // onChange={event => store.setSearch("change", event)}
                                    onKeyPress={(e) => {
                                        e.preventDefault();
                                        let search = e.target.value;
                                        store.setSearch(search);
                                        e.target.value = "";
                                        // if (e.key === 'Enter') {
                                        //     e.preventDefault();
                                        //     let search = e.target.value;
                                        //     store.setSearch(search);
                                        //     e.target.value = "";
                                        //     // navigate('/search')
                                        // }
                                    }}
                                />
                            </Box>

                            <StyledIconButton
                                edge="start"
                                color="inherit"
                                aria-label="open drawer"
                                sx={{ mr: 2, marginLeft: '5px' }}
                                onClick={() => handleSearchUser()}
                            >
                                <PersonOutlineIcon style={{ fontSize: "45px", float: "right" }}> </PersonOutlineIcon>
                            </StyledIconButton>

                            <StyledIconButton
                                edge="start"
                                color="inherit"
                                aria-label="open drawer"
                                sx={{ mr: 2 }}
                                onClick={() => handleSearchMap()}
                            >
                                <MapIcon style={{ fontSize: "45px", float: "right" }}> </MapIcon>
                            </StyledIconButton>

                            <StyledIconButton
                                edge="start"
                                color="inherit"
                                aria-label="open drawer"
                                sx={{ mr: 2 }}
                                onClick={() => handleSearchProperty()}
                            >
                                <WorkspacesIcon style={{ fontSize: "45px", float: "right" }}> </WorkspacesIcon>
                            </StyledIconButton>
                        </Typography>

                        <Box sx={{ flexGrow: 1 }}>{editToolbar}</Box>
                        <StyledIconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            sx={{ mr: 2 }}
                            disabled={disabled}
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
                                disabled={auth.loggedIn ? false : true}
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
                                    style={{ fontSize: "45px" }}
                                >
                                    {/* {getAccountMenu(auth.loggedIn)} */}
                                </AddToPhotosIcon>
                            </StyledIconButton>
                        </Box>

                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <StyledIconButton
                                edge="start"
                                color="inherit"
                                aria-label="open drawer"
                                sx={{ mr: 2 }}
                            // disabled={disabled}
                            // onClick={() => handleClick("/user-lists")}
                            >
                                <AccountCircleIcon
                                    size="large"
                                    edge="end"
                                    aria-label="account of current user"
                                    aria-controls={menuId}
                                    aria-haspopup="true"
                                    onClick={handleProfileMenuOpen}
                                    fontSize='large'
                                    style={{ fontSize: "45px" }}
                                >
                                    {/* {getAccountMenu(auth.loggedIn)} */}
                                </AccountCircleIcon>
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