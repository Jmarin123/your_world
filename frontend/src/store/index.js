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
                    openComment: store.openComment,
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
            // GET ALL LISTS SO WE CAN PRESENT THEM
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

            case GlobalStoreActionType.EDIT_MAP: {
                // console.log("EDIT_MAP");
                return setStore({
                    currentModal: CurrentModal.EDIT_MAP,
                    idNamePairs: store.idNamePairs,
                    newMapCounter: store.newListCounter,
                    uploadType: "",
                    currentMap: payload.currentMap,
                    openComment: false,
                    mapMarkedForDeletion: null,
                    mapMarkedForExport: null,

                });
            }
            case GlobalStoreActionType.CHANGE_MAP_NAME: {
                console.log("CHANGE_MAP_NAME")
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
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

    store.showRenameModal = (mapToEdit) => {
        storeReducer({
            type: GlobalStoreActionType.EDIT_MAP,
            payload: { currentMap: mapToEdit }
        });
    }
    store.isRenameModalOpen = () => {
        return store.currentModal === CurrentModal.EDIT_MAP;
    }
    store.changeMapName = function (newName) {
        // GET THE LIST
        let id = store.currentMap._id;
        console.log(id);
        async function asyncChangeMapName(id) {
            let flag = 0;
            // for (let i = 0; i < store.idNamePairs.length; i++) {
            //     if (store.idNamePairs[i].name.toLowerCase() == newName.toLowerCase()) {
            //         console.log("same name");
            //         flag = 1;
            //         storeReducer({
            //             type: GlobalStoreActionType.SAME_NAME,
            //             payload: {}
            //         });
            //     }
            // }
            if (!flag) {
                let response = await api.getMapById(id);
                if (response.data.success) {
                    let map = response.data.map;
                    map.name = newName;
                    async function updateMap(map) {

                        response = await api.updateMapById(map._id, map);
                        console.log(map._id);
                        if (response.data.success) {
                            async function getMapPairs(map) {
                                response = await api.getMapPairs();
                                if (response.data.success) {
                                    let pairsArray = response.data.idNamePairs;
                                    console.log("store.changeMapName");
                                    storeReducer({
                                        type: GlobalStoreActionType.CHANGE_MAP_NAME,
                                        payload: {
                                            idNamePairs: pairsArray,
                                        }
                                    });

                                }

                            }
                            getMapPairs(map);

                        }
                    }
                    updateMap(map);
                }
            }

        }
        asyncChangeMapName(id);
    }

    // Update new list 
    store.updateMap = function (map) {
        async function asyncUpdateMap() {
            const response = await api.updateMapById(map._id, map);
            if (response.data.success) {
                console.log("store.updateMap");
                const response = await api.getMapPairs();
                if (response.data.success) {
                    let pairsArray = response.data.idNamePairs;
                    storeReducer({
                        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                        payload: pairsArray
                    });
                }
                else {
                    console.log("API FAILED TO GET THE MAP PAIRS");
                }

            }
        }
        asyncUpdateMap();
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

    // THIS FUNCTION LOAD ALL THE MAPS WITHOUT VERIFY
    store.loadAllMaps = async function () {
        console.log("store.loadMaps");
        try {
            const response = await api.getAllMaps();

            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                console.log(pairsArray);
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
        }
        catch (err) {
            storeReducer({
                type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                payload: []
            });
        }
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

    // store.updateCurrentMap = function () {
    //     // async function asyncUpdateCurrentList() {
    //     //     const response = await api.updatePlaylistById(store.currentList._id, store.currentList);
    //     //     if (response.data.success) {
    //     //         console.log("store.updateCurrentList");
    //     storeReducer({
    //         type: GlobalStoreActionType.SET_CURRENT_MAP,
    //         payload: { currentMap: store.currentMap, counter: store.newListCounter }
    //     });

    //     //     }
    //     // }
    //     // asyncUpdateCurrentList();

    // }
    store.updateCurrentMap = function () {
        async function asyncUpdateCurrentMap() {
            const response = await api.updateMapById(store.currentMap._id, store.currentMap);
            if (response.data.success) {
                console.log("store.updateCurrentMap");
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_MAP,
                    payload: {
                        currentMap: store.currentMap
                    }
                });

            }
        }
        asyncUpdateCurrentMap();

    }

    store.setCurrentMap = function (newMap) {
        console.log(newMap);
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
        async function asyncLoadIdNamePairs() {
            let response = await api.getMapPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                console.log("store.loadIdNamePairs, THE user' pairsArray = ", pairsArray);
                let newMapName = map.name;
                for (let i = 0; i < pairsArray.length; i++) {
                    console.log(pairsArray[i].name);
                    console.log(newMapName);
                    if (pairsArray[i].name === newMapName) {
                        console.log("find the same");
                        newMapName = newMapName + pairsArray.length;
                        console.log("newMapName = ", newMapName);
                        break;
                    }
                }
                async function asyncCreateMap() {
                    let payload = {
                        name: newMapName,
                        ownerEmail: auth.user.email,
                        owner: auth.user.firstName + " " + auth.user.lastName,
                        dataFromMap: map.dataFromMap,
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
                        console.log("store.duplicateMap");
                        storeReducer({
                            type: GlobalStoreActionType.CREATE_NEW_MAP,
                            payload: newMap
                        }
                        );

                        // IF IT'S A VALID LIST THEN LET'S START EDITING IT
                        // history.push("/home/playlist/" + newList._id);
                        store.loadIdNamePairs();
                    }
                    else {
                        console.log("API FAILED TO CREATE A NEW MAP");
                    }
                }
                asyncCreateMap();
            }
            else {
                console.log("API FAILED TO GET THE MAP PAIRS");
            }
        }
        asyncLoadIdNamePairs();
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