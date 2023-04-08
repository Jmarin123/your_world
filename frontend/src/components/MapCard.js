import React from 'react'
import { GlobalStoreContext } from '../store'
import { useContext } from 'react';
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

export default function MapCard() {
    const location = useLocation();
    const { store } = useContext(GlobalStoreContext);

    const handleDeleteMap = (event) => {
        event.preventDefault();
        // console.log(event)
        store.markMapForDeletion("hard-coded")
      };

    let StyledIconButton = styled(IconButton)({
        color: "black",
        
        '&:hover': {
            opacity: 1,
            transition: "color 0.7s, transform 0.7s",
            transform: 'scale(1.1)',
            color: '#FDE66B'
        }
    });

    let publishedMapCard = <ListItem id='published-listItemMapCard' >
        <div
            key={1}
            id="mapCard1"
        >
            <div id='cardTitle'>
                Atlantis
            </div>

            <div id='map-card-line'></div>
            
            <p id='map-card-author'>By: Author</p>

            <img id="map-card-image" src={MapCardSample} alt="mapcardsample" />

            <Box sx={{marginTop: '6%', marginLeft: '4%', height: '100%'}}>
                <StyledIconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    sx={{ mr: 2 }}
                >
                    <DownloadIcon style={{ fontSize: "35px", float: "left", positon:"absolute"}} />
                </StyledIconButton>

                <StyledIconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    sx={{ mr: 2 }}
                >
                    <FileCopyIcon style={{ fontSize: "35px", float: "left",  positon:"absolute"}} />
                </StyledIconButton>
            </Box>
        </div>
    </ListItem>

    let unpublishedMapCard = <ListItem id='unpublished-listItemMapCard' >
    <div
        key={1}
        id="mapCard2"
    >
        <div id='cardTitle'>
            Atlantis
        </div>

        <div id='map-card-line'></div>
        
        <p id='map-card-author'>By: Author</p>

        <img id="map-card-image" src={MapCardSample} alt="mapcardsample" />

        <Box sx={{marginTop: '6%', marginLeft: '4%', height: '100%'}}>
            <StyledIconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 2 }}
            >
                <DownloadIcon style={{ fontSize: "35px", float: "left", positon:"absolute"}} />
            </StyledIconButton>

            <StyledIconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 2 }}
            >
                <FileCopyIcon style={{ fontSize: "35px", float: "left",  positon:"absolute"}} />
            </StyledIconButton>

            <StyledIconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 2 }}
                onClick={(event) => {
                        handleDeleteMap(event)
                    }}
            >
                <DeleteOutlineIcon style={{ fontSize: "35px", float: "left", positon:"absolute"}} />
            </StyledIconButton>

            <StyledIconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 2 }}
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
    if (location.pathname === "/home") {
        mapCards = [publishedMapCard, publishedMapCard] 
    } else {
        publishedMapCard = <ListItem id='published-listItemMapCard' >
        <div
            key={1}
            id="mapCard1"
        >
            <div id='cardTitle'>
                Atlantis
            </div>

            <div id='map-card-line'></div>
            
            <p id='map-card-author'>By: Author</p>

            <img id="map-card-image" src={MapCardSample} alt="mapcardsample" />

            <Box sx={{marginTop: '6%', marginLeft: '4%', height: '100%'}}>
                <StyledIconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    sx={{ mr: 2 }}
                >
                    <DownloadIcon style={{ fontSize: "35px", float: "left", positon:"absolute"}} />
                </StyledIconButton>

                <StyledIconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    sx={{ mr: 2 }}
                >
                    <FileCopyIcon style={{ fontSize: "35px", float: "left",  positon:"absolute"}} />
                </StyledIconButton>

                <StyledIconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 2 }}
                onClick={(event) => {
                    handleDeleteMap(event)
                }}
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