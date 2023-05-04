import jsTPS_Transaction from "../common/jsTPS.js"

export default class SplitRegion_Transaction extends jsTPS_Transaction {
    constructor(initStore, initSplitArray, initOldFeature) {
        super();
        this.store = initStore;
        this.splitArray = initSplitArray;
        this.oldFeature = initOldFeature; //from store
    }

    doTransaction() {
        const oldFeatureCopy = JSON.parse(JSON.stringify(this.oldFeature));
        this.store.splitRegion(this.splitArray, oldFeatureCopy);
    }
    
    undoTransaction() {
        const oldFeatureCopy = JSON.parse(JSON.stringify(this.oldFeature));
        this.store.mergeSplitRegion(this.splitArray, oldFeatureCopy);
    }
}