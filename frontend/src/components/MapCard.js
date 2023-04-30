import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { GlobalStoreContext } from '../store'
import AuthContext from '../auth/index'

import { styled } from '@mui/material/styles';
import { Box, Typography, ListItem, IconButton } from '@mui/material';
import { Download, FileCopy, DeleteOutline, BorderColor, ThumbDownOffAlt, ThumbUpOffAlt } from '@mui/icons-material/';

import MapCardSample from './/mapcardsample.jpg'

export default function MapCard(props) {
    const location = useLocation();
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    // const [title] = useState("Atlantis");
    const navigate = useNavigate();

    // const [editActive, setEditActive] = useState(false);
    // const [text, setText] = useState("");
    const { idNamePair } = props;
    let userName = "";
    if (auth.user) {
        userName = auth.user.firstName + " " + auth.user.lastName;
    }

    let disabled = false;
    if (auth.type === 'guest' || location.pathname !== '/home') {
        disabled = true;
    }

    // console.log(idNamePair);
    const handleDeleteMap = () => {
        store.markMapForDeletion(idNamePair._id);
    };

    const handleEditMapName = (id) => {
        // store.renameMap(id);
        // console.log("show rename modal")
        store.showRenameModal(idNamePair._id);
    };

    const handleDuplicateMap = () => {
        store.duplicateMap(idNamePair._id);
    }

    const handleExport = (event) => {
        event.preventDefault();
        store.markMapForExport(idNamePair._id, idNamePair.name);
    }

    async function handleOpenCard(id) {
        await store.setCurrentMap(id)
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
            store.updateLikesDislikes(idNamePair);
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
        data-cy="dup-btn"
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
        data-cy="del-btn"
    >
        <DeleteOutline style={{ fontSize: "35px", float: "left", positon: "absolute" }} />
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
                <Box id='cardTitle' data-cy="title-of-map-card">
                    {idNamePair.name}
                </Box>

                <Box id='map-card-line'>
                    {/* <div id='map-card-line'></div> */}
                </Box>


                <Typography id='map-card-author'>
                    By: {idNamePair.owner}
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
                data-cy="download-btn"
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
    </ListItem >

    let unpublishedMapCard = <ListItem id='unpublished-listItemMapCard' >
        <div
            key={idNamePair._id}
            id="mapCard2"
            // onDoubleClick={handleCardClick}
            onDoubleClick={() => handleOpenCard(idNamePair._id)}
        >

            <Box sx={{ p: 0.5 }}>
                <Box id='cardTitle' data-cy="title-of-map-card">
                    {idNamePair.name}
                </Box>

                <Box id='map-card-line'>
                </Box>

                <Typography id='map-card-author'>
                    By: {idNamePair.owner}
                </Typography>
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
                    data-cy="dup-btn"
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
                    data-cy="del-btn"
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
                    data-cy="rename-btn"
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

    return (
        [mapCards]
    );

}