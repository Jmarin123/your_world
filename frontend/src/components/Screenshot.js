import { useEffect, useContext } from 'react';

import { GlobalStoreContext } from '../store'

// eslint-disable-next-line
import * as L from 'leaflet'
import { useMap } from 'react-leaflet';
import { SimpleMapScreenshoter } from 'leaflet-simple-map-screenshoter'

const pluginOptions = {
    hideElementsWithSelectors: [
      ".leaflet-control-container",
      ".leaflet-dont-include-pane",
      "#snapshot-button"
    ],
    hidden: true
};

const screenshotter = new SimpleMapScreenshoter(pluginOptions);

const Screenshot = () => {
    const { store } = useContext(GlobalStoreContext);
    const map = useMap();
    screenshotter.addTo(map)

    useEffect(() => {
        if(store.currentMap && store.thumbnail){
            let format = 'image' // 'image' - return base64, 'canvas' - return canvas
            let overridedPluginOptions = {
            mimeType: 'image/jpeg'
            }
            
            screenshotter.takeScreen(format, overridedPluginOptions).then(image => {
                store.currentMap.image = image;
                store.updateCurrentMap();
                }).catch(e => {
                console.error(e)
                })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store.thumbnail]);

    useEffect(() => {
        if(store.currentMap && store.isFirstUpload){
            let format = 'image' // 'image' - return base64, 'canvas' - return canvas
            let overridedPluginOptions = {
            mimeType: 'image/jpeg'
            }
            
            screenshotter.takeScreen(format, overridedPluginOptions).then(image => {
                store.currentMap.image = image;
                store.updateCurrentMap();
                }).catch(e => {
                console.error(e)
                })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store.isFirstUpload]);

    return null;
}

export default Screenshot