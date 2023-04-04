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
                {/* <Map /> */}
            </Box>

        </Box>

    if (store.openComment) {
        mapViewMenu =
            <div >
                <Grid container spacing={0.5} >
                    <Grid item xs={9}
                        style={{
                            paddingLeft: '1%',
                            top: '50px',
                            left: '10px',
                            height: '1000px',
                            // overflowY: 'auto',
                        }}
                    >
                        <Map />
                    </Grid>

                    <Grid item xs={3}
                        style={{
                            paddingRight: '1%',
                            top: '50px',
                            height: '90px',
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