import React from 'react'
// import { GlobalStoreContext } from '../store'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import MapCardSample from './/mapcardsample.jpg'
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import FileCopyIcon from '@mui/icons-material/FileCopy';

export default function MapCard() {

    let cardClass = "list-card unselected-list-card";

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


    return (
        <ListItem id='listItemMapCard' >
            <div
                key={1}
                id="mapCard1"
                className={cardClass}
            >
                <div id='cardTitle'>
                    Atlantis
                </div>

                <div id='map-card-line'></div>
                
                <p id='map-card-author'>By: Author</p>

                <img id="map-card-image" src={MapCardSample} alt="mapcardsample" />

                <Box sx={{marginTop: '6%', marginLeft: '4%'}}>
                    <StyledIconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 2 }}
                    >
                        <DownloadIcon style={{ fontSize: "35px", float: "left" }} />
                    </StyledIconButton>

                    <StyledIconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 2 }}
                    >
                        <FileCopyIcon style={{ fontSize: "35px", float: "left" }} />
                    </StyledIconButton>
                </Box>
            </div>
        </ListItem>
    );

}