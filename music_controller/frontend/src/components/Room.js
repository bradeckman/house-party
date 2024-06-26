import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Grid, Button, Typography } from '@material-ui/core';
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from './MusicPlayer';


function Room(props) {
    
  const { roomCode } = useParams();
  const initialState = {
    votesToSkip: 2,
    guestCanPause: false,
    isHost: false,
    showSettings: false,
    roomCode: roomCode,
    song: {}
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

  const getCurrentSong = () => {
    fetch('/spotify/current-song')
    .then((response) => {
      if (!response.ok || response.status == 204) {
        return {};
      }
      else {
        return response.json();
      }
    })
    .then((data) => {
      setRoomData({
        ...roomData,
        song: data
      })
    })
  }

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
      console.log(data.status);
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
  useEffect(() => {
    const interval = setInterval(getCurrentSong, 1000)
    return () => {
        clearInterval(interval);
      }
    }
  );

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
      <MusicPlayer {...roomData.song}/>
      {roomData.isHost ? renderSettingsButton() : null}
      <Grid item xs={12} align='center'>
        <Button variant="contained" color="secondary" onClick={leaveRoomButtonPressed}> Leave Room </Button>
      </Grid>
    </Grid>
  )
}

export default Room;
