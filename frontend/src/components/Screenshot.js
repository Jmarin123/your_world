import { useEffect, useContext } from 'react';
// useState

import { GlobalStoreContext } from '../store'

// eslint-disable-next-line
import * as L from 'leaflet'
import { useMap } from 'react-leaflet';
import { SimpleMapScreenshoter } from 'leaflet-simple-map-screenshoter'
// useMapEvents

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

    // const [drag, setDrag] = useState(false)

            // onDragStart={handleDragStart}
            // onDragOver={handleDragOver}
            // onDragEnter={handleDragEnter}
            // onDragLeave={handleDragLeave}
            // onDrop={handleDrop}

    // const events = useMapEvents({
    //     dragstart: () => {
    //       console.log("Started drag")
    //       setDrag(true)
    //     },
    //     dragend: () => {
    //       console.log("Drag end")
    //       setDrag(false)
    //     }
    //   })

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

    // useEffect(() => {
    //     if(store.currentMap && store.isFirstUpload){
    //         let format = 'image' // 'image' - return base64, 'canvas' - return canvas
    //         let overridedPluginOptions = {
    //         mimeType: 'image/jpeg'
    //         }

    //         console.log(map)
            
    //         var allowDrag = function(){
    //             map.dragging.enable();
    //         }

    //         map.dragging.disable()
    //         screenshotter.takeScreen(format, overridedPluginOptions).then(image => {
    //             store.currentMap.image = image;
    //             store.updateCurrentMap();
    //             }).catch(e => {
    //             console.error(e)
    //         })
    //         setTimeout(allowDrag, 1000);
            
    //     }
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [store.isFirstUpload]);

    useEffect(() => {
        if(store.currentMap && store.exportImage){
            let format = 'image' // 'image' - return base64, 'canvas' - return canvas
            let overridedPluginOptions = {
            mimeType: 'image/jpeg'
            }
            
            screenshotter.takeScreen(format, overridedPluginOptions).then(image => {
                console.log(image)
                var link = document.createElement('a');
                link.href = image;
                link.download = 'mapimage.jpg';
                link.click();
                store.toggleExportImage();

                }).catch(e => {
                console.error(e)
                })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store.exportImage]);

    return null;
}

export default Screenshot