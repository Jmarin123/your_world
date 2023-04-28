import { useContext } from 'react';
import { useLocation } from 'react-router-dom'

import { GlobalStoreContext } from '../store'

import { Typography } from '@mui/material'

function Statusbar() {
    const { store } = useContext(GlobalStoreContext);
    const location = useLocation();

    let text = "";

    if (
        location.pathname === "/map" ||
        // auth.type !== "guest" &&
        location.pathname === "/mapview"
    ) {
        text = <div id="map-statusbar">
            <Typography>
            </Typography>
            Map name here
        </div>;
    }

    if (location.pathname === "/all-lists" || location.pathname === "/user-lists") {
        text = <div id="playlister-statusbar" style={{ color: "black" }}>
            <Typography variant="h3">
                {
                    store ? store.search : ""
                }
            </Typography>
        </div>;
    }
    return (
        text
    );
}

export default Statusbar;