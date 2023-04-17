import { createContext, useContext, useState } from 'react'
import { Outlet } from 'react-router-dom'
import AuthContext from '../auth'
import api from './store-request-api'
import jsTPS from '../common/jsTPS'
import EditVertex_Transaction from '../transactions/EditVertex_Transaction'
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
    SET_FILTER_SEARCH: "SET_FILTER_SEARCH",
    DUPLICATE_MAP: "DUPLICATE_MAP",
    EDIT_MAP_VERTEX: "EDIT_MAP_VERTEX"
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
        uploadType: "",
        currentMap: null,
        openComment: false,
        mapIdMarkedForDeletion: null,
        mapMarkedForDeletion: null,
        mapMarkedForExport: null,
        search: "",
        filterSearch: "",
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
                    uploadType: payload.type,
                    currentMap: store.currentMap,
                    openComment: false,
                    mapIdMarkedForDeletion: null,
                    mapMarkedForDeletion: null,
                    mapMarkedForExport: null,
                    search: store.search,
                    filterSearch: store.filterSearch,
                });
            }
            case GlobalStoreActionType.DUPLICATE_MAP: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    uploadType: "",
                    currentMap: payload.newMap,
                    openComment: false,
                    mapIdMarkedForDeletion: null,
                    mapMarkedForDeletion: null,
                    mapMarkedForExport: null,
                    search: store.search,
                    filterSearch: store.filterSearch,
                });
            }
            case GlobalStoreActionType.HIDE_MODAL: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    uploadType: "",
                    currentMap: store.currentMap,
                    openComment: false,
                    mapIdMarkedForDeletion: null,
                    mapMarkedForDeletion: null,
                    mapMarkedForExport: null,
                    search: store.search,
                    filterSearch: store.filterSearch,
                });
            }
            case GlobalStoreActionType.SET_CURRENT_MAP: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    uploadType: "",
                    currentMap: payload.currentMap,
                    openComment: store.openComment,
                    mapIdMarkedForDeletion: null,
                    mapMarkedForDeletion: null,
                    mapMarkedForExport: null,
                    search: store.search,
                    filterSearch: store.filterSearch,
                });
            }
            case GlobalStoreActionType.OPEN_COMMENT: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    uploadType: "",
                    currentMap: payload.currentMap,
                    openComment: true,
                    mapIdMarkedForDeletion: null,
                    mapMarkedForDeletion: null,
                    mapMarkedForExport: null,
                    search: store.search,
                    filterSearch: store.filterSearch,
                });
            }
            case GlobalStoreActionType.CLOSE_COMMENT: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    uploadType: "",
                    currentMap: payload.currentMap,
                    openComment: false,
                    mapIdMarkedForDeletion: null,
                    mapMarkedForDeletion: null,
                    mapMarkedForExport: null,
                    search: store.search,
                    filterSearch: store.filterSearch,
                });
            }
            case GlobalStoreActionType.MARK_MAP_FOR_DELETION: {
                return setStore({
                    currentModal: CurrentModal.MARK_MAP_FOR_DELETION,
                    idNamePairs: store.idNamePairs,
                    uploadType: "",
                    currentMap: null,
                    openComment: false,
                    mapIdMarkedForDeletion: payload.id,
                    mapMarkedForDeletion: payload.map,
                    mapMarkedForExport: null,
                    search: store.search,
                    filterSearch: store.filterSearch,
                });
            }
            case GlobalStoreActionType.MARK_MAP_FOR_EXPORT: {
                return setStore({
                    currentModal: CurrentModal.EXPORT_MAP,
                    idNamePairs: store.idNamePairs,
                    uploadType: "",
                    currentMap: null,
                    openComment: false,
                    mapIdMarkedForDeletion: null,
                    mapMarkedForDeletion: null,
                    mapMarkedForExport: payload.map,
                    search: store.search,
                    filterSearch: store.filterSearch,
                });
            }
            // GET ALL LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                console.log("LOAD_ID_NAME_PAIRES");
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: payload,
                    uploadType: "",
                    currentMap: null,
                    openComment: false,
                    mapMarkedForDeletion: null,
                    mapMarkedForExport: null,
                    search: store.search,
                    filterSearch: store.filterSearch,
                });
            }

            case GlobalStoreActionType.EDIT_MAP: {
                // console.log("EDIT_MAP");
                return setStore({
                    currentModal: CurrentModal.EDIT_MAP,
                    idNamePairs: store.idNamePairs,
                    uploadType: "",
                    currentMap: payload.currentMap,
                    openComment: false,
                    mapMarkedForDeletion: null,
                    mapMarkedForExport: null,
                    search: store.search,
                    filterSearch: store.filterSearch,

                });
            }
            case GlobalStoreActionType.CHANGE_MAP_NAME: {
                console.log("CHANGE_MAP_NAME")
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    uploadType: "",
                    currentMap: null,
                    openComment: false,
                    mapMarkedForDeletion: null,
                    mapMarkedForExport: null,
                    search: store.search,
                    filterSearch: store.filterSearch,

                });
            }
            case GlobalStoreActionType.SET_SEARCH: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    uploadType: "",
                    currentMap: store.currentMap,
                    openComment: false,
                    mapMarkedForDeletion: null,
                    mapMarkedForExport: null,
                    search: payload,
                    filterSearch: store.filterSearch,
                });
            }
            case GlobalStoreActionType.SET_FILTER_SEARCH: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    uploadType: "",
                    currentMap: store.currentMap,
                    openComment: false,
                    mapMarkedForDeletion: null,
                    mapMarkedForExport: null,
                    search: "",
                    filterSearch: payload,
                });
            }
            case GlobalStoreActionType.NAVIGATE_HOME: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    uploadType: "",
                    currentMap: payload.currentMap,
                    openComment: false,
                    mapMarkedForDeletion: null,
                    mapMarkedForExport: null,
                    search: "",
                    filterSearch: "",
                });
            }
            case GlobalStoreActionType.EDIT_MAP_VERTEX: {
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
                    search: store.search,
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
        // let newMapName = "Untitled" + store.idNamePairs.length;
        let newMapName = "Untitled";
        let payload = {
            name: newMapName,
            ownerEmail: auth.user.email,
            owner: auth.user.firstName + " " + auth.user.lastName,
            // dataFromMap: JSON.stringify(obj),
            dataFromMap: obj,
            comments: [],
            likes: [],
            dislikes: [],
            publish: { isPublished: false, publishedDate: new Date() },
            image: "temp"
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

    store.navigateHome = function (obj) {
        storeReducer({
            type: GlobalStoreActionType.NAVIGATE_HOME,
            payload: { currentMap: null }
        })
        navigate("/home");
        tps.clearAllTransactions();
    }

    store.navigatePublic = function (obj) {
        storeReducer({
            type: GlobalStoreActionType.NAVIGATE_HOME,
            payload: { currentMap: null }
        })
        navigate("/public");
        tps.clearAllTransactions();
    }

    store.navigateSearch = async function (obj) {
        storeReducer({
            type: GlobalStoreActionType.NAVIGATE_HOME,
            payload: { currentMap: null }
        })
        navigate("/search");
        tps.clearAllTransactions();
    }

    store.setSearch = function (search) {
        console.log("setSearch is ", search);
        storeReducer({
            type: GlobalStoreActionType.SET_SEARCH,
            payload: search,
        });
        console.log("store.search is ", store.search);
        console.log(store.filterSearch);
    }

    store.clearSearch = function () {
        console.log("store.clearSearch");
        console.log("search is ", store.search);

        storeReducer({
            type: GlobalStoreActionType.SET_SEARCH,
            payload: "",
        });
        console.log("search is ", store.search);
    }

    store.setFilterSearch = function (searchType) {
        console.log("store.setFilterSearch");
        console.log(searchType);
        storeReducer({
            type: GlobalStoreActionType.SET_FILTER_SEARCH,
            payload: searchType,
        });
    }

    store.filterBySearch = function () {
        let screenList = [];
        if(store.idNamePairs){
            if (store.filterSearch === "mapname" && store.search !== "") {
                console.log("1");
                console.log(store.search);
                screenList = store.idNamePairs.filter(pair => {
                    const mapName = pair.map.name.toLowerCase();
                    return store.search !== "" && mapName.includes(store.search.toLowerCase()) && pair.map.publish.isPublished;
                });
            } else if (store.filterSearch === "users" && store.search !== "") {
                console.log("2");
                console.log(store.search);
                screenList = store.idNamePairs.filter(pair => {
                    const ownerName = pair.map.owner.toLowerCase();
                    return store.search !== "" && ownerName === store.search.toLowerCase() && pair.map.publish.isPublished;
                });
            } else {
                console.log("3");
                console.log(store.search);
                console.log(store.filterSearch);
                console.log(store.idNamePairs);
                screenList = store.idNamePairs.filter(pair => {
                    const mapName = pair.map.name.toLowerCase();
                    return (store.search === "" && pair.map.publish.isPublished) ||
                        (store.search !== "" && mapName.startsWith(store.search.toLowerCase()) && pair.map.publish.isPublished);
                });
            }
        }
        
        console.log("searched")
        return screenList;
    };

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
                async function asyncCreateMap() {
                    let payload = {
                        name: newMapName,
                        ownerEmail: auth.user.email,
                        owner: auth.user.firstName + " " + auth.user.lastName,
                        dataFromMap: map.dataFromMap,
                        comments: [],
                        likes: [],
                        dislikes: [],
                        publish: { isPublished: false, publishedDate: new Date() },
                        image: map.image
                    };
                    const response = await api.createMap(payload);
                    // console.log("createNewList response: " + response);
                    if (response.status === 201) {
                        tps.clearAllTransactions();
                        let newMap = response.data.map;
                        console.log("store.duplicateMap");
                        storeReducer({
                            type: GlobalStoreActionType.DUPLICATE_MAP,
                            payload: newMap
                        }
                        );

                        // IF IT'S A VALID LIST THEN LET'S START EDITING IT
                        // history.push("/home/playlist/" + newList._id);
                        store.loadIdNamePairs();
                        // navigate("/map/" + store.currentMap._id)
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
    }

    store.markMapForExport = function (map) {
        storeReducer({
            type: GlobalStoreActionType.MARK_MAP_FOR_EXPORT,
            payload: { map: map }
        });
    }

    //this function will be called from Map.js
    store.editCurrentMapVertex = function (key, newFeature, oldFeature) {
        this.addEditVertexTransaction(key, newFeature, oldFeature);
    }

    //this function will be called to add the edit into the transaction stack
    store.addEditVertexTransaction = (key, newFeature, oldFeature) => {
        let transaction = new EditVertex_Transaction(store, key, newFeature, oldFeature);
        tps.addTransaction(transaction);
    }

    //this function will be called by the editvertex_transaction file to finally preform the functionality
    store.editVertex = function (key, editedFeature) {
        
        store.currentMap.dataFromMap.features.forEach((feature) => {
            if(key.includes('-')){ //if a '-' is included, this means its a multipolygon -3- 
                const parts = key.split("-"); //parts = ["CountryName", "index_location_of_multipolygon"]
                if(feature.properties.admin === parts[0]){ //if the country name matches the custom key, this is the feature we are editing
                  for(let i = 0; i < feature.geometry.coordinates.length; i++) { //loop thru the feature's coordinates until we find the correct polygon in the array of the multipolygon's coordinates
                    if(i === parseInt(parts[1])){ //see if the index of the feature is equal to "index_location_of_multipolygon"
                      feature.geometry.coordinates[i] = editedFeature.geometry.coordinates //set the entire array of new coordinates to the original feature's coordinates so now its fully updated for the specific polygon in the MultiPolygon
                    }
                  }        
                }
              } else { //if NO '-' than this means its a Polygon: key="CountryName"
                if(feature.properties.admin === key){ //if the country name matches the custom key, this is the feature we are editing
                  console.log("Edited Feature Coordinates Below")
                  console.log(editedFeature.geometry.coordinates)
                  console.log("Current Feature Coordinates Below")
                  console.log(feature.geometry.coordinates)
                    feature.geometry.coordinates = editedFeature.geometry.coordinates //set the entire array of new coordinates to the original feature's coordinates so now its fully updated for the one Polygon       
                }
              }
        });

        //in the end we re-render by using storeReducer
        storeReducer({
            type: GlobalStoreActionType.EDIT_MAP_VERTEX,
            payload: { currentMap: store.currentMap }
        });
    }


    //undo and redo transaction
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }

    //CURRENT MAP VERTEX EDITING:
    // store.editMapVertex = function (editedMap) {
    //     storeReducer({
    //         type: GlobalStoreActionType.EDIT_MAP_VERTEX,
    //         payload: { currentMap: editedMap }
    //     });
    // }



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