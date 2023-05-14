import jsTPS_Transaction from "../common/jsTPS.js"

export default class DeleteRegion_Transaction extends jsTPS_Transaction {
    constructor(initStore, initKeys, initDeletedRegion) {
        super();
        this.store = initStore;
        this.deletedRegion = initDeletedRegion
        this.keys = initKeys
    }

    doTransaction() {
        this.store.deleteSubregion(this.keys);
    }
    
    undoTransaction() {
        const oldFeatureCopy = JSON.parse(JSON.stringify(this.deletedRegion));
        this.store.addDeletedSubregion(this.keys, oldFeatureCopy);
    }
}