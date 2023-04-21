import React from 'react'
// import { GlobalStoreContext } from '../store'

import { useNavigate } from 'react-router-dom'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import MapCardSample from './/mapcardsample.jpg'
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { useLocation } from "react-router-dom";
// import Grid from '@mui/material/Grid';

import { GlobalStoreContext } from '../store'
import { useContext } from 'react';
import AuthContext from '../auth/index'

// export default function MapCard() {
export default function MapCard(props) {
    const location = useLocation();
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    // const [title] = useState("Atlantis");
    const navigate = useNavigate();

    // const [editActive, setEditActive] = useState(false);
    // const [text, setText] = useState("");
    const { idNamePair } = props;
    let map = idNamePair.map;
    let userName = "";
    if (auth.user) {
        userName = auth.user.firstName + " " + auth.user.lastName;
    }

    let disabled = false;
    if (auth.type === 'guest' || location.pathname !== '/home') {
        disabled = true;
    }

    // console.log(idNamePair);
    const handleDeleteMap = (id) => {
        store.markMapForDeletion(id);
    };

    const handleEditMapName = (id) => {
        // store.renameMap(id);
        // console.log("show rename modal")
        store.showRenameModal(idNamePair.map);
    };

    const handleDuplicateMap = () => {
        store.duplicateMap(idNamePair.map);
    }

    const handleExport = (event) => {
        event.preventDefault();
        store.markMapForExport("Atlantis");
    }

    function handleOpenCard(id) {
        store.setCurrentMap(idNamePair.map)
        navigate("/map/" + id);
    }

    function handleOpenPublicCard(id) {
        store.setCurrentMap(idNamePair.map)
        navigate("/mapview/" + id);
    }

    /* handleLikeDislike will handle updating the liked and disliked button, as well as the 
    like and/or dislike count of this list */
    function handleLikeDislike(param) {
        if (auth.type !== "guest") {
            if (param === "like") {
                if (map.likes.includes(userName)) {
                    //If the user clicks like after already clicking it once, remove their like
                    map.likes = map.likes.filter(username => username !== userName);
                }
                else if (map.dislikes.includes(userName)) {
                    map.dislikes = map.dislikes.filter(username => username !== userName);
                    map.likes.push(userName);
                }
                else {
                    map.likes.push(userName);
                    console.log(map.likes);
                }
            }
            else {
                if (map.likes.includes(userName)) {
                    map.likes = map.likes.filter(username => username !== userName);
                    map.dislikes.push(userName);
                }
                else if (map.dislikes.includes(userName)) {
                    map.dislikes = map.dislikes.filter(username => username !== userName);
                }
                else {
                    map.dislikes.push(userName);
                }
            }
            store.currentMap = map;
            store.updateCurrentMap();
        }
    }

    let StyledIconButton = styled(IconButton)({
        color: "black",

        '&:hover': {
            opacity: 1,
            transition: "color 0.7s, transform 0.7s",
            transform: 'scale(1.1)',
            color: '#FDE66B'
        }
    });

    let duplicateButton = <StyledIconButton
        edge="start"
        color="inherit"
        aria-label="open drawer"
        onClick={(event) => {
            handleDuplicateMap(event)
        }}
        sx={{
            position: 'absolute', bottom: '0',
            left: '49px',
            fontSize: '1em'
        }}
    >
        <FileCopyIcon style={{ fontSize: "35px", float: "left", positon: "absolute" }} />
    </StyledIconButton>
    let deleteButton = < StyledIconButton
        edge="start"
        color="inherit"
        aria-label="open drawer"
        onClick={(event) => {
            handleDeleteMap(idNamePair._id)
        }}
        sx={{
            position: 'absolute', bottom: '0',
            left: '93px',
            fontSize: '1em'
        }}
    >
        <DeleteOutlineIcon style={{ fontSize: "35px", float: "left", positon: "absolute" }} />
    </StyledIconButton>
    // console.log(auth.user.email);
    // console.log(map.ownerEmail);
    // console.log(auth.email === map.ownerEmail);
    let publishedMapCard = <ListItem id='published-listItemMapCard'>
        <div
            id="mapCard1"
            key={idNamePair._id}
            onDoubleClick={() => handleOpenPublicCard(idNamePair._id)}
        >

            <Box sx={{ p: 0.5 }}>
                <Box id='cardTitle'>
                    {idNamePair.name}
                </Box>

                <Box id='map-card-line'>
                    {/* <div id='map-card-line'></div> */}
                </Box>


                <Typography id='map-card-author'>
                    By: {idNamePair.map.owner}
                </Typography>
            </Box>

            <img id="map-card-image" src={MapCardSample} alt="mapcardsample" />


            <StyledIconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={(event) => {
                    handleExport(event)
                }}
                sx={{
                    position: 'absolute', bottom: '0',
                    left: '5px',
                    fontSize: '1em'
                }}
            >
                <DownloadIcon style={{ fontSize: "35px", float: "left", positon: "absolute" }} />
            </StyledIconButton>
            {!disabled ? deleteButton : <div></div>}
            <StyledIconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{
                    position: 'absolute', bottom: '0',
                    right: '2px',
                    fontSize: '1em'
                }}
            >
                <ThumbDownOffAltIcon style={{ fontSize: "35px", float: "right", positon: "absolute" }}
                    onClick={() => handleLikeDislike("dislike")} />

                <strong style={{ color: 'black' }}>
                    {map.dislikes.length}
                </strong>
            </StyledIconButton>

            <StyledIconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{
                    position: 'absolute', bottom: '0',
                    right: '50px',
                    fontSize: '1em'
                }}
            >
                <ThumbUpOffAltIcon style={{ fontSize: "35px", float: "right", positon: "absolute" }}
                    onClick={() => handleLikeDislike("like")} />

                <strong style={{ color: 'black' }}>
                    {map.likes.length}
                </strong>
            </StyledIconButton>

            {auth.loggedIn ? duplicateButton : <div></div>}

        </div>
    </ListItem >

    let unpublishedMapCard = <ListItem id='unpublished-listItemMapCard' >
        <div
            key={idNamePair._id}
            id="mapCard2"
            // onDoubleClick={handleCardClick}
            onDoubleClick={() => handleOpenCard(idNamePair._id)}
        >

            <Box sx={{ p: 0.5 }}>
                <Box id='cardTitle'>
                    {idNamePair.name}
                </Box>

                <Box id='map-card-line'>
                    {/* <div id='map-card-line'></div> */}
                </Box>


                <Typography id='map-card-author'>
                    By: {idNamePair.map.owner}
                    {/* <br id='map-card-author'>By: Author</br> */}
                </Typography>
            </Box>

            <img id="map-card-image" src={MapCardSample} alt="mapcardsample" />

            <Box sx={{ marginTop: '6%', marginLeft: '4%', height: '100%' }}>
                <StyledIconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    onClick={(event) => {
                        handleExport(event)
                    }}
                    sx={{
                        position: 'absolute', bottom: '0',
                        left: '5px',
                        fontSize: '1em'
                    }}
                >
                    <DownloadIcon style={{ fontSize: "35px", float: "left", positon: "absolute" }} />
                </StyledIconButton>

                <StyledIconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    onClick={() => handleDuplicateMap()}
                    sx={{
                        position: 'absolute', bottom: '0',
                        left: '49px',
                        fontSize: '1em'
                    }}
                >
                    <FileCopyIcon style={{ fontSize: "35px", float: "left", positon: "absolute" }} />
                </StyledIconButton>

                <StyledIconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    onClick={(event) => {
                        handleDeleteMap(idNamePair._id)
                    }}
                    sx={{
                        position: 'absolute', bottom: '0',
                        left: '93px',
                        fontSize: '1em'
                    }}
                >
                    <DeleteOutlineIcon style={{ fontSize: "35px", float: "left", positon: "absolute" }} />
                </StyledIconButton>

                <StyledIconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    onClick={(event) => {
                        handleEditMapName(idNamePair._id)
                    }}
                    sx={{
                        position: 'absolute', bottom: '0',
                        left: '137px',
                        fontSize: '1em'
                    }}
                >
                    <BorderColorIcon style={{ fontSize: "35px", float: "left", positon: "absolute" }} />
                </StyledIconButton>

            </Box>
        </div>
    </ListItem>

    let mapCards;
    if (map.publish.isPublished) {
        mapCards = [publishedMapCard]
    }
    else {
        mapCards = [unpublishedMapCard]
    }

    return (
        [mapCards]
    );

}