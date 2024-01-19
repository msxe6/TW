// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QR from './QR';

function App() {
  const [events, setEvents] = useState([]);
  const [eventName, setEventName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [participantName, setParticipantName] = useState('');

  useEffect(() => {
    // Fetch events on component mount
    axios.get('http://localhost:3001/getEvents')
      .then((response) => setEvents(response.data))
      .catch((error) => console.error('Error fetching events:', error));
  }, []);

  const createEvent = () => {
    axios.post('http://localhost:3001/createEvent', { eventName, startDate, endDate })
      .then((response) => setAccessCode(response.data.eventCode))
      .catch((error) => console.error('Error creating event:', error));
  };

  const registerParticipant = (eventId) => {
    axios.post(`http://localhost:3001/registerParticipant/${eventId}`, { participantName, code: accessCode })
      .then(() => console.log('Participant registered successfully'))
      .catch((error) => console.error('Error registering participant:', error));
  };

  const exportParticipants = (eventId) => {
    axios.post(`http://localhost:3001/exportParticipants/${eventId}`)
      .then(() => console.log('Participants exported successfully'))
      .catch((error) => console.error('Error exporting participants:', error));
  };

  const paginaQR = (eventId) => {
    const redirectUrl = `http://localhost:3001/qr/${eventId}`;
    window.open(redirectUrl)
    return(
      <div>
        <QR link={redirectUrl}/>
      </div>
    ) 
  };

  return (
    <div className="App">
      <h1>Event Management</h1>

      <div>
        <h2>Create Event</h2>
        <label>Event Name:
          <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} />
        </label>
        <label>Start Date:
          <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </label>
        <label>End Date:
          <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </label>
        <button onClick={createEvent}>Creeaza Eveniment</button>
        {accessCode && <p>Access Code: {accessCode}</p>}
      </div>

      <div>
        <h2>Register Participant</h2>
        <label>Participant Name:
          <input type="text" value={participantName} onChange={(e) => setParticipantName(e.target.value)} />
        </label>
        <label>Access Code:
          <input type="text" value={accessCode} onChange={(e) => {setAccessCode(e.target.value); console.log(accessCode)}} />
        </label>
        <button onClick={() => {
          try{
            const index = events.findIndex(obj => obj.eventCode === accessCode);
            registerParticipant(events[index].eventId)
          }
          catch(err){
            console.log(err)
          }
        }}>Inregistrare Manuala Participant</button>
      </div>

      <div>
        <h2>Events</h2>
        {events.map((event) => (
          <div key={event.eventId}>
            <p>{event.eventName}</p>
            <p>Start Date: {event.startDate}</p>
            <p>End Date: {event.endDate}</p>
            <button onClick={() => {paginaQR(event.eventId)}}>Inregistrare Participant</button>
            <button onClick={() => exportParticipants(event.eventId)}>Exportare Participanti</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
