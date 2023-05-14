import React, { useContext, useState, useEffect } from 'react'

import { GlobalStoreContext } from '../store'
import AuthContext from '../auth/index'

import { Box, List, InputLabel, MenuItem, FormControl, Select } from '@mui/material';

import MapCard from './MapCard.js';

export default function HomePage() {
    const [sortValue, setSortvalue] = useState("Map Title");
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const handleChange = (event) => {
        setSortvalue(event.target.value);
    };

    useEffect(() => {
        store.loadIdNamePairs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    let mapCard = [];

    for (let i = 0; i < store.idNamePairs.length; i++) {
        if (auth && auth.user && auth.user.email === store.idNamePairs[i].ownerEmail) {
            mapCard.push(store.idNamePairs[i]);
        }
    }

    function handleMenuItemClick(sortParam) {
        store.setSort(sortParam);
    }

    if (mapCard.length > 0 && store && store.sort !== "") {
        mapCard = store.sortList(mapCard);
    }
    // if (store.search !== "" && store.idNamePairs) {
    //     listCard = store.filterBySearch("home");
    // }
    // if (listCard.length > 0 && store && store.sort !== "") {
    //     listCard = store.sortList(listCard);
    // }
    return (
        <Box sx={{ flexGrow: 1 }} id="homePageBackground">
            <Box id="publicBox" sx={{
                        overflowY: 'auto',
                        overflowX: 'hidden'
                    }}component="form" noValidate >
                <section id="public">Your Maps</section>


                <FormControl variant="standard" sx={{
                    m: 1,
                    width: '100px',
                    right: 0,
                    top: '5px',
                    height: '25px',
                    position: 'absolute',
                    '& > :not(style)': { backgroundColor: "#D9D9D9", marginTop: '0.75%' },
                    "& .css-m5hdmq-MuiInputBase-root-MuiInput-root-MuiSelect-root:after": {
                        borderColor: '#FDE66B'
                    },
                    "& label.Mui-focused": {
                        color: '#756060' //purple
                    },
                }}>
                    <InputLabel id="demo-simple-select-standard-label">Sort By</InputLabel>
                    <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={sortValue}

                        label="Sort By"
                        defaultValue={sortValue}
                        onChange={handleChange}
                    >
                        <MenuItem value={"Map Title"} onClick={() => handleMenuItemClick("maptitle")}> Map Title </MenuItem>
                        <MenuItem value={"Likes"} onClick={() => handleMenuItemClick("likes")}>Likes</MenuItem>
                        <MenuItem value={"Dislikes"} onClick={() => handleMenuItemClick("dislikes")}>Dislikes</MenuItem>
                    </Select>
                </FormControl>


                <div id='line'></div>

                <List id="map-cards-list"
                    sx={{
                        display: 'flex',
                        // overflow: 'auto',
                    }}
                    data-cy="list-of-cards"
                >
                    {
                        mapCard.map((pair) => (
                            <MapCard
                                key={pair._id}
                                idNamePair={pair}

                                selected={false}
                            />
                        ))
                    }
                </List>

            </Box>
        </Box>
    );
}


