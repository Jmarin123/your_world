const Map = require('../models/map-model')
const User = require('../models/user-model');
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/
createMap = (req, res) => {
    const body = req.body;
    // console.log("createMap body: " + JSON.stringify(body));

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Map',
        })
    }

    const map = new Map(body);
    // console.log("map: " + map.toString());
    if (!map) {
        return res.status(400).json({ success: false, error: err })
    }

    User.find({ _id: req.userId }).then(function (user, err) {
        // console.log("user found: " + JSON.stringify(user));
        console.log("user[0]: ", user[0]);
        user[0].maps.push(map._id)

        user[0].save().then(() => {
            map
                .save()
                .then(() => {
                    return res.status(201).json({
                        map: map
                    })
                })
                .catch(error => {
                    return res.status(400).json({
                        errorMessage: error
                    })
                })
        });
    })
}


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
        const map = await Map.findById(req.params.id);
        if (!map) {
            return res.status(404).json({ success: false, error: 'Map not found' });
        }
        // console.log("Found map: " + JSON.stringify(map));
        return res.status(200).json({ success: true, map: map });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false, error: err });
    }
};

getAllMaps = async (req, res) => {
    try {
        let maps = await Map.find({});
        if (!maps.length) {
            return res
                .status(404)
                .json({ success: false, error: `maps not found` });
        }

        for(let i = 0; i < maps.length; i++){
            maps[i].dataFromMap = {}
        }

        // PUT ALL THE LISTS INTO ID, NAME PAIRS
        const pairs = maps.map((map) => {
            return {
                _id: map._id,
                name: map.name,
                map: map // add it 
            };
        });

        return res.status(200).json({ success: true, idNamePairs: pairs });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false, error: err });
    }
};



getMapPairs = async (req, res) => {
    try {
        const maps = await Map.find({});
        if (!maps.length) {
            return res
                .status(404)
                .json({ success: false, error: `Maps not found` });
        }
        else {
            console.log("Send the all maps pairs");
            // PUT ALL THE LISTS INTO ID, NAME PAIRS
            let pairs = [];
            for (let key in maps) {
                maps[key].dataFromMap = {}
                let map = maps[key];
                let pair = {
                    _id: map._id,
                    name: map.name,
                    map: map // add it 
                };
                pairs.push(pair);
            }
            return res.status(200).json({ success: true, idNamePairs: pairs })
        }
    } catch (err) {
        console.log(err);
        return res.status(400).json({ success: false, error: err })
    }
}


updateMap = async (req, res) => {
    const body = req.body
    console.log("req.body.name: " + req.body.name);

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

        map.name = body.map.name;
        map.ownerEmail = body.map.ownerEmail;
        map.owner = body.map.owner;
        map.dataFromMap = body.map.dataFromMap;
        map.comments = body.map.comments;
        map.likes = body.map.likes;
        map.dislikes = body.map.dislikes;
        map.publish = body.map.publish;
        map.image = body.map.image;

        await map.save();

        console.log("SUCCESS!!!");
        return res.status(200).json({
            success: true,
            id: map._id,
            message: 'Map updated!',
        })
    } catch (error) {
        console.log("FAILURE: " + JSON.stringify(error));
        return res.status(404).json({
            error,
            message: 'Map not updated!',
        })
    }
}

module.exports = {
    createMap,
    deleteMap,
    getMapById,
    getMapPairs,
    getAllMaps,
    // getPlaylists,
    updateMap,
}