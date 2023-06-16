require('dotenv').config();
const express = require('express')
const { conector } = require('../../mysql_conector.js')
const { insertEvent } = require('../../google-calendar.js'); 
const router = express.Router();



router.post('/api/formulario/add', (req, res) => {

    const { title, date, start_date, finish_date, places_publish, description, images, files} = req.body

    const QUERY = 'INSERT INTO formulario (title, date, start_date, finish_date, places_publish, description, images, files) VALUES (?, ?, ?, ?, ?, ?, ?, ? )';
    const TIMEOFFSET = '+05:30';
    const dateTimeForCalander = () => {

        let date = new Date();
    
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        if (month < 10) {
            month = `0${month}`;
        }
        let day = date.getDate();
        if (day < 10) {
            day = `0${day}`;
        }
        let hour = date.getHours();
        if (hour < 10) {
            hour = `0${hour}`;
        }
        let minute = date.getMinutes();
        if (minute < 10) {
            minute = `0${minute}`;
        }
    
        let newDateTime = `${year}-${month}-${day}T${hour}:${minute}:00.000${TIMEOFFSET}`;
    
        let event = new Date(Date.parse(newDateTime));
    
        let startDate = event;
        // Delay in end time is 1
        let endDate = new Date(new Date(startDate).setHours(startDate.getHours()+1));
    
        return {
            'start': startDate,
            'end': endDate
        }
    };
    
    let dateTime = dateTimeForCalander();

    conector.query(QUERY, [title, date, start_date, finish_date, places_publish, description, JSON.stringify(images), JSON.stringify(files)], (err) => {
        if (err) console.error(err);
        console.log("Done!");
        

        let event = {
            'summary': title, 
           
            'description': description,
            'start': {
                'dateTime':new Date(start_date).toISOString(),
                'timeZone': 'Europe/Lisbon',
            },
            'end': {
                'dateTime': new Date(finish_date).toISOString(),
                'timeZone': 'Europe/Lisbon',
            }
        }


        const resp = insertEvent(event);
        res.send(resp);
     
    })



})





module.exports = router; 