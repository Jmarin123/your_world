import { useNavigate } from 'react-router-dom'

import { createContext, useContext, useState } from 'react'
import { Outlet } from 'react-router-dom'

import AuthContext from '../auth'

import api from './store-request-api'
import jsTPS from '../common/jsTPS'

import EditVertex_Transaction from '../transactions/EditVertex_Transaction'
import SplitRegion_Transaction from '../transactions/SplitRegion_Transaction'
import MergeRegion_Transaction from '../transactions/MergeRegion_Transaction'
import AddRegion_Transaction from '../transactions/AddRegion_Transaction'
import DeleteRegion_Transaction from '../transactions/DeleteRegion_Transaction'

import * as turf from '@turf/turf';

export const GlobalStoreContext = createContext({});

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
    PROPERTIES: "PROPERTIES",
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
    UPDATE_THUMBNAIL: "UPDATE_THUMBNAIL",
    MAP_EXPORT: "MAP_EXPORT",
    MARK_MAP_FOR_COMPRESSION: "MARK_MAP_FOR_COMPRESSION",
    MAP_COMPRESS: "MAP_COMPRESS",
    ADDED_REGION: "ADDED_REGION",
    REVERTED_REGION: "REVERTED_REGION",
    SAVE_MARKER: "SAVE_MARKER",
    SET_LEGEND_COLOR: "SET_LEGEND_COLOR",
    EXPORT_IMAGE: "EXPORT_IMAGE",
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

export const CurrentModal = {
    NONE: "NONE",
    DELETE_MAP: "DELETE_MAP",
    EDIT_MAP: "EDIT_MAP",
    RENAME_SUBREGION: "RENAME_SUBREGION",
    UPLOAD_FILE: "UPLOAD_FILE",
    EXPORT_MAP: "EXPORT_MAP",
    COMPRESS_MAP: "COMPRESS_MAP",
    PROPERTIES: "PROPERTIES"
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
        sort: "",
        filterSearch: "",
        subregion: null,
        thumbnail: false,
        exportMapData: null,
        isFirstUpload: false,
        compressStatus: false,
        addedRegion: false,
        legendColor: false,
        exportImage: false
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
                    subregion: null,
                    thumbnail: false,
                    sort: store.sort,
                    exportMapData: null,
                    isFirstUpload: false,
                    legendColor: false,
                    exportImage: false,
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
                    subregion: null,
                    thumbnail: false,
                    sort: store.sort,
                    exportMapData: null,
                    isFirstUpload: false,
                    legendColor: false,
                    exportImage: false,
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
                    thumbnail: false,
                    sort: store.sort,
                    exportMapData: null,
                    isFirstUpload: false,
                    legendColor: false,
                    exportImage: false,
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
                    thumbnail: false,
                    sort: store.sort,
                    exportMapData: null,
                    isFirstUpload: payload.firstUpload,
                    legendColor: false,
                    exportImage: false,

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
                    thumbnail: false,
                    sort: store.sort,
                    exportMapData: null,
                    isFirstUpload: false,
                    legendColor: false,
                    exportImage: false,
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
                    thumbnail: false,
                    sort: store.sort,
                    exportMapData: null,
                    isFirstUpload: false,
                    legendColor: false,
                    exportImage: false,

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
                    thumbnail: false,
                    sort: store.sort,
                    exportMapData: null,
                    isFirstUpload: false,
                    legendColor: false,
                    exportImage: false,

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
                    thumbnail: false,
                    sort: store.sort,
                    exportMapData: null,
                    isFirstUpload: false,
                    legendColor: false,
                    exportImage: false,

                });
            }

            case GlobalStoreActionType.MAP_EXPORT: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    uploadType: "",
                    currentMap: null,
                    openComment: false,
                    mapIdMarkedForDeletion: null,
                    mapMarkedForDeletion: null,
                    mapMarkedForExport: store.mapMarkedForExport,
                    search: store.search,
                    filterSearch: store.filterSearch,
                    subregion: null,
                    thumbnail: false,
                    sort: store.sort,
                    exportMapData: payload.mapData,
                    isFirstUpload: false,
                    legendColor: false,
                    exportImage: false,

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
                    subregion: null,
                    thumbnail: false,
                    sort: store.sort,
                    exportMapData: null,
                    isFirstUpload: false,
                    legendColor: false,
                    exportImage: false,

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
                    subregion: null,
                    thumbnail: false,
                    sort: store.sort,
                    exportMapData: null,
                    isFirstUpload: false,
                    legendColor: false,
                    exportImage: false,

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
                    subregion: null,
                    thumbnail: false,
                    sort: store.sort,
                    exportMapData: null,
                    isFirstUpload: false,
                    legendColor: false,
                    exportImage: false,

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
                    thumbnail: false,
                    sort: store.sort,
                    exportMapData: null,
                    isFirstUpload: false,
                    legendColor: false,
                    exportImage: false,

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
                    thumbnail: false,
                    sort: store.sort,
                    exportMapData: null,
                    isFirstUpload: false,
                    legendColor: false,
                    exportImage: false,

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
                    thumbnail: false,
                    sort: store.sort,
                    exportMapData: null,
                    isFirstUpload: false,
                    legendColor: false,
                    exportImage: false,

                });
            }
            case GlobalStoreActionType.NAVIGATE_PUBLIC: {
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
                    thumbnail: false,
                    sort: store.sort,
                    exportMapData: null,
                    isFirstUpload: false,
                    legendColor: false,
                    exportImage: false,
                });
            }
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
                    thumbnail: false,
                    sort: store.sort,
                    exportMapData: null,
                    isFirstUpload: false,
                    legendColor: false,
                    exportImage: false,

                });
            }
            case GlobalStoreActionType.ADDED_REGION: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    uploadType: "",
                    currentMap: store.currentMap,
                    openComment: store.openComment,
                    mapIdMarkedForDeletion: null,
                    mapMarkedForDeletion: null,
                    mapMarkedForExport: null,
                    search: store.search,
                    filterSearch: store.filterSearch,
                    subregion: null,
                    thumbnail: false,
                    sort: store.sort,
                    exportMapData: null,
                    isFirstUpload: false,
                    addedRegion: true,
                    legendColor: false,
                    exportImage: false,
                });
            }
            case GlobalStoreActionType.REVERTED_REGION: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    uploadType: "",
                    currentMap: store.currentMap,
                    openComment: store.openComment,
                    mapIdMarkedForDeletion: null,
                    mapMarkedForDeletion: null,
                    mapMarkedForExport: null,
                    search: store.search,
                    filterSearch: store.filterSearch,
                    subregion: null,
                    thumbnail: false,
                    sort: store.sort,
                    exportMapData: null,
                    isFirstUpload: false,
                    addedRegion: false,
                    legendColor: false,
                    exportImage: false,
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
                    thumbnail: false,
                    sort: store.sort,
                    exportMapData: null,
                    isFirstUpload: false,
                    legendColor: false,
                    exportImage: false,

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
                    thumbnail: false,
                    sort: store.sort,
                    exportMapData: null,
                    isFirstUpload: false,
                    legendColor: false,
                    exportImage: false,

                });
            }
            case GlobalStoreActionType.UPDATE_THUMBNAIL: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    uploadType: "",
                    currentMap: store.currentMap,
                    openComment: store.openComment,
                    mapIdMarkedForDeletion: null,
                    mapMarkedForDeletion: null,
                    mapMarkedForExport: null,
                    search: store.search,
                    filterSearch: store.filterSearch,
                    subregion: null,
                    thumbnail: payload.thumbnail,
                    sort: store.sort,
                    exportMapData: null,
                    isFirstUpload: false,
                    legendColor: false,
                    exportImage: false,
                });
            }
            case GlobalStoreActionType.SET_SORT: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    uploadType: "",
                    currentMap: store.currentMap,
                    openComment: store.openComment,
                    mapIdMarkedForDeletion: null,
                    mapMarkedForDeletion: null,
                    mapMarkedForExport: null,
                    search: store.search,
                    filterSearch: store.filterSearch,
                    subregion: null,
                    thumbnail: false,
                    sort: payload,
                    exportMapData: null,
                    isFirstUpload: false,
                    legendColor: false,
                    exportImage: false,
                });
            }
            case GlobalStoreActionType.MARK_MAP_FOR_COMPRESSION: {
                return setStore({
                    currentModal: CurrentModal.COMPRESS_MAP,
                    idNamePairs: store.idNamePairs,
                    uploadType: "",
                    currentMap: store.currentMap,
                    openComment: store.openComment,
                    mapIdMarkedForDeletion: null,
                    mapMarkedForDeletion: null,
                    mapMarkedForExport: null,
                    search: store.search,
                    filterSearch: store.filterSearch,
                    subregion: null,
                    thumbnail: false,
                    sort: store.sort,
                    exportMapData: null,
                    isFirstUpload: false,
                    legendColor: false,
                    exportImage: false,
                });
            }
            case GlobalStoreActionType.PROPERTIES: {
                return setStore({
                    currentModal: CurrentModal.PROPERTIES,
                    idNamePairs: store.idNamePairs,
                    uploadType: "",
                    currentMap: store.currentMap,
                    openComment: store.openComment,
                    mapIdMarkedForDeletion: null,
                    mapMarkedForDeletion: null,
                    mapMarkedForExport: null,
                    search: store.search,
                    filterSearch: store.filterSearch,
                    subregion: null,
                    thumbnail: false,
                    sort: store.sort,
                    exportMapData: null,
                    isFirstUpload: false
                });
            }
            case GlobalStoreActionType.MAP_COMPRESS: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    uploadType: "",
                    currentMap: store.currentMap,
                    openComment: store.openComment,
                    mapIdMarkedForDeletion: null,
                    mapMarkedForDeletion: null,
                    mapMarkedForExport: null,
                    search: store.search,
                    filterSearch: store.filterSearch,
                    subregion: null,
                    thumbnail: false,
                    sort: store.sort,
                    exportMapData: null,
                    isFirstUpload: false,
                    compressStatus: true,
                    legendColor: false,
                    exportImage: false,
                });
            }
            case GlobalStoreActionType.SAVE_MARKER: {
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
                    thumbnail: false,
                    sort: store.sort,
                    exportMapData: null,
                    isFirstUpload: false,
                    exportImage: false,
                    legendColor: false,
                });
            }
            case GlobalStoreActionType.EXPORT_IMAGE: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    uploadType: "",
                    currentMap: store.currentMap,
                    openComment: store.openComment,
                    mapIdMarkedForDeletion: null,
                    mapMarkedForDeletion: null,
                    mapMarkedForExport: null,
                    search: store.search,
                    filterSearch: store.filterSearch,
                    subregion: null,
                    thumbnail: false,
                    sort: store.sort,
                    exportMapData: null,
                    isFirstUpload: false,
                    legendColor: true,
                    exportImage: payload.exportImage,
                });
            }
            case GlobalStoreActionType.SET_LEGEND_COLOR: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    uploadType: "",
                    currentMap: store.currentMap,
                    openComment: store.openComment,
                    mapIdMarkedForDeletion: null,
                    mapMarkedForDeletion: null,
                    mapMarkedForExport: null,
                    search: store.search,
                    filterSearch: store.filterSearch,
                    subregion: null,
                    thumbnail: false,
                    sort: store.sort,
                    exportMapData: null,
                    isFirstUpload: false,
                    legendColor: true,
                });
            }
            default:
                return store;
        }
    }

    store.setLegendColor = function () {
        console.log("store.setLegendColor");
        storeReducer({
            type: GlobalStoreActionType.SET_LEGEND_COLOR
        });
    }

    store.setCompressionFlag = function () {
        store.currentMap.compressionFlag = true;
    }

    store.compressMap = function () {
        storeReducer({
            type: GlobalStoreActionType.MAP_COMPRESS
        });
    }

    store.markCompression = function () {
        storeReducer({
            type: GlobalStoreActionType.MARK_MAP_FOR_COMPRESSION
        });
    }

    store.startModifyProperty = function () {
        storeReducer({
            type: GlobalStoreActionType.PROPERTIES
        });
    }

    store.showRenameModal = async (id) => {
        let response = await api.getMapById(id);
        if (response.data.success) {
            let map = response.data.map;
            storeReducer({
                type: GlobalStoreActionType.EDIT_MAP,
                payload: { currentMap: map }
            });
        }
    }
    store.isRenameModalOpen = () => {
        return store.currentModal === CurrentModal.EDIT_MAP;
    }
    store.changeMapName = async function (newName) {
        // GET THE LIST
        let id = store.currentMap._id;
        let response = await api.updateMapNameById(id, newName);
        if (response.data.success) {
            response = await api.getAllMaps();
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
    }

    // Update new list 
    store.updateMap = async function (map) {
        const response = await api.updateMapById(map._id, map);
        if (response.data.success) {
            console.log("store.updateMap");
            const response = await api.getAllMaps();
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

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = async function () {
        const response = await api.getAllMaps();
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
            image: "temp",
            markers: [], // Add an empty array for the markers
            compressionFlag: false
        };
        console.log(payload);
        const response = await api.createMap(payload);
        console.log("createNewList response: " + response.data);
        if (response.status === 201) {
            tps.clearAllTransactions();
            let newMap = response.data.map;

            console.log(newMap._id)

            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_MAP,
                payload: { currentMap: newMap, firstUpload: true }
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

    // store.navigatePublic = function (obj) {
    //     async function asyncLoadIdNamePairs() {
    //         const response = await api.getAllMaps();
    //         if (response.data.success) {
    //             let pairsArray = response.data.idNamePairs;

    //             let screenList = []
    //             screenList = pairsArray.filter(pair => {
    //                 return pair.publish.isPublished;
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
                const mapName = pair.name.toLowerCase();
                return store.search !== "" && mapName.includes(store.search.toLowerCase()) && pair.publish.isPublished;
            });
        } else if (store.filterSearch === "users" && store.search !== "") {
            console.log("2");
            console.log(store.search);
            screenList = store.idNamePairs.filter(pair => {
                const ownerName = pair.owner.toLowerCase();
                return store.search !== "" && ownerName === store.search.toLowerCase() && pair.publish.isPublished;
            });
        } else if (store.filterSearch === "property" && store.search !== "") {        
            screenList = store.idNamePairs.filter(pair => {
                return store.search !== "" && pair.uniqueProperties.indexOf(store.search) > -1 && pair.publish.isPublished;
            });
        } else {
            console.log("3");
            console.log(store.search);
            console.log(store.filterSearch);
            screenList = store.idNamePairs.filter(pair => {
                const mapName = pair.name.toLowerCase();
                return (store.search === "" && pair.publish.isPublished) ||
                    (store.search !== "" && mapName.startsWith(store.search.toLowerCase()) && pair.publish.isPublished);
            });
        }
        return screenList;
    };

    /* set which sort operation to perform in the given screen */
    store.setSort = function (sort) {
        storeReducer({
            type: GlobalStoreActionType.SET_SORT,
            payload: sort
        });
    }

    store.sortList = function (screenList) {
        // console.log(screenList);
        // const publishedLists = screenList.filter((pair) => pair.publish.isPublished);
        // const maps = screenList.filter((pair) => !pair.publish.isPublished);
        if (store.sort === "likes") {
            // console.log("likes");
            screenList.sort((a, b) => b.likes.length - a.likes.length);
        }
        else if (store.sort === "dislikes") {
            // console.log("dislikes");
            screenList.sort((a, b) => b.dislikes.length - a.dislikes.length);
        }
        else if (store.sort.includes("maptitle")) {
            // console.log("maptitle");
            screenList.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        }
        else if (store.sort.includes("author")) {
            // console.log("author");
            screenList.sort((a, b) => a.owner.toLowerCase().localeCompare(b.owner.toLowerCase()));
        }
        return screenList;
    }

    store.updateCurrentMap = async function () {
        const response = await api.updateMapById(store.currentMap._id, store.currentMap);
        if (response.data.success) {
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_MAP,
                payload: {
                    currentMap: store.currentMap,
                    firstUpload: false,
                }
            });
        }
    }

    store.updateThumbnail = async function () {
        storeReducer({
            type: GlobalStoreActionType.UPDATE_THUMBNAIL,
            payload: {
                thumbnail: true
            }
        });
    }

    store.updateLikesDislikes = async function (idPair) {
        const response = await api.updateMapById(idPair._id, { likes: idPair.likes, dislikes: idPair.dislikes });
        if (response.data.success) {
            const res = await api.getAllMaps();
            if (res.data.success) {
                let pairsArray = res.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
        }
    }

    store.setCurrentMap = async function (id) {
        let newMap = await api.getMapById(id);
        if (newMap.data.success) {
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_MAP,
                payload: { currentMap: newMap.data.map, firstUpload: false }
            });
        }
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
        console.log(store.currentMap.dataFromMap.features)
        for (let i = 0; i < store.currentMap.dataFromMap.features.length; i++) {
            if (store.currentMap.dataFromMap.features[i].properties.admin === store.subregion.properties.admin) {
                store.currentMap.dataFromMap.features[i].properties.admin = newName
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

    store.saveMarkers = function (newMarkers) {
        store.currentMap.markers = newMarkers;
        console.log(store.currentMap.markers);
        let id = store.currentMap._id;
        let newMap = store.currentMap;

        async function asyncSaveMapMarkers(id, newMap) {
            let response = await api.updateMapById(id, newMap);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SAVE_MARKER,
                    payload: {
                        currentMap: store.currentMap,
                    }
                });
            }
        }

        asyncSaveMapMarkers(id, newMap);
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

    store.duplicateMap = async function (id) {
        let res = await api.getMapById(id);
        if (res.data.success) {
            let map = res.data.map;
            let newMapName = map.name;
            let payload = {
                name: newMapName,
                ownerEmail: auth.user.email,
                owner: auth.user.firstName + " " + auth.user.lastName,
                dataFromMap: map.dataFromMap,
                comments: [],
                likes: [],
                dislikes: [],
                publish: { isPublished: false, publishedDate: new Date() },
                image: map.image,
                markers: map.markers,
                compressionFlag: false
            };
            const re = await api.createMap(payload);
            if (re.status === 201) {
                tps.clearAllTransactions();
                let newMap = re.data.map;
                console.log("store.duplicateMap");
                storeReducer({
                    type: GlobalStoreActionType.DUPLICATE_MAP,
                    payload: newMap
                }
                );

                // IF IT'S A VALID LIST THEN LET'S START EDITING IT
                // history.push("/home/playlist/" + newList._id);
                store.loadIdNamePairs();
                navigate("/home")
                // navigate("/map/" + store.currentMap._id)
            }
            else {
                console.log("API FAILED TO CREATE A NEW MAP");
            }
        }
    }

    store.markMapForExport = function (map_id, map_name) {
        storeReducer({
            type: GlobalStoreActionType.MARK_MAP_FOR_EXPORT,
            payload: { map: { map_id: map_id, map_name: map_name } }
        });
    }

    store.exportMap = async function (id) {
        const response = await api.getMapById(store.mapMarkedForExport.map_id)
        if (response.data.success) {
            storeReducer({
                type: GlobalStoreActionType.MAP_EXPORT,
                payload: { mapData: response.data.map.dataFromMap }
            });
        }
    }

    store.exportMarkedMap = async function () {
        const response = await api.getMapById(store.mapMarkedForExport.map_id)
        if (response.data.success) {
            return response.data.map.dataFromMap;
        }
    }

    store.toggleExportImage = function () {
        storeReducer({
            type: GlobalStoreActionType.EXPORT_IMAGE,
            payload: { exportImage: !store.exportImage }
        });
    }

    //-------------------------------------------->FUNCTION FOR UNDO/REDO OF EDITING VERTEX
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
        console.log("The edited feature is:")
        console.log(editedFeature)
        if (key.includes('-')) { //if '-' is included, this means its a multipolygon
            const parts = key.split("-"); //parts = ["index location of feature", "index location of multipolygon"]
            const index = parseInt(parts[0]);
            const index2 = parseInt(parts[1]);

            if (editedFeature.length > 1) {
                store.currentMap.dataFromMap.features[index].geometry.coordinates[index2] = editedFeature[index2];
            } else {
                store.currentMap.dataFromMap.features[index].geometry.coordinates[index2] = editedFeature;
            }
        } else { //if NO '-' than this means its a Polygon: key="index location of feature"
            const index = parseInt(key);
            store.currentMap.dataFromMap.features[index].geometry.coordinates = editedFeature;
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
    //------------------------------------------------------------------------------------------------------->DONE\

    //-------------------------------------------------------> FUNCTION FOR UNDO/REDO OF SPLITTING
    store.splitCurrentRegion = function (splitArray, oldFeature) {
        this.addSplitRegionTransaction(splitArray, oldFeature);
    }
    store.addSplitRegionTransaction = (splitArray, oldFeature) => {
        let transaction = new SplitRegion_Transaction(store, splitArray, oldFeature);
        tps.addTransaction(transaction);
    }
    store.splitRegion = function (splitArray, oldFeature) {
        let ver1 = splitArray[0] //[14, 2, {x,y}, T/F]
        let ver2 = splitArray[1] //[14, 4, {x,y}, T/F]

        if (!ver1[3]) { //if its a Polygon
            let index1 = ver1[1]
            let index2 = ver2[1]
            if (index1 > index2) {
                index2 = ver1[1]
                index1 = ver2[1]
            }

            //reconstruct the coordinates array
            const slicedFeatureArray = oldFeature.geometry.coordinates[0].slice(index1, (index2 + 1)); // [3, 4, 5]
            let repeatCoord = slicedFeatureArray[0]
            slicedFeatureArray.push(repeatCoord)

            //create the new split polygon
            let slicedFeature = turf.polygon([slicedFeatureArray]);
            let index = store.currentMap.dataFromMap.features.length
            let name = "NewRegion-" + index
            slicedFeature.properties.admin = name
            slicedFeature.properties.sovereignt = name

            //splice the coordinates of the polygon and then push the sliced poly into the store
            store.currentMap.dataFromMap.features[ver1[0]].geometry.coordinates[0].splice(index1 + 1, index2 - index1 - 1)
            store.currentMap.dataFromMap.features.push(slicedFeature)
        } else { //if its a MultiPolygon
            let i1 = ver1[1]
            let parts1 = ver1[0].split("-"); //parts = ["index of subregion", "index of subregion in multipolygon"]
            let indexPoly1 = parseInt(parts1[0]);
            let indexCoordPoly1 = parseInt(parts1[1]);
            let i2 = ver2[1]

            if (i1 > i2) {
                i2 = ver1[1]
                i1 = ver2[1]
            }

            const slicedFeatureArray = oldFeature.geometry.coordinates[indexCoordPoly1][0].slice(i1, (i2 + 1)); // [3, 4, 5]
            let repeatCoord = slicedFeatureArray[0]
            slicedFeatureArray.push(repeatCoord)

            let slicedFeature = turf.polygon([slicedFeatureArray]);
            let index = store.currentMap.dataFromMap.features.length
            let name = "NewRegion-" + index
            slicedFeature.properties.admin = name
            slicedFeature.properties.sovereignt = name
            store.currentMap.dataFromMap.features[indexPoly1].geometry.coordinates[indexCoordPoly1][0].splice(i1 + 1, i2 - i1 - 1)
            store.currentMap.dataFromMap.features.push(slicedFeature)
        }

        //in the end we re-render by using storeReducer
        storeReducer({
            type: GlobalStoreActionType.EDIT_MAP_VERTEX,
            payload: { currentMap: store.currentMap }
        });
    }
    store.mergeSplitRegion = function (splitArray, oldFeature) {
        for (let i = 0; i < store.currentMap.dataFromMap.features.length; i++) {
            let currentFeature = store.currentMap.dataFromMap.features[i]

            if (oldFeature.properties.admin === currentFeature.properties.admin) {
                if (oldFeature.geometry.type === "Polygon") {
                    let lastIndex = store.currentMap.dataFromMap.features.length - 1
                    store.currentMap.dataFromMap.features[i] = oldFeature;
                    (store.currentMap.dataFromMap.features).splice(lastIndex, 1)
                    break;
                } else {
                    let lastIndex = store.currentMap.dataFromMap.features.length - 1
                    store.currentMap.dataFromMap.features[i] = oldFeature;
                    (store.currentMap.dataFromMap.features).splice(lastIndex, 1)
                    break;
                }
            }
        }

        //in the end we re-render by using storeReducer
        storeReducer({
            type: GlobalStoreActionType.EDIT_MAP_VERTEX,
            payload: { currentMap: store.currentMap }
        });
    }
    //----------------------------------------------------------------------------------------------------->DONE\

    //-------------------------------------------->FUNCTION FOR UNDO/REDO OF MERGING 2 SUBREGIONS
    store.mergeCurrentRegions = function (keys, mergedFeature, feature1, feature2) {
        this.addMergeRegionTransaction(keys, mergedFeature, feature1, feature2);
    }
    store.addMergeRegionTransaction = (keys, mergedFeature, feature1, feature2) => {
        let transaction = new MergeRegion_Transaction(store, keys, mergedFeature, feature1, feature2);
        tps.addTransaction(transaction);
    }
    store.mergeRegion = function (keys, mergedFeature, feature1, feature2) {

        let index2 = keys[1]
        store.currentMap.dataFromMap.features.splice(index2, 1)

        store.currentMap.dataFromMap.features.forEach((feature, index) => {
            if (feature.properties.admin === feature1.properties.admin) {
                store.currentMap.dataFromMap.features.splice(index, 1)
                mergedFeature.properties = JSON.parse(JSON.stringify(feature.properties));
                let deepCopiedMerge = JSON.parse(JSON.stringify(mergedFeature));
                store.currentMap.dataFromMap.features.splice(index, 0, deepCopiedMerge)
                keys[0] = index
            }
        });


        //in the end we re-render by using storeReducer
        storeReducer({
            type: GlobalStoreActionType.EDIT_MAP_VERTEX,
            payload: { currentMap: store.currentMap }
        });
    }
    store.unmergeRegion = function (keys, feature1, feature2) {
        let index1 = keys[0]
        let index2 = keys[1]
        store.currentMap.dataFromMap.features.splice(index1, 1)
        let deepCopiedFeature1 = JSON.parse(JSON.stringify(feature1));
        let deepCopiedFeature2 = JSON.parse(JSON.stringify(feature2));
        store.currentMap.dataFromMap.features.splice(index1, 0, deepCopiedFeature1)
        store.currentMap.dataFromMap.features.splice(index2, 0, deepCopiedFeature2)

        //in the end we re-render by using storeReducer
        storeReducer({
            type: GlobalStoreActionType.EDIT_MAP_VERTEX,
            payload: { currentMap: store.currentMap }
        });
    }
    //----------------------------------------------------------------------------------------------------->DONE\

    //-------------------------------------------->FUNCTION FOR UNDO/REDO OF MERGING 2 SUBREGIONS
    store.addCurrentRegion = function (newRegion) {
        this.addAddRegionTransaction(newRegion);
    }
    store.addAddRegionTransaction = (newRegion) => {
        let transaction = new AddRegion_Transaction(store, newRegion);
        tps.addTransaction(transaction);
    }
    store.addSubregion = function (newRegion) {

        let copiedRegion = JSON.parse(JSON.stringify(newRegion));
        store.currentMap.dataFromMap.features.push(copiedRegion);
        //in the end we re-render by using storeReducer

        storeReducer({
            type: GlobalStoreActionType.ADDED_REGION
        });
    }
    store.revertAddedRegion = function () {
        storeReducer({
            type: GlobalStoreActionType.REVERTED_REGION
        });
    }
    store.removeSubregion = function () {
        let lastIndex = store.currentMap.dataFromMap.features.length - 1;
        store.currentMap.dataFromMap.features.splice(lastIndex, 1);
        //in the end we re-render by using storeReducer
        storeReducer({
            type: GlobalStoreActionType.EDIT_MAP_VERTEX,
            payload: { currentMap: store.currentMap }
        });
    }

    //----------------------------------------------------------------------------------------------------->DONE\

    //-------------------------------------------->FUNCTION FOR UNDO/REDO OF DELETING A REGION
    store.deleteCurrentRegion = function (keys, deletedRegion) {
        this.addDeleteRegionTransaction(keys, deletedRegion);
    }
    store.addDeleteRegionTransaction = (keys, deletedRegion) => {
        let transaction = new DeleteRegion_Transaction(store, keys, deletedRegion);
        tps.addTransaction(transaction);
    }
    store.deleteSubregion = function(keys){

        if(keys.length === 2) {
            let i = keys[0]
            let j = keys[1]
            store.currentMap.dataFromMap.features[i].geometry.coordinates.splice(j, 1);
        } else {
            let i = keys[0]
            store.currentMap.dataFromMap.features.splice(i, 1);
        }

        storeReducer({
            type: GlobalStoreActionType.EDIT_MAP_VERTEX,
            payload: { currentMap: store.currentMap }
        });
    }
    store.addDeletedSubregion = function(keys, deletedRegion){
        console.log("WTF ARE KEYS")
        console.log(keys)
        if(keys.length === 2) {
            console.log("why isnt this working")
            let i = keys[0]
            let j = keys[1]
            let deletedCoords = deletedRegion.geometry.coordinates[j]
            //let deleted = JSON.parse(JSON.stringify(deletedRegion)); //create a deep copy
            store.currentMap.dataFromMap.features[i].geometry.coordinates.splice(j, 0, deletedCoords)
            //store.currentMap.dataFromMap.features[i] = deleted;
        } else {
            console.log("TRIED TO REDO BRYH")
            let i = keys[0]
            let deleted = JSON.parse(JSON.stringify(deletedRegion)); //create a deep copy
            store.currentMap.dataFromMap.features.splice(i, 0, deleted)
            //store.currentMap.dataFromMap.features[i] = deleted;
        }

        storeReducer({
            type: GlobalStoreActionType.EDIT_MAP_VERTEX,
            payload: { currentMap: store.currentMap }
        });
    }
    //----------------------------------------------------------------------------------------------------->DONE\

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