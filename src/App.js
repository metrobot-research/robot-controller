import React, { useState } from 'react';
import { Joystick } from 'react-joystick-component';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  controlPanel: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
}));

const App = () => {
  const classes = useStyles();

  const handleMove = (data) => {
    const norm = Math.sqrt(data.x ** 2 + data.y ** 2);
    const x = data.x / norm;
    const y = data.y / norm;
  };

  return (
    <div className={classes.controlPanel}>
      <Joystick
        size={100}
        baseColor="red"
        stickColor="black"
        move={handleMove}
      ></Joystick>
    </div>
  );
};

export default App;
