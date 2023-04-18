import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { GlobalStoreContext } from '../store'
import AuthContext from '../auth/index'

import { styled } from '@mui/material/styles';
import { Box, Typography, ListItem, IconButton } from '@mui/material';
import { Download, FileCopy, DeleteOutline, BorderColor, ThumbDownOffAlt, ThumbUpOffAlt } from '@mui/icons-material/';

import MapCardSample from './/mapcardsample.jpg'

export default function MapCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    const location = useLocation();
    const navigate = useNavigate();

    const { idNamePair } = props;

    let userName = "";
    if (auth.user) {
        userName = auth.user.firstName + " " + auth.user.lastName;
    }

    let disabled = false;
    if (auth.type === 'guest' || location.pathname !== '/home') {
        disabled = true;
    }

    const handleDeleteMap = () => {
        store.markMapForDeletion(idNamePair._id);
    };

    const handleEditMapName = (id) => {
        store.showRenameModal(idNamePair._id);
    };

    const handleDuplicateMap = () => {
        store.duplicateMap(idNamePair._id);
    }

    const handleExport = (event) => {
        event.preventDefault();
        store.markMapForExport("Atlantis");
    }

    async function handleOpenCard(id) {
        await store.setCurrentMap(id)
        console.log("AWAITED STORE THING", store.currentMap);
        navigate("/map/" + id);
    }

    async function handleOpenPublicCard(id) {
        store.setCurrentMap(id)
        navigate("/mapview/" + id);
    }

    let image = idNamePair.image === "temp" ? MapCardSample : idNamePair.image

    /* handleLikeDislike will handle updating the liked and disliked button, as well as the 
    like and/or dislike count of this list */
    function handleLikeDislike(param) {
        if (auth.type !== "guest") {
            if (param === "like") {
                if (idNamePair.likes.includes(userName)) {
                    //If the user clicks like after already clicking it once, remove their like
                    idNamePair.likes = idNamePair.likes.filter(username => username !== userName);
                }
                else if (idNamePair.dislikes.includes(userName)) {
                    idNamePair.dislikes = idNamePair.dislikes.filter(username => username !== userName);
                    idNamePair.likes.push(userName);
                }
                else {
                    idNamePair.likes.push(userName);
                    console.log(idNamePair.likes);
                }
            }
            else {
                if (idNamePair.likes.includes(userName)) {
                    idNamePair.likes = idNamePair.likes.filter(username => username !== userName);
                    idNamePair.dislikes.push(userName);
                }
                else if (idNamePair.dislikes.includes(userName)) {
                    idNamePair.dislikes = idNamePair.dislikes.filter(username => username !== userName);
                }
                else {
                    idNamePair.dislikes.push(userName);
                }
            }
            store.currentMap.likes = idNamePair.likes;
            store.currentMap.dislikes = idNamePair.dislikes;
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
            handleDuplicateMap()
        }}
        sx={{
            position: 'absolute', bottom: '0',
            left: '49px',
            fontSize: '1em'
        }}
    >
        <FileCopy style={{ fontSize: "35px", float: "left", positon: "absolute" }} />
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
        <DeleteOutline style={{ fontSize: "35px", float: "left", positon: "absolute" }} />
    </StyledIconButton>

    let publishedMapCard = <ListItem id='published-listItemMapCard'>
        <div
            id="mapCard1"
            key={idNamePair._id}
            onDoubleClick={() => handleOpenPublicCard(idNamePair._id)}
        >

            <Box sx={{ p: 0.5 }}>
                <Box id='cardTitle'> {idNamePair.name} </Box>
                <Box id='map-card-line'></Box>
                <Typography id='map-card-author'> By: {idNamePair.owner} </Typography>
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
                <Download style={{ fontSize: "35px", float: "left", positon: "absolute" }} />
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
                <ThumbDownOffAlt style={{ fontSize: "35px", float: "right", positon: "absolute" }}
                    onClick={() => handleLikeDislike("dislike")} />

                <strong style={{ color: 'black' }}>
                    {idNamePair.dislikes.length}
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
                <ThumbUpOffAlt style={{ fontSize: "35px", float: "right", positon: "absolute" }}
                    onClick={() => handleLikeDislike("like")} />

                <strong style={{ color: 'black' }}>
                    {idNamePair.likes.length}
                </strong>
            </StyledIconButton>

            {auth.loggedIn ? duplicateButton : <div></div>}

        </div>
    </ListItem>

    let unpublishedMapCard = <ListItem id='unpublished-listItemMapCard'>
        <div
            key={idNamePair._id}
            id="mapCard2"
            // onDoubleClick={handleCardClick}
            onDoubleClick={() => handleOpenCard(idNamePair._id)}
        >

            <Box sx={{ p: 0.5 }}>
                <Box id='cardTitle'> {idNamePair.name} </Box>
                <Box id='map-card-line'></Box>
                <Typography id='map-card-author'> By: {idNamePair.owner} </Typography>
            </Box>

            <img id="map-card-image" src={image} alt="mapcardsample" />

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
                    <Download style={{ fontSize: "35px", float: "left", positon: "absolute" }} />
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
                    <FileCopy style={{ fontSize: "35px", float: "left", positon: "absolute" }} />
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
                    <DeleteOutline style={{ fontSize: "35px", float: "left", positon: "absolute" }} />
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
                    <BorderColor style={{ fontSize: "35px", float: "left", positon: "absolute" }} />
                </StyledIconButton>
            </Box>
        </div>
    </ListItem>

    let mapCards;
    if (idNamePair.publish && idNamePair.publish.isPublished) {
        mapCards = [publishedMapCard]
    }
    else {
        mapCards = [unpublishedMapCard]
    }
    //if from /public only display published map cards that have 2 button icon's
    //if from /home display published and unpublished map cards, 
    //HOWEVER edit the published mapcards so it as an extra icon to delete published maps from the registered user
    // if (location.pathname === "/public" || location.pathname === "/search") {
    //     mapCards = [publishedMapCard]
    // } else {
    //     publishedMapCard = <ListItem id='published-listItemMapCard'>
    //         <div
    //             key={1}
    //             id="mapCard1"
    //             onDoubleClick={handlePubCardClick}
    //         >
    //             <Box sx={{ p: 0.5 }}>
    //                 <Box id='cardTitle'>
    //                     {title}
    //                 </Box>

    //                 <Box id='map-card-line'>
    //                     {/* <div id='map-card-line'></div> */}
    //                 </Box>


    //                 <Typography id='map-card-author'>
    //                     By: Author
    //                     {/* <br id='map-card-author'>By: Author</br> */}
    //                 </Typography>
    //             </Box>

    //             <img id="map-card-image" src={MapCardSample} alt="mapcardsample" />

    //             <Box sx={{ marginTop: '6%', marginLeft: '4%', height: '100%' }}>
    //                 <StyledIconButton
    //                     edge="start"
    //                     color="inherit"
    //                     aria-label="open drawer"
    //                     onClick={(event) => {
    //                         handleExport(event)
    //                     }}
    //                     sx={{
    //                         position: 'absolute', bottom: '0',
    //                         left: '5px',
    //                         fontSize: '1em'
    //                     }}
    //                 >
    //                     <DownloadIcon style={{ fontSize: "35px", float: "left", positon: "absolute" }} />
    //                 </StyledIconButton>

    //                 <StyledIconButton
    //                     edge="start"
    //                     color="inherit"
    //                     aria-label="open drawer"
    //                     onClick={(event) => {
    //                         handleDuplicateMap(event)
    //                     }}
    //                     sx={{
    //                         position: 'absolute', bottom: '0',
    //                         left: '49px',
    //                         fontSize: '1em'
    //                     }}
    //                 >
    //                     <FileCopyIcon style={{ fontSize: "35px", float: "left", positon: "absolute" }} />
    //                 </StyledIconButton>

    //                 <StyledIconButton
    //                     edge="start"
    //                     color="inherit"
    //                     aria-label="open drawer"
    //                     onClick={(event) => {
    //                         handleDeleteMap(event)
    //                     }}
    //                     sx={{
    //                         position: 'absolute', bottom: '0',
    //                         left: '93px',
    //                         fontSize: '1em'
    //                     }}
    //                 >
    //                     <DeleteOutlineIcon style={{ fontSize: "35px", float: "left", positon: "absolute" }} />
    //                 </StyledIconButton>


    //                 <StyledIconButton
    //                     edge="start"
    //                     color="inherit"
    //                     aria-label="open drawer"
    //                     sx={{
    //                         position: 'absolute', bottom: '0',
    //                         right: '2px',
    //                         fontSize: '1em'
    //                     }}
    //                 >
    //                     <ThumbDownOffAltIcon style={{ fontSize: "35px", float: "right", positon: "absolute" }} /> 3
    //                 </StyledIconButton>

    //                 <StyledIconButton
    //                     edge="start"
    //                     color="inherit"
    //                     aria-label="open drawer"
    //                     sx={{
    //                         position: 'absolute', bottom: '0',
    //                         right: '50px',
    //                         fontSize: '1em'
    //                     }}
    //                 >
    //                     <ThumbUpOffAltIcon style={{ fontSize: "35px", float: "right", positon: "absolute" }} /> 9
    //                 </StyledIconButton>
    //             </Box>
    //         </div>
    //     </ListItem>
    //     // mapCards = [publishedMapCard, unpublishedMapCard]
    //     mapCards = [unpublishedMapCard]
    // }

    return (
        [mapCards]
    );

}