import { useContext, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

import { GlobalStoreContext } from '../store'
import AuthContext from '../auth/index'

import { styled } from '@mui/material/styles';
import { Box, Menu, MenuItem, Toolbar, Typography, TextField, IconButton, AppBar } from '@mui/material';
import { Public, Home, Search, AddToPhotos, TextsmsOutlined, AccountCircle, PersonOutline, Map, Workspaces } from '@mui/icons-material/';

import UploadModal from './UploadModal'

export default function AppBanner() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorE2, setAnchorE2] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const isUploadMenuOpen = Boolean(anchorE2);

    const location = useLocation();
    const navigate = useNavigate();

    const [label, setLabel] = useState("Select an option to search for maps...");
    const [s, setS] = useState("");
    let disabled = false;
    let uploadDisabled = false;

    let id;
    if (store.currentMap) {
        const map = store.currentMap;
        id = map._id;
    }

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
        store.navigatePublic();
        setS("");
        store.setFilterSearch("users");
        setLabel("Search by username")
    }

    const handleSearchMap = () => {
        store.navigatePublic();
        setS("");
        store.setFilterSearch("mapname");
        setLabel("Search by map name")
    }

    const handleSearchProperty = () => {
        setLabel("Search by map properties")
    }

    function handleComment() {
        store.openCommentView();
    }

    const handleUploadMenuClose = () => {
        setAnchorE2(null);
    };

    const handleUploadShapefile = () => {
        setAnchorE2(null);
        store.showUpload("shp/dbf")
    };

    const handleUploadGeojson = () => {
        setAnchorE2(null);
        store.showUpload("geojson")
    };

    const handleHomePage = () => {
        if (auth.loggedIn) {
            store.navigateHome();
        }
    }

    const handlePublicMapsPage = () => {
        store.navigatePublic();
    }

    const handleSearchPage = (event) => {
        navigate('/result')
    }

    if (location.pathname === '/mapview/' + id) {
        disabled = true;
    }
    if (location.pathname.includes('/map/') || !auth.loggedIn) {
        uploadDisabled = true;
    }

    let commentButton = <StyledIconButton
        edge="start"
        color="inherit"
        aria-label="open drawer"
        sx={{ mr: 2 }}
        onClick={() => handleComment()}
    >
        <TextsmsOutlined style={{ fontSize: "45px", float: "right" }} />
    </StyledIconButton>

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

    let globeIcon = <StyledIconButton
        edge="start"
        color="inherit"
        aria-label="open drawer"
        sx={{ mr: 2, marginLeft: "5px" }}
    >
        <Public sx={{ paddingX: "1%" }} style={{ fontSize: "45px", float: "right" }} onClick={handlePublicMapsPage}/>
    </StyledIconButton>

    let homeIcon = <StyledIconButton
        edge="start"
        color="inherit"
        aria-label="open drawer"
        sx={{ mr: 2 }}
        disabled={auth.loggedIn ? false : true}
    >
        <Home style={{ fontSize: "45px", float: "right" }} onClick={handleHomePage}/>
    </StyledIconButton>

    let searchIcon = <StyledIconButton
        edge="start"
        color="inherit"
        aria-label="open drawer"
        sx={{ mr: 2 }}
        onClick={(e) => {
            e.preventDefault();
            console.log(store.filterSearch);
            store.setSearch(s);
            console.log(store.filterSearch);
            console.log(store.search);
            e.target.value = "";
            navigate('/search')
        }}
    >
        <Search style={{ fontSize: "45px", float: "right" }}/>
    </StyledIconButton>

    if (location.pathname === '/public') {
        globeIcon = <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2, marginLeft: "5px", color: '#FDE66B' }}
        >
            <Public sx={{ paddingX: "1%" }} style={{ fontSize: "45px", float: "right" }} onClick={handlePublicMapsPage}/>
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
            <Home style={{ fontSize: "45px", float: "right" }} onClick={handleHomePage}/>
        </StyledIconButton>
    }
    else if (location.pathname === '/search') {
        searchIcon = <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2, color: '#FDE66B' }}
        >
            <Search style={{ fontSize: "45px", float: "right" }} onClick={handleSearchPage}/>
        </StyledIconButton>
    }

    let navigationBar = "";
    if (location.pathname !== '/' && location.pathname !== '/register' && location.pathname !== '/login') {
        navigationBar =
            (<Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" id="appBar">
                    <Toolbar id="toolBar">
                        <Typography
                            variant="h4"
                            noWrap
                            component="div"
                            sx={{ display: { xs: 'none', sm: 'block' } }}
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
                                    value={s}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        let search = e.target.value;
                                        console.log(search);
                                        setS(search);
                                        e.target.value = "";
                                    }}
                                // onKeyPress={(e) => {
                                //     e.preventDefault();
                                //     let search = e.target.value;
                                //     store.setSearch(search);
                                //     e.target.value = "";
                                //     // if (e.key === 'Enter') {
                                //     //     e.preventDefault();
                                //     //     let search = e.target.value;
                                //     //     store.setSearch(search);
                                //     //     e.target.value = "";
                                //     //     // navigate('/search')
                                //     // }
                                // }}
                                />
                            </Box>

                            <StyledIconButton
                                edge="start"
                                color="inherit"
                                aria-label="open drawer"
                                sx={{ mr: 2, marginLeft: '5px' }}
                                onClick={() => handleSearchUser()}
                            >
                                <PersonOutline style={{ fontSize: "45px", float: "right" }}/>
                            </StyledIconButton>

                            <StyledIconButton
                                edge="start"
                                color="inherit"
                                aria-label="open drawer"
                                sx={{ mr: 2 }}
                                onClick={() => handleSearchMap()}
                            >
                                <Map style={{ fontSize: "45px", float: "right" }}/>
                            </StyledIconButton>

                            <StyledIconButton
                                edge="start"
                                color="inherit"
                                aria-label="open drawer"
                                sx={{ mr: 2 }}
                                onClick={() => handleSearchProperty()}
                            >
                                <Workspaces style={{ fontSize: "45px", float: "right" }}/>
                            </StyledIconButton>
                        </Typography>

                        <Box sx={{ flexGrow: 1 }}>{editToolbar}</Box>
                        {disabled ? commentButton : <div></div>}
                        {/* <StyledIconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            sx={{ mr: 2 }}
                            disabled={disabled}
                            // onClick={() => handleClick("/mapview-comment")}
                            onClick={() => handleComment()}
                        >
                            <TextsmsOutlinedIcon style={{ fontSize: "45px", float: "right" }} />
                        </StyledIconButton> */}


                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <StyledIconButton
                                edge="start"
                                color="inherit"
                                aria-label="open drawer"
                                sx={{ mr: 2 }}
                                disabled={uploadDisabled}
                            >
                                <AddToPhotos
                                    size="large"
                                    edge="end"
                                    aria-label="account of current user"
                                    aria-controls={menuId}
                                    aria-haspopup="true"
                                    onClick={handleUploadMenuOpen}
                                    fontSize='large'
                                    style={{ fontSize: "45px" }}
                                />
                            </StyledIconButton>
                        </Box>

                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <StyledIconButton
                                edge="start"
                                color="inherit"
                                aria-label="open drawer"
                                sx={{ mr: 2 }}
                            >
                                <AccountCircle
                                    size="large"
                                    edge="end"
                                    aria-label="account of current user"
                                    aria-controls={menuId}
                                    aria-haspopup="true"
                                    onClick={handleProfileMenuOpen}
                                    fontSize='large'
                                    style={{ fontSize: "45px" }}
                                />
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
            </Box>);
    }
    return (
        navigationBar
    );

}