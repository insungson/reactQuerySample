import React from 'react';

const Starship = ({ starship }) => {
  return (
    <div className="card">
      <h3>{starship.name}</h3>
      <p>Name - {starship.name}</p>
      <p>Model - {starship.model}</p>
    </div>
  );
};

export default Starship;