import React, { useState, useEffect } from 'react';
import './PageInfo.css';
import personimage from './Image/personspeach.png'
export default function PageInfo({ msg }) {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Function to simulate the typing effect
    const typingEffect = setInterval(() => {
      if (index < msg.length) {
        setDisplayedText((prev) => prev + msg[index]);
        setIndex(index + 1);
      } else {
        clearInterval(typingEffect); // Stop the typing effect when done
      }
    }, 100); // Adjust the typing speed here

    // Cleanup the interval when component is unmounted
    return () => clearInterval(typingEffect);
  }, [index, msg]);

  return (
    <div className="page-info-container">
      <div className="person-icon">
        <img src={personimage} alt="Person" /> {/* Replace with your icon */}
      </div>
      <div className="speech-bubble">
        <p>{displayedText}</p>
      </div>
    </div>
  );
}
