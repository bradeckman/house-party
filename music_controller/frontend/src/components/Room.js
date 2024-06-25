import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, Button, Typography } from '@material-ui/core';
import CreateRoomPage from "./CreateRoomPage";


function Room(props) {
    
  const { roomCode } = useParams();
  const initialState = {
  votesToSkip: 2,
  guestCanPause: false,
  isHost: false,
  showSettings: false,
  roomCode: roomCode,
  }
  const [roomData, setRoomData] = useState(initialState);
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const navigate = useNavigate();

  const updateShowSettings = (value) => {
    setRoomData((previousState) => ({
      ...previousState,
      showSettings: value, 
    }));
  };

  const renderSettingsButton = () => {
    return (
      <Grid item xs={12} align="center">
        <Button variant="contained" color="primary" onClick={() => updateShowSettings(true)}> Settings </Button>
      </Grid>
    );
  };

  const renderSettings = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <CreateRoomPage 
            update={true} 
            initialVotesToSkip={roomData.votesToSkip} 
            initialGuestCanPause={roomData.guestCanPause} 
            roomCode={roomData.roomCode} 
            updateCallback={getRoomDetails}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <Button variant="contained" color="secondary" onClick={() => updateShowSettings(false)}> Close </Button>
        </Grid>
      </Grid>
    )
  }

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

  const getRoomDetails = () => {
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
        votesToSkip: data.votes_to_skip,
        guestCanPause: data.guest_can_pause,
        isHost: data.is_host,
      })
      if (data.is_host) {
        authenticateSpotify();
      }
    })
  }

  const authenticateSpotify = () => {
    fetch('/spotify/is-authenticated')
    .then((response) => response.json())
    .then((data) => {
      setSpotifyAuthenticated(data.status);
      if (!data.status) {
        fetch('/spotify/get-auth-url')
        .then((response) => response.json())
        .then((data) => {
          window.location.replace(data.url);

        })
      }
    })
  }
  

  useEffect(getRoomDetails,[roomData.roomCode]);

  if (roomData.showSettings) {
    return renderSettings();
  }
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align='center'>
        <Typography variant='h4' component='h4'>
          Code: {roomCode}
        </Typography>
      </Grid>
      <Grid item xs={12} align='center'>
        <Typography variant='h6' component='h6'>
          Votes: {roomData.votesToSkip}
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
      {roomData.isHost ? renderSettingsButton() : null}
      <Grid item xs={12} align='center'>
        <Button variant="contained" color="secondary" onClick={leaveRoomButtonPressed}> Leave Room </Button>
      </Grid>
    </Grid>
  )
}

export default Room;
