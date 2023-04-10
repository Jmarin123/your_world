import React from 'react'
// import { GlobalStoreContext } from '../store'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import MapCardSample from './/mapcardsample.jpg'
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { useLocation } from "react-router-dom";

import { GlobalStoreContext } from '../store'
import { useContext, useState } from 'react';
import AuthContext from '../auth/index'

export default function MapCard() {
    const location = useLocation();
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [title] = useState("Atlantis");


    const handleDeleteMap = (event) => {
        event.preventDefault();
        // console.log(event)
        store.markMapForDeletion("Atlantis");
      };

    const handleDuplicateMap = (event) => {
        event.preventDefault();
        store.duplicateMap(); //TODO: Use event to duplicate map
    }

    const handleExport = (event) => {
        event.preventDefault();
        store.markMapForExport("Atlantis");
    }

    const handleCardClick = (event) => {
        console.log("Clicked on card")
        store.navToMap()
    }

    const handlePubCardClick = (event) => {
        console.log("Clicked on card")
        store.navToPubMap()
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
        fontSize: '1em'  }}
>
    <FileCopyIcon style={{ fontSize: "35px", float: "left",  positon:"absolute"}} />
    </StyledIconButton>

    let publishedMapCard = <ListItem id='published-listItemMapCard' >
        <div
            key={1}
            id="mapCard1"
            onDoubleClick={handlePubCardClick}
        >
            <div id='cardTitle'>
                {title}
            </div>

            <div id='map-card-line'></div>
            
            <p id='map-card-author'>By: Author</p>

            <img id="map-card-image" src={MapCardSample} alt="mapcardsample" />

           
                <StyledIconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    onClick={(event) => {
                        handleExport(event)
                    }}
                    sx={{position: 'absolute', bottom: '0',
                        left: '5px',
                        fontSize: '1em' }}
                >
                    <DownloadIcon style={{ fontSize: "35px", float: "left", positon:"absolute"}} />
                </StyledIconButton>

                {auth.loggedIn ? duplicateButton: <div></div>}
            
        </div>
    </ListItem>

    let unpublishedMapCard = <ListItem id='unpublished-listItemMapCard' >
    <div
        key={1}
        id="mapCard2"
        onDoubleClick={handleCardClick}
    >
        <div id='cardTitle'>
            {title}
        </div>

        <div id='map-card-line'></div>
        
        <p id='map-card-author'>By: Author</p>

        <img id="map-card-image" src={MapCardSample} alt="mapcardsample" />

        <Box sx={{marginTop: '6%', marginLeft: '4%', height: '100%'}}>
            <StyledIconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={(event) => {
                    handleExport(event)
                }}
                sx={{position: 'absolute', bottom: '0',
                        left: '5px',
                        fontSize: '1em' }}
            >
                <DownloadIcon style={{ fontSize: "35px", float: "left", positon:"absolute"}} />
            </StyledIconButton>

            <StyledIconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={(event) => {
                    handleDuplicateMap(event)
                }}
                sx={{position: 'absolute', bottom: '0',
                        left: '49px',
                        fontSize: '1em' }}
            >
                <FileCopyIcon style={{ fontSize: "35px", float: "left",  positon:"absolute"}} />
            </StyledIconButton>

            <StyledIconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={(event) => {
                    handleDeleteMap(event)
                }}
                sx={{position: 'absolute', bottom: '0',
                        left: '93px',
                        fontSize: '1em' }}
            >
                <DeleteOutlineIcon style={{ fontSize: "35px", float: "left", positon:"absolute"}} />
            </StyledIconButton>

            <StyledIconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{position: 'absolute', bottom: '0',
                        left: '137px',
                        fontSize: '1em' }}
            >
                <BorderColorIcon style={{ fontSize: "35px", float: "left", positon:"absolute"}} />
            </StyledIconButton>
        </Box>
    </div>
    </ListItem>

    let mapCards;
    //if from /home only display published map cards that have 2 button icon's
    //if from /yourmaps display published and unpublished map cards, 
    //HOWEVER edit the published mapcards so it as an extra icon to delete published maps from the registered user
    if (location.pathname === "/home" || location.pathname === "/search") {
        mapCards = [publishedMapCard, publishedMapCard] 
    } else {
        publishedMapCard = <ListItem id='published-listItemMapCard'>
        <div
            key={1}
            id="mapCard1"
            onDoubleClick={handlePubCardClick}
        >
            <div id='cardTitle'>
                {title}
            </div>

            <div id='map-card-line'></div>
            
            <p id='map-card-author'>By: Author</p>

            <img id="map-card-image" src={MapCardSample} alt="mapcardsample" />

            <Box sx={{marginTop: '6%', marginLeft: '4%', height: '100%'}}>
                <StyledIconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    onClick={(event) => {
                        handleExport(event)
                    }}
                    sx={{position: 'absolute', bottom: '0',
                        left: '5px',
                        fontSize: '1em' }}
                >
                    <DownloadIcon style={{ fontSize: "35px", float: "left", positon:"absolute"}} />
                </StyledIconButton>

                <StyledIconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    onClick={(event) => {
                        handleDuplicateMap(event)
                    }}
                    sx={{position: 'absolute', bottom: '0',
                        left: '49px',
                        fontSize: '1em' }}
                >
                    <FileCopyIcon style={{ fontSize: "35px", float: "left",  positon:"absolute"}} />
                </StyledIconButton>

                <StyledIconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={(event) => {
                    handleDeleteMap(event)
                }}
                sx={{position: 'absolute', bottom: '0',
                        left: '93px',
                        fontSize: '1em' }}
            >
                <DeleteOutlineIcon style={{ fontSize: "35px", float: "left", positon:"absolute"}} />
            </StyledIconButton>
            </Box>
        </div>
        </ListItem>
        mapCards = [publishedMapCard, unpublishedMapCard]
    }
    


    return (

        [mapCards]



        // <ListItem id='published-listItemMapCard' >
        //     <div
        //         key={1}
        //         id="mapCard1"
        //     >
        //         <div id='cardTitle'>
        //             Atlantis
        //         </div>

        //         <div id='map-card-line'></div>
                
        //         <p id='map-card-author'>By: Author</p>

        //         <img id="map-card-image" src={MapCardSample} alt="mapcardsample" />

        //         <Box sx={{marginTop: '6%', marginLeft: '4%', height: '100%'}}>
        //             <StyledIconButton
        //                 edge="start"
        //                 color="inherit"
        //                 aria-label="open drawer"
        //                 sx={{ mr: 2 }}
        //             >
        //                 <DownloadIcon style={{ fontSize: "35px", float: "left", positon:"absolute"}} />
        //             </StyledIconButton>

        //             <StyledIconButton
        //                 edge="start"
        //                 color="inherit"
        //                 aria-label="open drawer"
        //                 sx={{ mr: 2 }}
        //             >
        //                 <FileCopyIcon style={{ fontSize: "35px", float: "left",  positon:"absolute"}} />
        //             </StyledIconButton>
        //         </Box>
        //     </div>
        // </ListItem>
    );

}