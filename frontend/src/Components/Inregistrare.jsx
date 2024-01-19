import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const Inregistrare = () => {
    const [participantName, setParticipantName] = useState('');
    const eventId = useParams().eventId;
    console.log(eventId);


  return (
    <div>
        <h2>Register Participant</h2>
        <label>Participant Name:
          <input type="text" value={participantName} onChange={(e) => setParticipantName(e.target.value)} />
          <p>{participantName}</p>
        </label>
        <button onClick={()=>{
            const redirectUrl ="http://localhost:3001/registerQR/"+ eventId;
            window.open(redirectUrl);
        }}>Inregistreaza-te</button>
    </div>
  );
};

export default Inregistrare;
