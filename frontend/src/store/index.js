import { useNavigate } from 'react-router-dom'

import { createContext, useContext, useState } from 'react'
import { Outlet } from 'react-router-dom'

import AuthContext from '../auth'

import api from './store-request-api'
import jsTPS from '../common/jsTPS'

import EditVertex_Transaction from '../transactions/EditVertex_Transaction'

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
    MARK_SUBREGION_FOR_RENAME: "MARK_SUBREGION_FOR_RENAME",
    SET_SEARCH: "SET_SEARCH",
    SET_SORT: "SET_SORT",
    UPLOAD_FILE: "UPLOAD_FILE",
    OPEN_COMMENT: "OPEN_COMMENT",
    CLOSE_COMMENT: "CLOSE_COMMENT",
    MARK_MAP_FOR_EXPORT: "MARK_MAP_FOR_EXPORT",
    SET_FILTER_SEARCH: "SET_FILTER_SEARCH",
    DUPLICATE_MAP: "DUPLICATE_MAP",
    EDIT_MAP_VERTEX: "EDIT_MAP_VERTEX",
    NAVIGATE_PUBLIC: "NAVIGATE_PUBLIC",
}

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
        subregion: null,
        // publicPagePairs: [],
    });

    const { auth } = useContext(AuthContext);

    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
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
                    subregion: null,
                    // publicPagePairs: store.publicPagePairs,
                });
            }
            case GlobalStoreActionType.DUPLICATE_MAP: {
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
                    subregion: null,
                    // publicPagePairs: [],
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
                    subregion: null,
                    // publicPagePairs: store.publicPagePairs,
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
                    subregion: null,
                    // publicPagePairs: store.publicPagePairs,
                });
            }
            case GlobalStoreActionType.OPEN_COMMENT: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    uploadType: "",
                    currentMap: payload.currentMap,
                    openComment: payload.toggle,
                    mapIdMarkedForDeletion: null,
                    mapMarkedForDeletion: null,
                    mapMarkedForExport: null,
                    search: store.search,
                    filterSearch: store.filterSearch,
                    subregion: null,
                    // publicPagePairs: [],
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
                    subregion: null,
                    // publicPagePairs: [],
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
                    subregion: null,
                    // publicPagePairs: [],
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
                    subregion: null,
                    // publicPagePairs: [],
                });
            }
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                console.log("LOAD_ID_NAME_PAIRS");
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
                    subregion: null,
                    // publicPagePairs: [],
                });
            }

            case GlobalStoreActionType.EDIT_MAP: {
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
                    subregion: null,
                    // publicPagePairs: [],
                });
            }
            case GlobalStoreActionType.CHANGE_MAP_NAME: {
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
                    subregion: null,
                    // publicPagePairs: [],
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
                    subregion: null,
                    // publicPagePairs: [],
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
                    subregion: null,
                    // publicPagePairs: [],
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
                    subregion: null,
                    // publicPagePairs: [],
                });
            }
            // case GlobalStoreActionType.NAVIGATE_PUBLIC: {
            //     return setStore({
            //         currentModal: CurrentModal.NONE,
            //         idNamePairs: store.idNamePairs,
            //         uploadType: "",
            //         currentMap: payload.currentMap,
            //         openComment: false,
            //         mapMarkedForDeletion: null,
            //         mapMarkedForExport: null,
            //         search: "",
            //         filterSearch: "",
            //         subregion: null,
            //         // publicPagePairs: payload.screenList,
            //     });
            // }
            case GlobalStoreActionType.EDIT_MAP_VERTEX: {
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
                    subregion: null,
                    // publicPagePairs: [],
                });
            }
            case GlobalStoreActionType.MARK_SUBREGION_FOR_RENAME: {
                return setStore({
                    currentModal: CurrentModal.RENAME_SUBREGION,
                    idNamePairs: store.idNamePairs,
                    uploadType: "",
                    currentMap: store.currentMap,
                    openComment: store.openComment,
                    mapIdMarkedForDeletion: null,
                    mapMarkedForDeletion: null,
                    mapMarkedForExport: null,
                    search: store.search,
                    filterSearch: store.filterSearch,
                    subregion: payload.feature,
                    // publicPagePairs: [],
                });
            }
            case GlobalStoreActionType.RENAME_SUBREGION: {
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
                    subregion: null,
                    // publicPagePairs: [],
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

    store.updateMap = async function (map) {
        const response = await api.updateMapById(map._id, map);
        if (response.data.success) {
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
                console.log(store.idNamePairs);
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
        // tps.clearAllTransactions();
    }

    // THIS FUNCTION LOAD ALL THE MAPS WITHOUT VERIFY
    store.loadAllMaps = async function () {
        console.log("store.loadAllMaps");
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
        let newMapName = "Untitled";
        let payload = {
            name: newMapName,
            ownerEmail: auth.user.email,
            owner: auth.user.firstName + " " + auth.user.lastName,
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

            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_MAP,
                payload: { currentMap: newMap }
            });
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

    // store.navigatePublic = function (obj) {
    //     async function asyncLoadIdNamePairs() {
    //         const response = await api.getAllMaps();
    //         if (response.data.success) {
    //             let pairsArray = response.data.idNamePairs;

    //             let screenList = []
    //             screenList = pairsArray.filter(pair => {
    //                 return pair.map.publish.isPublished;
    //             });

    //             storeReducer({
    //                 type: GlobalStoreActionType.NAVIGATE_PUBLIC,
    //                 payload: { screenList: screenList }
    //             });
    //         }
    //         else {
    //             console.log("navigatePublic - could not get list pairs");
    //         }
    //     }
    //     asyncLoadIdNamePairs();
    //     tps.clearAllTransactions();
    //     navigate("/public");
    // }

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
            screenList = store.idNamePairs.filter(pair => {
                const mapName = pair.map.name.toLowerCase();
                return (store.search === "" && pair.map.publish.isPublished) ||
                    (store.search !== "" && mapName.startsWith(store.search.toLowerCase()) && pair.map.publish.isPublished);
            });
        }
        return screenList;
    };

    store.updateCurrentMap = async function () {
        const response = await api.updateMapById(store.currentMap._id, store.currentMap);
        if (response.data.success) {
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_MAP,
                payload: {
                    currentMap: store.currentMap
                }
            });
        }
    }

    store.setCurrentMap = function (newMap) {
        console.log(newMap);
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_MAP,
            payload: { currentMap: newMap }
        });
    }

    store.openCommentView = function () {
        const toggle = !store.openComment
        storeReducer({
            type: GlobalStoreActionType.OPEN_COMMENT,
            payload: { currentMap: store.currentMap, counter: store.newListCounter, toggle: toggle }
        });
    }

    store.closeComment = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_COMMENT,
            payload: { currentMap: store.currentMap, counter: store.newListCounter, }
        });
    }

    store.markMapForDeletion = async function (id) {
        console.log(id);
        let response = await api.getMapById(id);
        if (response.data.success) {
            let map = response.data.map;
            storeReducer({
                type: GlobalStoreActionType.MARK_MAP_FOR_DELETION,
                payload: { id: id, map: map }
            });
        }
    }

    store.changeSubregionName = function (newName) {
        for (let i = 0; i < store.currentMap.dataFromMap.features.length; i++) {
            if (store.currentMap.dataFromMap.features[i].properties.sovereignt === store.subregion.properties.sovereignt) {
                store.currentMap.dataFromMap.features[i].properties.sovereignt = newName
                // console.log("Found corresponding subregion name")
                break
            }
        }

        let id = store.currentMap._id;
        let newMap = store.currentMap;
        console.log(newMap)
        async function asyncChangeMapName(id, newMap) {
            let response = await api.updateMapById(id, newMap);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.RENAME_SUBREGION,
                    payload: {
                        currentMap: store.currentMap,
                    }
                });
            }
        }
        asyncChangeMapName(id, newMap);
    }

    store.deleteMap = async function (id) {
        await api.deleteMapById(id);
        console.log("store.deleteList");
        store.loadIdNamePairs();
        navigate("/home");
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

        if (key.includes('-')) { //if a '-' is included, this means its a multipolygon -3- 
            const parts = key.split("-"); //parts = ["CountryName", "index_location_of_multipolygon"]
            const index = parseInt(parts[0]);
            const index2 = parseInt(parts[1]);

            //store.currentMap.dataFromMap.features[index].geometry.coordinates[index2] == editedFeature.geometry.coordinates[i];

            if (editedFeature.geometry.coordinates.length > 1) {
                store.currentMap.dataFromMap.features[index].geometry.coordinates[index2] = editedFeature.geometry.coordinates[index2];
            } else {
                store.currentMap.dataFromMap.features[index].geometry.coordinates[index2] = editedFeature.geometry.coordinates;
            }

        } else { //if NO '-' than this means its a Polygon: key="CountryName"
            const index = parseInt(key);
            store.currentMap.dataFromMap.features[index].geometry.coordinates = editedFeature.geometry.coordinates;
        }






        // store.currentMap.dataFromMap.features.forEach((feature) => {
        //     if (key.includes('-')) { //if a '-' is included, this means its a multipolygon -3- 
        //         const parts = key.split("-"); //parts = ["CountryName", "index_location_of_multipolygon"]
        //         if (feature.properties.admin === parts[0]) { //if the country name matches the custom key, this is the feature we are editing
        //             for (let i = 0; i < feature.geometry.coordinates.length; i++) { //loop thru the feature's coordinates until we find the correct polygon in the array of the multipolygon's coordinates
        //                 if (i === parseInt(parts[1])) { //see if the index of the feature is equal to "index_location_of_multipolygon"
        //                     if(editedFeature.geometry.coordinates.length > 1) {
        //                         feature.geometry.coordinates[i] = editedFeature.geometry.coordinates[i] //set the entire array of new coordinates to the original feature's coordinates so now its fully updated for the specific polygon in the MultiPolygon
        //                     } else {
        //                         feature.geometry.coordinates[i] = editedFeature.geometry.coordinates
        //                     }
        //                 }
        //             }
        //         }
        //     } else { //if NO '-' than this means its a Polygon: key="CountryName"
        //         if (feature.properties.admin === key) { //if the country name matches the custom key, this is the feature we are editing
        //             feature.geometry.coordinates = editedFeature.geometry.coordinates //set the entire array of new coordinates to the original feature's coordinates so now its fully updated for the one Polygon       
        //         }
        //     }
        // });

        //in the end we re-render by using storeReducer
        storeReducer({
            type: GlobalStoreActionType.EDIT_MAP_VERTEX,
            payload: { currentMap: store.currentMap }
        });
    }



    store.markSubregion = function (feature) {
        storeReducer({
            type: GlobalStoreActionType.MARK_SUBREGION_FOR_RENAME,
            payload: { feature: feature }
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