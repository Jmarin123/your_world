import jsTPS_Transaction from "../common/jsTPS.js"

export default class AddRegion_Transaction extends jsTPS_Transaction {
    constructor(initStore, initNewRegion) {
        super();
        this.store = initStore;
        this.newRegion = initNewRegion
    }

    doTransaction() {
        this.store.addSubregion(this.newRegion);
    }
    
    undoTransaction() {
        this.store.removeSubregion();
    }
}