import React, { useContext, useState, useEffect } from 'react'
import { GlobalStoreContext } from '../store'

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import MapCard from './MapCard.js';
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

// import Grid from '@mui/material/Grid';
export default function HomePage() {
    const [sort, setSort] = useState("Map Title");
    const { store } = useContext(GlobalStoreContext);
    // const { auth } = useContext(AuthContext);
    const handleChange = (event) => {
        setSort(event.target.value);
    };

    // eslint-disable-next-line
    // const { auth } = useContext(AuthContext);

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    // useLayoutEffect(() => {
    //     // This will run only once when the component mounts
    //     store.loadIdNamePairs();
    //   }, []);

    // const loadIdNamePairs = useMemo(() => {
    //     // This will run only once when the component mounts
    //     return () => {
    //         store.loadIdNamePairs();
    //     };
    //   }, []);
    
      // Call the memoized function directly in the component's body
    //   loadIdNamePairs();

    let mapCard = [];
    mapCard = store.idNamePairs;
    console.log(mapCard);
    // if (store.search !== "" && store.idNamePairs) {
    //     listCard = store.filterBySearch("home");
    // }
    // if (listCard.length > 0 && store && store.sort !== "") {
    //     listCard = store.sortList(listCard);
    // }
    return (
        <Box sx={{ flexGrow: 1 }} id="homePageBackground">
            <Box id="publicBox" component="form" noValidate >
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
                        value={sort}

                        label="Sort By"
                        defaultValue={sort}
                        onChange={handleChange}
                    >
                        <MenuItem value={"Map Title"}>Map Title</MenuItem>
                        <MenuItem value={"Likes"}>Likes</MenuItem>
                        <MenuItem value={"Dislikes"}>Dislikes</MenuItem>
                    </Select>
                </FormControl>


                <div id='line'></div>

                <List id="map-cards-list"
                    sx={{
                        display: 'flex',
                        // overflowY: 'auto',
                    }}>
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


