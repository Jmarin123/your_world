import jsTPS_Transaction from "../common/jsTPS.js"

export default class SplitRegion_Transaction extends jsTPS_Transaction {
    constructor(initStore, initSplitArray, initOldFeature) {
        super();
        this.store = initStore;
        this.splitArray = initSplitArray;
        this.oldFeature = initOldFeature; //from store
    }

    //NEED: store.currentMap, key(countryName), layer(newCoordinates), feature(fromStore/oldCoordinates)
    doTransaction() {
        console.log("REDO ENTERED")
        const oldFeatureCopy = JSON.parse(JSON.stringify(this.oldFeature));
        this.store.splitRegion(this.splitArray, oldFeatureCopy);
    }
    
    undoTransaction() {
        console.log("UNDO ENTERED")
        const oldFeatureCopy = JSON.parse(JSON.stringify(this.oldFeature));
        this.store.mergeSplitRegion(this.splitArray, oldFeatureCopy);
    }
}