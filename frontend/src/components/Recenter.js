import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const Recenter = ({lat,lng}) => {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lat, lng]);
    return null;
}

export default Recenter