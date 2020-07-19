import React, { useEffect } from 'react';
import { Joystick } from 'react-joystick-component';
import { makeStyles } from '@material-ui/core/styles';
import {
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
} from '@material-ui/core';
import ROSLIB from 'roslib';

const useStyles = makeStyles(() => ({
  controlPanel: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-evenly',
    padding: 16,
  },
}));

// ROS Setup
const ros = new ROSLIB.Ros({
  url: 'ws://168.61.20.118:9090',
});

const cmdDriveInfo = new ROSLIB.Topic({
  ros: ros,
  name: '/drive_info',
  messageType: 'geometry_msgs/Vector3',
});

const cmdMouthInfo = new ROSLIB.Topic({
  ros: ros,
  name: '/mouth_info',
  messageType: 'std_msgs/String',
});

const App = () => {
  const classes = useStyles();

  useEffect(() => {
    // Setup ROS callbacks
    ros.on('connection', function () {
      console.log('Connected to websocket server.');
    });

    ros.on('error', function (error) {
      console.log('Error connecting to websocket server: ', error);
    });

    ros.on('close', function () {
      console.log('Connection to websocket server closed.');
    });
  }, []);

  const handleMove = (data) => {
    const norm = 50; // Max absolute value of coordinates
    const x = data.x / norm;
    const y = data.y / norm;
    const drive_msg = new ROSLIB.Message({
      x: x,
      y: y,
    });
    cmdDriveInfo.publish(drive_msg);
  };

  const handleMouthChange = (event) => {
    const mouth_msg = new ROSLIB.Message({
      data: event.target.value,
    });
    cmdMouthInfo.publish(mouth_msg);
  };

  return (
    <div className={classes.controlPanel}>
      <Joystick
        size={100}
        baseColor="red"
        stickColor="black"
        move={handleMove}
      ></Joystick>
      <FormControl>
        <Select
          autoWidth
          defaultValue="smile"
          label="Adjust Face"
          onChange={handleMouthChange}
        >
          <MenuItem value="shock">Shock</MenuItem>
          <MenuItem value="smile">Smile</MenuItem>
          <MenuItem value="flat">Flat</MenuItem>
          <MenuItem value="sad">Sad</MenuItem>
          <MenuItem value="happy">Happy</MenuItem>
        </Select>
        <FormHelperText>Choose facial expression</FormHelperText>
      </FormControl>
    </div>
  );
};

export default App;
