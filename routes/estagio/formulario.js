require('dotenv').config();
const express = require('express')
const { conector } = require('../../mysql_conector.js')
const { insertEvent } = require('../../google-calendar.js'); 
const { adsense } = require('googleapis/build/src/apis/adsense/index.js');
const router = express.Router();



router.post('/api/formulario/add', (req, res) => {

    const { title, date, start_date, finish_date, places_publish, description, images, files} = req.body

    const QUERY = 'INSERT INTO formulario (title, date, start_date, finish_date, places_publish, description, images, files) VALUES (?, ?, ?, ?, ?, ?, ?, ? )';
    conector.query(QUERY, [title, date, start_date, finish_date, places_publish, description, JSON.stringify(images), JSON.stringify(files)], (err) => {
        if (err) console.error(err);
        console.log("Done!");
        

        let event = {
            'summary': title, 
            'description': description,
            'start': {
                'dateTime':new Date(start_date+":00").toISOString(),
                'timeZone': 'Europe/Lisbon',
            },
            'end': {
                'dateTime': new Date(finish_date+":00").toISOString(),
                'timeZone': 'Europe/Lisbon',
            }
        }


        insertEvent(event).then((resp) => {
            res.send({ msg: "Added Successfully!" });
        }).catch((err) => {
            console.error(err);
        }); 

     
    })



})





module.exports = router; 