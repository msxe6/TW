// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const cors = require('cors')
const QRCode = require('qrcode');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

let events = [];

const newEvent ={eventId:'c70850a1-1751-43a4-a119-8f8630b00f8c',eventCode:'9b8cbdb2-ae0e-43c9-a6e0-213e9a02865d'}
events.push(newEvent)

app.post('/createEvent', (req, res) => {
  const { eventName, startDate, endDate } = req.body;
  const eventId = uuidv4();
  const eventCode = uuidv4();

  const newEvent = {
    eventId,
    eventName,
    startDate,
    endDate,
    eventCode,
    participants: [],
  };

  events.push(newEvent);

  res.status(201).json(newEvent);
});

app.get('/getEvents', (req, res) => {
  res.json(events);
});

app.post('/registerQR/:eventId', (req,res) =>{
  const eventId = req.params.eventId;
  const event = events.find((e) => e.eventId === eventId);

  event.participants.push({ participantName, timestamp: new Date() });
  res.status(200).json({ success: true });
})

app.get('/QR/:eventId', (req, res) => {
    const eventId = req.params.eventId.toString();
  
    // Generate a QR code for the event ID
    QRCode.toDataURL(`http://localhost:3000/inregistrare/${eventId}`, (err, url) => {
      if (err) {
        console.error('Error generating QR code:', err);
        return res.status(500).send('Internal Server Error');
      }
  
      // Send the HTML response with the QR code and example link
      const htmlResponse = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Cod QR</title>
        </head>
        <body>
          <img src="${url}" alt="QR Code">
          <p>Example Link: <a href="http://localhost:3000/inregistrare/${eventId}" target="_blank">
          http://localhost:3000/inregistrare/${eventId}</a></p>
        </body>
        </html>`;
  
      res.send(htmlResponse);
    });
  });

  app.get('/inregistrare/:eventId', (req, res) => {
    const id = req.params.eventId.toString();
    console.log(id)
    let cod = "nu a fost gasit acest id";
    for (const e in events){
      console.log(events[e].eventId)
      if( events[e].eventId === id){
        cod = events[e].eventCode;
      }
    }
    console.log(cod)

    let nume="";

    const setNume = (e) => {
      nume = e;
    }
  
    const htmlResponse = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Inregistrare</title>
      </head>
      <body>
        <h1>SALUT,merge</h1>
      </body>
      </html>`;

    res.send(htmlResponse);
    });

app.post('/registerParticipant/:eventId', (req, res) => {
  const eventId = req.params.eventId;
  const { participantName, code } = req.body;

  const event = events.find((e) => e.eventId === eventId);

  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  if (event.eventCode !== code) {
    return res.status(403).json({ error: 'Invalid access code' });
  }

  event.participants.push({ participantName, timestamp: new Date() });

  res.status(200).json({ success: true });
});

app.post('/exportParticipants/:eventId', (req, res) => {
  const eventId = req.params.eventId;
  const event = events.find((e) => e.eventId === eventId);

  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  const csvWriter = createCsvWriter({
    path: `csvs/participants_${eventId}.csv`,
    header: [{ id: 'participantName', title: 'Participant Name' }, { id: 'timestamp', title: 'Timestamp' }],
  });

  csvWriter.writeRecords(event.participants)
    .then(() => res.status(200).json({ success: true }))
    .catch((err) => res.status(500).json({ error: 'Error exporting participants', details: err }));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
