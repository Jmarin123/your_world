const Map = require('../models/map-model')
const User = require('../models/user-model');
const MapInfo = require('../models/map-info-model');
const shpwrite = require('shp-write');
const path = require('path');
const { convert } = require('geojson2shp')

// createMap = async (req, res) => {
//     const body = req.body;
//     console.log(body);
//     console.log("create a new map");

//     if (!body) {
//         return res.status(400).json({
//             success: false,
//             error: 'You must provide a Map',
//         })
//     }
//     const { dataFromMap, ...rest } = body;
//     const mapBody = new Map(rest);
//     const mapInfo = new MapInfo({ dataFromMap: dataFromMap });
//     mapBody.dataFromMap = mapInfo;
//     if (!mapBody) {
//         return res.status(400).json({ success: false, error: err })
//     }
//     try {
//         await mapInfo.save(); // Save the MapInfo instance first
//         await mapBody.save(); // Save the Map instance
//         const foundUser = await User.findOne({ _id: req.userId })
//         foundUser.maps.push(mapBody._id);
//         await foundUser.save();
//         const mapToReturn = await Map.findById(mapBody._id).populate('dataFromMap').lean();
//         mapToReturn.dataFromMap = mapToReturn.dataFromMap.dataFromMap;
//         res.status(201).json({ map: mapToReturn });
//     } catch (err) {
//         console.log(err);
//         return res.status(400).json({ success: false, error: err })
//     }
// }
createMap = async (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Map',
        });
    }

    const { markers, dataFromMap, ...rest } = body;
    const mapBody = new Map(rest);
    const mapInfo = new MapInfo({ dataFromMap: dataFromMap });
    mapBody.dataFromMap = mapInfo;

    if (!mapBody) {
        return res.status(400).json({ success: false, error: err });
    }

    try {
        await mapInfo.save(); // Save the MapInfo instance first

        if (markers && Array.isArray(markers)) {
            mapBody.markers = markers.map((marker) => {
                return {
                    lat: marker.lat,
                    lng: marker.lng,
                    value: marker.value,
                    font: marker.font,
                };
            });
        }
        let allUniqueVals = new Set();
        if (dataFromMap.type == "FeatureCollection") {
            for (feature of dataFromMap.features) {
                for (prop in feature.properties) {
                    allUniqueVals.add(prop);
                }
            }
        } else if (dataFromMap.type == "Feature") {
            for (prop in dataFromMap.properties) {
                allUniqueVals.add(prop);
            }
        }
        let listOfUnique = Array.from(allUniqueVals);
        mapBody.uniqueProperties = listOfUnique;
        await mapBody.save(); // Save the Map instance

        const foundUser = await User.findOne({ _id: req.userId });
        foundUser.maps.push(mapBody._id);
        await foundUser.save();

        const mapToReturn = await Map.findById(mapBody._id)
            .populate('dataFromMap')
            .lean();

        mapToReturn.dataFromMap = mapToReturn.dataFromMap.dataFromMap;
        mapToReturn.compressionFlag = false;
        res.status(201).json({ map: mapToReturn });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false, error: err });
    }
};



deleteMap = async (req, res) => {
    console.log("delete map with id: " + JSON.stringify(req.params.id));
    console.log("delete " + req.params.id);
    console.log("req.userId" + req.userId);

    try {
        const map = await Map.findById(req.params.id);
        if (!map) {
            return res.status(404).json({ errorMessage: 'map not found!' });
        }

        const user = await User.findOne({ email: map.ownerEmail });
        console.log("user._id: " + user._id);
        console.log("req.userId: " + req.userId);
        console.log("map.ownerEmail: " + map.ownerEmail);

        if (user._id.toString() === req.userId) {
            console.log("correct user!");
            const generalInfo = await Map.findById({ _id: req.params.id })
            await MapInfo.findByIdAndRemove({ _id: generalInfo.dataFromMap._id });
            await Map.findOneAndDelete({ _id: req.params.id });
            return res.status(200).json({});
        } else {
            console.log("incorrect user!");
            return res.status(400).json({ errorMessage: "authentication error" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ errorMessage: 'internal server error' });
    }
};

getMapById = async (req, res) => {
    console.log("Find map with id: " + JSON.stringify(req.params.id));

    try {
        const map = await Map.findById(req.params.id).populate('dataFromMap').lean();
        if (!map) {
            return res.status(404).json({ success: false, error: 'Map not found' });
        }
        // console.log("Found map: " + JSON.stringify(map));
        map.dataFromMap = map.dataFromMap.dataFromMap;
        return res.status(200).json({ success: true, map: map });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false, error: err });
    }
};

getAllMaps = async (req, res) => {
    try {
        let maps = await Map.find({});
        // if (!maps.length) {
        //     return res
        //         .status(404)
        //         .json({ success: false, error: `maps not found` });
        // }

        const pairs = maps.map((map) => {
            return {
                _id: map._id,
                name: map.name, // add it 
                ownerEmail: map.ownerEmail,
                owner: map.owner,
                likes: map.likes,
                dislikes: map.dislikes,
                image: map.image,
                publish: map.publish,
                markers: map.markers,
                uniqueProperties: map.uniqueProperties,
                compressionFlag: map.compressionFlag
            };
        });

        return res.status(200).json({ success: true, idNamePairs: pairs });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false, error: err });
    }
};

updateMapNameById = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a name to update',
        })
    }
    try {
        const map = await Map.findOne({ _id: req.params.id });
        if (!map) {
            return res.status(404).json({
                message: 'Map not found!',
            })
        }
        map.name = name;
        await map.save();
        return res.status(200).json({
            success: true,
            id: map._id,
            message: 'Map updated!',
        })
    } catch (err) {
        return res.status(404).json({
            err,
            message: 'Map name not updated!',
        })
    }
}

updateMap = async (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    try {
        const map = await Map.findOne({ _id: req.params.id });
        console.log("map found! ");

        if (!map) {
            return res.status(404).json({
                message: 'Map not found!',
            })
        }

        map.name = body.map.name || map.name;
        map.ownerEmail = body.map.ownerEmail || map.ownerEmail;
        map.owner = body.map.owner || map.owner;
        map.comments = body.map.comments || map.comments;
        map.likes = body.map.likes || map.likes;
        map.dislikes = body.map.dislikes || map.dislikes;
        map.publish = body.map.publish || map.publish;
        map.image = body.map.image || map.image;
        map.markers = body.map.markers || map.markers;
        map.compressionFlag = body.map.compressionFlag || map.compressionFlag;

        console.log("markers array:", body.map.markers);

        if (body.map.dataFromMap) {
            await MapInfo.findByIdAndUpdate(map.dataFromMap._id, { dataFromMap: body.map.dataFromMap });
            let allUniqueVals = new Set();
            if (body.map.dataFromMap.type == "FeatureCollection") {
                for (feature of body.map.dataFromMap.features) {
                    for (prop in feature.properties) {
                        allUniqueVals.add(prop);
                    }
                }
            } else if (body.map.dataFromMap.type == "Feature") {
                for (prop in dataFromMap.properties) {
                    allUniqueVals.add(prop);
                }
            }
            let listOfUnique = Array.from(allUniqueVals);
            map.uniqueProperties = listOfUnique;
        }
        await map.save();
        console.log("markers array  2:", body.map.markers);
        return res.status(200).json({
            success: true,
            id: map._id,
            message: 'Map updated!',
        })
    } catch (error) {
        console.log(error);
        return res.status(404).json({
            error,
            message: 'Map not updated!',
        })
    }
}

downloadSHP = async (req, res) => {
    if (!req.params.id) {
        return res.status(404).json({
            error,
            message: 'Unable to downloadSHP',
        })
    }
    const map = await Map.findById(req.params.id).populate('dataFromMap').lean();
    return res.status(200).json({ map: map });
    //const filePath = path.join(__dirname, 'test.zip');
    // await convert(map.dataFromMap.dataFromMap, filePath, options)
    // res.download(filePath);
    // const shpBuffer = shpwrite.zip(map.dataFromMap.dataFromMap);

    // let str = Buffer.from(shpBuffer).toString();
    // console.log(str);
    // const fileName = `${map.name}`;
    // res.attachment(fileName + '.zip');
    // res.send(shpBuffer);

}
module.exports = {
    createMap,
    deleteMap,
    getMapById,
    getAllMaps,
    downloadSHP,
    updateMap,
    updateMapNameById,
}