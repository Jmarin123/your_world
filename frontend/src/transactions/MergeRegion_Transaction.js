import jsTPS_Transaction from "../common/jsTPS.js"

export default class MergeRegion_Transaction extends jsTPS_Transaction {
    constructor(initStore, initKeys, initMergedFeature, initFeature1, initFeature2) {
        super();
        this.store = initStore;
        this.keys = initKeys
        this.mergedFeature = initMergedFeature;
        this.feature1 = initFeature1; //from store
        this.feature2 = initFeature2;
    }

    //NEED: store.currentMap, key(countryName), layer(newCoordinates), feature(fromStore/oldCoordinates)
    doTransaction() {
        //const oldFeatureCopy = JSON.parse(JSON.stringify(this.oldFeature));
        this.store.mergeRegion(this.keys, this.mergedFeature, this.feature1, this.feature2);
    }
    
    undoTransaction() {
        //const oldFeatureCopy = JSON.parse(JSON.stringify(this.oldFeature));
        this.store.unmergeRegion(this.keys, this.feature1, this.feature2);
    }
}