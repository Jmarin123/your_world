import { createContext, useState } from 'react'
//useContext
// import { useHistory } from 'react-router-dom'

export const GlobalStoreContext = createContext({});
console.log("Creating store")

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
    UPLOAD_FILE: "UPLOAD_FILE"
}

export const CurrentModal = {
    NONE : "NONE",
    DELETE_MAP : "DELETE_MAP",
    EDIT_MAP : "EDIT_MAP",
    RENAME_SUBREGION : "RENAME_SUBREGION",
    UPLOAD_FILE : "UPLOAD_FILE"
}

function GlobalStoreContextProvider(props) {
    const [store, setStore] = useState({
        currentModal : CurrentModal.NONE,
        uploadType : "",
        currentMap: null
    });
    // const history = useHistory();

    console.log("inside useGlobalStore");

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
                    currentModal : CurrentModal.UPLOAD_FILE,
                    uploadType: payload.type,
                    currentMap: store.currentMap
                });
            }
            case GlobalStoreActionType.HIDE_MODAL: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    uploadType: "",
                    currentMap: store.currentMap
                });
            }
            case GlobalStoreActionType.SET_CURRENT_MAP: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    uploadType: "",
                    currentMap: payload.currentMap
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
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };