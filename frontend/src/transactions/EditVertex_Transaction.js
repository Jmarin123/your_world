import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * CreateSong_Transaction
 * 
 * This class represents a transaction that creates a song
 * in the playlist. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class EditVertex_Transaction extends jsTPS_Transaction {
    constructor(initStore, initKey, initNewFeature, initOldFeature) {
        super();
        this.store = initStore;
        this.key = initKey;
        this.newFeature = initNewFeature; //from layer
        this.oldFeature = initOldFeature; //from store
    }


    //NEED: store.currentMap, key(countryName), layer(newCoordinates), feature(fromStore/oldCoordinates)
    doTransaction() {
        console.log("REDO ENTERED")
        this.store.editVertex(this.key, this.newFeature);
    }
    
    undoTransaction() {
        console.log("UNDO ENTERED")
        this.store.editVertex(this.key, this.oldFeature);
    }
}