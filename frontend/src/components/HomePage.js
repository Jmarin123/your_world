import { useContext, useState } from 'react';
import { GlobalStoreContext } from '../store'
import { Link } from 'react-router-dom'
import Map from './Map.js';

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

export default function AppBanner() {

    return (
        <Box sx={{ flexGrow: 1 }} id="homePageBackground">

            <Box id="box">
                <Map />
            </Box>

        </Box>
    );
}