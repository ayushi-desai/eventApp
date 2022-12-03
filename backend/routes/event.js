const express = require('express');
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require('../db/conn');

// This section will help you get a list of all the records.
recordRoutes.route('/getevents').get(async function (_req, res) {
    const dbConnect = dbo.getDb();

    dbConnect
        .collection('events')
        .find({})
        .limit(50)
        .toArray(function (err, result) {
            if (err) {
                res.status(400).send('Error fetching listings!');
            } else {
                res.json(result);
            }
        });
});

// This section will help you get a list of all the records.
recordRoutes.route('/getByHighestSeverity').get(async function (_req, res) {
    const dbConnect = dbo.getDb();
    const areaId = _req.query.areaId;
    if (areaId) {
        dbConnect
            .collection('events')
            .find({ severity: 'MAJOR', areas: { $elemMatch: { id: areaId } } })
            .limit(50)
            .toArray(function (err, result) {
                if (err) {
                    res.send(`Error fetching listings! ${err}`);
                } else {
                    res.json(result);
                }
            });
    }else{
        res.send(`No Data Found`);
    }
});

// This section will help you create new record for events table.
recordRoutes.route('/saveEvents').post(function (req, res) {
    const dbConnect = dbo.getDb();
    const matchDocument = req.body;
    dbConnect
        .collection('events')
        .insertMany(matchDocument, function (err, result) {
            if (err) {
                res.status(400).send('Error inserting matches!');
            } else {
                console.log(`Added a new batch`);
                res.status(204).send();

            }
        });
    trackApi('saveEvents');
});

// This section will help you create new record to keep track of the api called.
const trackApi = (apiType) => {
    const dbConnect = dbo.getDb();
    const document = {
        apiType: apiType,
        hits: 1,
        created: new Date(),
        updated: new Date()
    }
    dbConnect
        .collection('apiHits')
        .insertOne(document, function (err, result) {
            if (err) {
                console.log(`Error saving data for trackApi ${err}`);
            } else {
                console.log(`Added a new data for trackApi`);
            }
        });
}

module.exports = recordRoutes;