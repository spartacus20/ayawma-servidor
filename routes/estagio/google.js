require('dotenv').config();
const express = require('express')
const router = express.Router();
const { google } = require('googleapis');
const credentials = require('./credentials.json');

const SCOPES = 'https://www.googleapis.com/auth/calendar';
const GOOGLE_PROJECT_NUMBER= 707235811586
const GOOGLE_CALENDAR_ID = "e1d26437f741287ac28e5134575f24ce6fe76750ce7d723e3e3e1a61050f118d@group.calendar.google.com"


const jwtClient = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    SCOPES
);
const calendar = google.calendar({
    version: 'v3',
    project: GOOGLE_PROJECT_NUMBER,
    auth: jwtClient
});

router.get('/calendar', (req, res) => {
    console.log(credentials.client_id)
    calendar.events.list({
        auth: jwtClient, 
        calendarId: GOOGLE_CALENDAR_ID,
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
      }, (error, result) => {
        if (error) {
          res.send(JSON.stringify({ error: error }));
        } else {
          if (result.data.items.length) {
            res.send(JSON.stringify({ events: result.data.items }));
          } else {
            res.send(JSON.stringify({ message: 'No upcoming events found.' }));
          }
        }
      });
})


module.exports = router; 

