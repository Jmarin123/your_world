import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const Recenter = ({bounds}) => {
    const map = useMap();
    useEffect(() => {
        if(bounds !== null){
            if(bounds._northEast && bounds._southWest){
                map.fitBounds(bounds, { animate: false, })
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bounds]);
    return null;
}

export default Recenter