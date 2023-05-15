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
    const isMenuOpen = Boolean(anchorEl);
    const [anchorE2, setAnchorE2] = useState(null);
    const isUploadMenuOpen = Boolean(anchorE2);
    const location = useLocation();
    const navigate = useNavigate();
    const [label, setLabel] = useState("Select an option to search for maps...");
    const [s, setS] = useState("");
    let disabled = false;
    let isPubPage = false;
    let uploadDisabled = false;
    // let mapCard = [];

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
        store.clearSearch();
        setS("");
    }
    console.log(store.filterSearch);

    if (location.pathname === '/public' || location.pathname === '/search') {
        isPubPage = true;
    }

    const handleSearchUser = () => {
        navigate('/public');
        setS("");
        store.setFilterSearch("users");
        console.log(store.filterSearch);
        setLabel("Search by first and last name")
    }

    const handleSearchMap = () => {
        navigate('/public');
        setS("");
        store.setFilterSearch("mapname");
        setLabel("Search by map name")
    }

    const handleSearchProperty = () => {
        navigate('/public');
        setS("");
        store.setFilterSearch("property");
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
            store.clearSearch();
            setS("");

        }
    }

    const handlePublicMapsPage = () => {
        store.clearSearch();
        setS("");
        navigate('/public');
    }

    const handleSearchPage = (event) => {
        navigate('/search')
    }

    function handleHomescreen() {
        // store.closeCurrentList();
    }

    console.log(location.pathname === '/mapview/' + id);
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
        // onClick={() => handleClick("/mapview-comment")}
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
            <MenuItem onClick={handleUploadShapefile} data-cy='upload-shp-dbf-btn'> Upload Shapefile/DBF Combo</MenuItem>
            <MenuItem onClick={handleUploadGeojson} data-cy='upload-geojson-btn'> Upload GeoJSON</MenuItem>
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
            data-cy='guest-login-register-btn'
        >
            <MenuItem component={Link} to="/login" onClick={handleMenuClose} data-cy='guest-login-btn'><Link to='/login'>Login</Link></MenuItem>
            <MenuItem component={Link} to="/register" onClick={handleMenuClose} data-cy='guest-register-btn'><Link to='/register'>Create New Account</Link></MenuItem>
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
            data-cy="logout-menu"
        >
            <MenuItem component={Link} to="/" onClick={handleLogout} data-cy="logout-menu-btn"><Link to='/'>Log Out Of Account</Link></MenuItem>
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
    // disabled={disabled}
    // onClick={() => handleClick("/public")}
    >
        <Public sx={{ paddingX: "1%" }} style={{ fontSize: "45px", float: "right" }} onClick={handlePublicMapsPage} />
    </StyledIconButton>

    let homeIcon = <StyledIconButton
        edge="start"
        color="inherit"
        aria-label="open drawer"
        sx={{ mr: 2 }}
        disabled={auth.loggedIn ? false : true}
        data-cy="home-icon"
    // onClick={() => handleClick("/public")}
    >
        <Home style={{ fontSize: "45px", float: "right" }} onClick={handleHomePage} />
    </StyledIconButton>

    let searchIcon = <StyledIconButton
        edge="start"
        color="inherit"
        aria-label="open drawer"
        sx={{ mr: 2 }}
        // onClick={handleSearchPage}
        onClick={(e) => {
            e.preventDefault();
            console.log(store.filterSearch);
            store.setSearch(s);
            console.log(store.filterSearch);
            console.log(store.search);
            e.target.value = "";
            navigate('/search')
        }}
    // disabled={disabled}
    // onClick={() => handleClick("/public")}
    >
        <Search style={{ fontSize: "45px", float: "right" }} />
    </StyledIconButton>
    let searchfield = <Box
        // component="form"
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
                setS(search);
                e.target.value = "";
            }}
            onKeyPress={(e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    store.setSearch(s);
                    e.target.value = "";
                    navigate('/search')
                }
            }}
        />
    </Box>

    let searchByUserNameIcon = <StyledIconButton
        edge="start"
        color="inherit"
        aria-label="open drawer"
        sx={{ mr: 2, marginLeft: '5px' }}
        onClick={() => handleSearchUser()}
    >
        <PersonOutline style={{ fontSize: "45px", float: "right" }} />
    </StyledIconButton>

    let searchByMapNameIcon = <StyledIconButton
        edge="start"
        color="inherit"
        aria-label="open drawer"
        sx={{ mr: 2 }}
        onClick={() => handleSearchMap()}
    >
        <Map style={{ fontSize: "45px", float: "right" }} />
    </StyledIconButton>

    let searchByMapProperty = <StyledIconButton
        edge="start"
        color="inherit"
        aria-label="open drawer"
        sx={{ mr: 2 }}
        onClick={() => handleSearchProperty()}
    >
        <Workspaces style={{ fontSize: "45px", float: "right" }} />
    </StyledIconButton>
    if (location.pathname === '/public') {
        globeIcon = <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2, marginLeft: "5px", color: '#FDE66B' }}
        >
            <Public sx={{ paddingX: "1%" }} style={{ fontSize: "45px", float: "right" }} onClick={handlePublicMapsPage} />
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
            <Home style={{ fontSize: "45px", float: "right" }} onClick={handleHomePage} />
        </StyledIconButton>
    }
    else if (location.pathname === '/search') {
        searchIcon = <StyledIconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2, color: '#FDE66B' }}
        >
            <Search style={{ fontSize: "45px", float: "right" }} onClick={handleSearchPage} />
        </StyledIconButton>
    }

    let editToolbarMenu = "";
    // if (auth.user || auth.type) {
    if (location.pathname !== '/' && location.pathname !== '/register' && location.pathname !== '/login' && location.pathname !== '/forgotpassword') {
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
                            {isPubPage ? searchIcon : <div></div>}
                            {/* {searchIcon} */}

                            {isPubPage ? searchfield : <div></div>}
                            {isPubPage ? searchByUserNameIcon : <div></div>}
                            {isPubPage ? searchByMapNameIcon : <div></div>}
                            {isPubPage ? searchByMapProperty : <div></div>}




                        </Typography>

                        <Box sx={{ flexGrow: 1 }}>{editToolbar}</Box>
                        {disabled ? commentButton : <div></div>}
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <StyledIconButton
                                edge="start"
                                color="inherit"
                                aria-label="open drawer"
                                sx={{ mr: 2 }}
                                disabled={uploadDisabled}
                            // onClick={() => handleClick("/user-lists")}
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
                                    data-cy='upload-menu-btn'
                                />
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
                                <AccountCircle
                                    size="large"
                                    edge="end"
                                    aria-label="account of current user"
                                    aria-controls={menuId}
                                    aria-haspopup="true"
                                    onClick={handleProfileMenuOpen}
                                    fontSize='large'
                                    style={{ fontSize: "45px" }}
                                    data-cy="login-or-logout-value"
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
                {/* {
                menu
            } */}
            </Box>);
    }
    return (
        editToolbarMenu
    );

}