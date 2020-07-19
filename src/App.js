import React, { useEffect } from 'react';
import { Joystick } from 'react-joystick-component';
import { makeStyles } from '@material-ui/core/styles';
import ROSLIB from 'roslib';

const useStyles = makeStyles(() => ({
  controlPanel: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
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
