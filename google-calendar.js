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

const insertEvent = async (event) => {
    try {
        let response = await calendar.events.insert({
            auth: jwtClient,
            calendarId: GOOGLE_CALENDAR_ID,
            resource: event
        });
    
        if (response['status'] == 200 && response['statusText'] === 'OK') {
            return response;
        } else {
            return response;
        }
    } catch (error) {
        console.log(`Error at insertEvent --> ${error}`);
        return error;
    }  
}


module.exports = { insertEvent }