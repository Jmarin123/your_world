import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { Typography } from '@mui/material'
// import AddIcon from '@mui/icons-material/Add';
// import IconButton from '@mui/material/IconButton';
import { useLocation } from 'react-router-dom'
// import AuthContext from '../auth'
// import { useHistory } from 'react-router-dom'

/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
*/
function Statusbar() {
    const { store } = useContext(GlobalStoreContext);
    // const { auth } = useContext(AuthContext);
    // const history = useHistory();
    const location = useLocation();

    // function handleCreateNewList() {
    //     store.createNewList();
    // }
    let text = "";

    if (
        location.pathname === "/map" ||
        // auth.type !== "guest" &&
        location.pathname === "/mapview"
    ) {
        text = <div id="map-statusbar">
            <Typography>
                {/* <IconButton onClick={() => handleCreateNewList()}>
                    <AddIcon style={{ fontSize: "30pt", color: "black" }} />
                </IconButton> */}
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