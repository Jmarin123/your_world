import { GlobalStoreContext } from '../store'
import React, { useContext, useEffect } from 'react'
import AuthContext from '../auth/index'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import MapCard from './MapCard.js';
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
// import { useLocation } from 'react-router-dom';

export default function PublicPage() {
    const [sort, setSort] = React.useState("Map Title");
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    // const location = useLocation();
    // let mapCard = [];

    useEffect(() => {
        store.loadAllMaps();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // if (location.pathname !== '/public') {
    //     store.clearSearch();
    // }

    const handleChange = (event) => {
        setSort(event.target.value);
    };
    console.log(auth);
    console.log(store.idNamePairs);
    let mapCard = [];

    // for (let i = 0; i < store.idNamePairs.length; i++) {
    //     if (store.idNamePairs[i].map.publish.isPublished) {
    //         mapCard.push(store.idNamePairs[i]);
    //     }
    // }

    // if (store.search !== "" && store.idNamePairs) {
    //     mapCard = store.filterBySearch();
    // }
    mapCard = store.filterBySearch();
    // let publicScreen = "Public Map Listing";
    // let resultScreen = "Result";
    return (
        <Box sx={{ flexGrow: 1 }} id="homePageBackground">

            <Box id="publicBox" component="form" noValidate >
                <section id="public">
                    {/* {store.search && store.filterSearch ? resultScreen : publicScreen} */}
                    <section id="public">Public Map Listing</section>
                </section>
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
                        <MenuItem value={"Author"}>Author</MenuItem>
                        <MenuItem value={"Likes"}>Likes</MenuItem>
                        <MenuItem value={"Dislikes"}>Dislikes</MenuItem>
                    </Select>
                </FormControl>


                <div id='line'></div>

                <List id="map-cards-list" sx={{ display: 'flex' }}>
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
