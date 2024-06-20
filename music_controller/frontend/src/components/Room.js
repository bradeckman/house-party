import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, Button, Typography } from '@material-ui/core';


function Room(props) {
    
  const { roomCode } = useParams();
  const initialState = {
  votesToSKip: 2,
  guestCanPause: false,
  isHost: false
  }
  const [roomData, setRoomData] = useState(initialState);
  const navigate = useNavigate();

  const leaveRoomButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: {"Content-Type": "application/json"}
    };
    fetch("/api/leave-room", requestOptions)
    .then((response) => {
      props.leaveRoomCallback();
      navigate('/');
    });
  };

  useEffect(() => {
    fetch("/api/get-room" + "?code=" + roomCode)
      .then(res => {
        if (!res.ok) {
          props.leaveRoomCallback();
          navigate('/');
        }
        return res.json();
      })
      .then(data => {
        setRoomData({
          ...roomData, 
          votesToSKip: data.votes_to_skip,
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host,
        })
      })
  },[roomCode,setRoomData])

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align='center'>
        <Typography variant='h4' component='h4'>
          Code: {roomCode}
        </Typography>
      </Grid>
      <Grid item xs={12} align='center'>
        <Typography variant='h6' component='h6'>
          Votes: {roomData.votesToSKip}
        </Typography>
      </Grid>
      <Grid item xs={12} align='center'>
        <Typography variant='h6' component='h6'>
          Guest Can Pause: {roomData.guestCanPause.toString()}
        </Typography>
      </Grid>
      <Grid item xs={12} align='center'>
        <Typography variant='h6' component='h6'>
          Host: {roomData.isHost.toString()}
        </Typography>      
      </Grid>
      <Grid item xs={12} align='center'>
        <Button variant="contained" color="secondary" onClick={leaveRoomButtonPressed}> Leave Room </Button>
      </Grid>
    </Grid>
  )
}

export default Room;
