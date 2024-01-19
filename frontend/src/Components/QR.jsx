import React from 'react';
import QRCode from 'qrcode.react';
import Inregistrare from './Inregistrare';

const QR = ({ link }) => {
  return (
    <div>
      <h2>QR Code pentru Inregistrare</h2>
      <p>Link: {link}</p>
      <QRCode value={link}/>
      <Inregistrare/>
    </div>
  );
};

export default QR;