import { GlobalStoreContext } from '../store'
import { useContext, useState } from 'react';
import Map from './Map.js';
import Comment from './Comment';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

export default function Mapview() {
    const { store } = useContext(GlobalStoreContext);
    console.log(store.openComment);

    let mapViewMenu =
        <Box sx={{ flexGrow: 1 }} id="homePageBackground">

            <Box id="box">
                <Map />
            </Box>

        </Box>

    if (store.openComment) {
        mapViewMenu =
            <div >
                <Grid container spacing={1} >
                    <Grid item xs={8}
                        style={{
                            paddingLeft: '1%',
                            top: '50px',
                            left: '10px',
                            height: '850px',
                            // overflowY: 'auto',
                        }}
                    >
                        <Map />
                    </Grid>

                    <Grid item xs={4}
                        style={{
                            paddingRight: '1%',
                            top: '50px',
                            left: '0px',
                            height: '850px',
                            // overflowY: 'auto',
                        }}
                    >
                        <Comment />
                    </Grid>

                </Grid>
            </div >
    }
    return (

        mapViewMenu

    );
}