import { createContext, useState } from 'react'
import { Outlet } from 'react-router-dom'
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
        uploadType: "",
        currentMap: null,
        openComment: false,
        mapMarkedForDeletion: null,
        mapMarkedForExport: null,
    });
    // const history = useHistory();

    // const { auth } = useContext(AuthContext);
    // console.log("auth: " + auth);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CREATE_NEW_MAP: {
                return setStore({
                    currentModal: CurrentModal.UPLOAD_FILE,
                    uploadType: payload.type,
                    currentMap: store.currentMap,
                    openComment: false,
                    mapMarkedForDeletion: null,
                    mapMarkedForExport: null,
                });
            }
            case GlobalStoreActionType.HIDE_MODAL: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    uploadType: "",
                    currentMap: store.currentMap,
                    openComment: false,
                    mapMarkedForDeletion: null,
                    mapMarkedForExport: null,
                });
            }
            case GlobalStoreActionType.SET_CURRENT_MAP: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    uploadType: "",
                    currentMap: payload.currentMap,
                    openComment: false,
                    mapMarkedForDeletion: null,
                    mapMarkedForExport: null,
                });
            }
            case GlobalStoreActionType.OPEN_COMMENT: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    uploadType: "",
                    currentMap: payload.currentMap,
                    openComment: true,
                    mapMarkedForDeletion: null,
                    mapMarkedForExport: null,
                });
            }
            case GlobalStoreActionType.CLOSE_COMMENT: {
                return setStore({
                    currentModal: CurrentModal.NONE,
                    uploadType: "",
                    currentMap: payload.currentMap,
                    openComment: false,
                    mapMarkedForDeletion: null,
                    mapMarkedForExport: null,
                });
            }
            case GlobalStoreActionType.MARK_MAP_FOR_DELETION: {
                return setStore({
                    currentModal: CurrentModal.MARK_MAP_FOR_DELETION,
                    uploadType: "",
                    currentMap: null,
                    openComment: false,
                    mapMarkedForDeletion: payload.map,
                    mapMarkedForExport: null,
                });
            }
            case GlobalStoreActionType.MARK_MAP_FOR_EXPORT: {
                return setStore({
                    currentModal: CurrentModal.EXPORT_MAP,
                    uploadType: "",
                    currentMap: null,
                    openComment: false,
                    mapMarkedForDeletion: null,
                    mapMarkedForExport: payload.map,
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

    store.createNewMap = async function (obj) {
        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_MAP,
            payload: {
                currentMap: obj
            }
        });
        navigate("/map");
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

    store.markMapForDeletion = function (map) {
        storeReducer({
            type: GlobalStoreActionType.MARK_MAP_FOR_DELETION,
            payload: { map: map }
        });
    }

    store.duplicateMap = function (map) {
        // storeReducer({
        //     type: GlobalStoreActionType.MARK_MAP_FOR_DELETION,
        //     payload: { map: map }
        // });
        navigate("/yourmaps")
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