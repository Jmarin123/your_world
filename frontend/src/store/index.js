import { createContext, useContext, useState } from 'react'
import { Outlet } from 'react-router-dom'
import AuthContext from '../auth'
import api from './store-request-api'
import jsTPS from '../common/jsTPS'
//useContext
// import { useHistory } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

export const GlobalStoreContext = createContext({});
console.log("Creating GlobalStoreContext")

export const GlobalStoreActionType = {
    CHANGE_MAP_NAME: "CHANGE_MAP_NAME",
    CLOSE_CURRENT_MAP: "CLOSE_CURRENT_MAP",
    CREATE_NEW_MAP: "CREATE_NEW_MAP",
    LOAD_MAPS: "LOAD_MAPS",
    MARK_MAP_FOR_DELETION: "MARK_MAP_FOR_DELETION",
    UNMARK_MAP_FOR_DELETION: "UNMARK_MAP_FOR_DELETION",
    SET_CURRENT_MAP: "SET_CURRENT_MAP",
    SET_MAP_NAME_EDIT_ACTIVE: "SET_MAP_NAME_EDIT_ACTIVE",
    EDIT_MAP: "EDIT_MAP",
    HIDE_MODAL: "HIDE_MODAL",
    REMOVE_SUBREGION: "REMOVE_SUBREGION",
    RENAME_SUBREGION: "RENAME_SUBREGION",
    SET_SEARCH: "SET_SEARCH",
    SET_SORT: "SET_SORT",
    UPLOAD_FILE: "UPLOAD_FILE",
    OPEN_COMMENT: "OPEN_COMMENT",
    CLOSE_COMMENT: "CLOSE_COMMENT",
    MARK_MAP_FOR_EXPORT: "MARK_MAP_FOR_EXPORT",
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

export const CurrentModal = {
    NONE: "NONE",
    DELETE_MAP: "DELETE_MAP",
    EDIT_MAP: "EDIT_MAP",
    RENAME_SUBREGION: "RENAME_SUBREGION",
    UPLOAD_FILE: "UPLOAD_FILE",
    EXPORT_MAP: "EXPORT_MAP"
}

function GlobalStoreContextProvider(props) {
    const navigate = useNavigate();

    const [store, setStore] = useState({
        currentModal: CurrentModal.NONE,
        idNamePairs: [],
        newMapCounter: 0,
        uploadType: "",
        currentMap: null,
        openComment: false,
        mapIdMarkedForDeletion: null,
        mapMarkedForDeletion: null,
        mapMarkedForExport: null,
    });
    // const history = useHistory();

    const { auth } = useContext(AuthContext);
    // console.log("auth: " + auth);
    // console.log("idnamepair: ", idNamePairs);
    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CREATE_NEW_MAP: {
                return setStore({
                    currentModal: CurrentModal.UPLOAD_FILE,
                    idNamePairs: store.idNamePairs,
                    newMapCounter: store.newListCounter,
                    uploadType: payload.type,
                    currentMap: store.currentMap,
                    openComment: false,
                    mapIdMarkedForDeletion: null,
                    mapMarkedForDeletion: null,
                    mapMarkedForExport: null,
                });
            }
            case GlobalStoreActionType.HIDE_MODAL: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    newMapCounter: store.newListCounter,
                    uploadType: "",
                    currentMap: store.currentMap,
                    openComment: false,
                    mapIdMarkedForDeletion: null,
                    mapMarkedForDeletion: null,
                    mapMarkedForExport: null,
                });
            }
            case GlobalStoreActionType.SET_CURRENT_MAP: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    newMapCounter: store.newListCounter,
                    uploadType: "",
                    currentMap: payload.currentMap,
                    openComment: false,
                    mapIdMarkedForDeletion: null,
                    mapMarkedForDeletion: null,
                    mapMarkedForExport: null,
                });
            }
            case GlobalStoreActionType.OPEN_COMMENT: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    newMapCounter: store.newListCounter,
                    uploadType: "",
                    currentMap: payload.currentMap,
                    openComment: true,
                    mapIdMarkedForDeletion: null,
                    mapMarkedForDeletion: null,
                    mapMarkedForExport: null,
                });
            }
            case GlobalStoreActionType.CLOSE_COMMENT: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    newMapCounter: store.newListCounter,
                    uploadType: "",
                    currentMap: payload.currentMap,
                    openComment: false,
                    mapIdMarkedForDeletion: null,
                    mapMarkedForDeletion: null,
                    mapMarkedForExport: null,
                });
            }
            case GlobalStoreActionType.MARK_MAP_FOR_DELETION: {
                return setStore({
                    currentModal: CurrentModal.MARK_MAP_FOR_DELETION,
                    idNamePairs: store.idNamePairs,
                    newMapCounter: store.newListCounter,
                    uploadType: "",
                    currentMap: null,
                    openComment: false,
                    mapIdMarkedForDeletion: payload.id,
                    mapMarkedForDeletion: payload.map,
                    mapMarkedForExport: null,
                });
            }
            case GlobalStoreActionType.MARK_MAP_FOR_EXPORT: {
                return setStore({
                    currentModal: CurrentModal.EXPORT_MAP,
                    idNamePairs: store.idNamePairs,
                    newMapCounter: store.newListCounter,
                    uploadType: "",
                    currentMap: null,
                    openComment: false,
                    mapIdMarkedForDeletion: null,
                    mapMarkedForDeletion: null,
                    mapMarkedForExport: payload.map,
                });
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                console.log("LOAD_ID_NAME_PAIRES");
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: payload,
                    newMapCounter: store.newListCounter,
                    uploadType: "",
                    currentMap: null,
                    openComment: false,
                    mapMarkedForDeletion: null,
                    mapMarkedForExport: null,
                });
            }
            default:
                return store;
        }
    }

    store.showUpload = function (uploadType) {
        storeReducer({
            type: GlobalStoreActionType.CREATE_NEW_MAP,
            payload: {
                type: uploadType
            }
        });
    }

    store.hideModals = function () {
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODAL,
            payload: {
                type: GlobalStoreActionType.HIDE_MODAL
            }
        });
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getMapPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                console.log("store.loadIdNamePairs");
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
        tps.clearAllTransactions();
    }

    store.createNewMap = async function (obj) {
        let newMapName = "Untitled" + store.idNamePairs.length;
        // let newMapName = "Untitled";
        let payload = {
            name: newMapName,
            mapCounter: store.newMapCounter + 1,
            ownerEmail: auth.user.email,
            owner: auth.user.firstName + " " + auth.user.lastName,
            dataFromMap: JSON.stringify(obj),
            comments: [],
            likes: [],
            dislikes: [],
            publish: { isPublished: false, publishedDate: new Date() }
        };
        const response = await api.createMap(payload);
        // console.log("createNewList response: " + response);
        if (response.status === 201) {
            tps.clearAllTransactions();
            let newMap = response.data.map;

            console.log(newMap._id)

            // console.log("store.createNewMap.  newmap: ", newMap);
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_MAP,
                payload: { currentMap: newMap }
                // payload: { newListCounter: newList.listCounter, playlist: newList }
            }
            );
            navigate("/map/" + newMap._id);


        }
        else {
            console.log("API FAILED TO CREATE A NEW MAP");
        }
    }

    //TODO: Remove later
    store.navToMap = async function (obj) {
        navigate("/map");
    }

    //TODO: Remove later
    store.navToPubMap = async function (obj) {
        navigate("/mapview");
    }

    store.updateCurrentMap = function () {
        // async function asyncUpdateCurrentList() {
        //     const response = await api.updatePlaylistById(store.currentList._id, store.currentList);
        //     if (response.data.success) {
        //         console.log("store.updateCurrentList");
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_MAP,
            payload: { currentMap: store.currentMap, counter: store.newListCounter }
        });

        //     }
        // }
        // asyncUpdateCurrentList();

    }

    store.setCurrentMap = function (newMap) {
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_MAP,
            payload: { currentMap: newMap }
        });
    }

    store.openCommentView = function () {
        storeReducer({
            type: GlobalStoreActionType.OPEN_COMMENT,
            payload: { currentMap: store.currentMap, counter: store.newListCounter, }
        });
    }

    store.closeComment = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_COMMENT,
            payload: { currentMap: store.currentMap, counter: store.newListCounter, }
        });
    }

    store.markMapForDeletion = function (id) {
        console.log(id);
        async function getMapToDelete(id) {
            let response = await api.getMapById(id);
            if (response.data.success) {
                let map = response.data.map;
                storeReducer({
                    type: GlobalStoreActionType.MARK_MAP_FOR_DELETION,
                    payload: { id: id, map: map }
                });
            }
        }
        getMapToDelete(id);
    }

    store.deleteMap = function (id) {
        async function processDelete(id) {
            await api.deleteMapById(id);
            console.log("store.deleteList");
            store.loadIdNamePairs();
            navigate("/home");
        }
        processDelete(id);
    }
    store.deleteMarkedMap = function () {
        store.deleteMap(store.mapIdMarkedForDeletion);
    }

    store.duplicateMap = function (map) {
        // storeReducer({
        //     type: GlobalStoreActionType.MARK_MAP_FOR_DELETION,
        //     payload: { map: map }
        // });
        navigate("/home")
    }

    store.markMapForExport = function (map) {
        storeReducer({
            type: GlobalStoreActionType.MARK_MAP_FOR_EXPORT,
            payload: { map: map }
        });
    }


    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
            <Outlet />
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };