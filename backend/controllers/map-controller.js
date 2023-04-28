const Map = require('../models/map-model')
const User = require('../models/user-model');

createMap = (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Map',
        })
    }

    const map = new Map(body);
    if (!map) {
        return res.status(400).json({ success: false, error: err })
    }

    User.find({ _id: req.userId }).then(function (user, err) {
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
                publish: map.publish
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
        map.dataFromMap = body.map.dataFromMap || map.dataFromMap;
        map.comments = body.map.comments || map.comments;
        map.likes = body.map.likes || map.likes;
        map.dislikes = body.map.dislikes || map.dislikes;
        map.publish = body.map.publish || map.publish;
        map.image = body.map.image || map.image;

        await map.save();
        return res.status(200).json({
            success: true,
            id: map._id,
            message: 'Map updated!',
        })
    } catch (error) {
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
    getAllMaps,
    updateMap,
    updateMapNameById,
}