import jsTPS_Transaction from "../common/jsTPS.js"

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