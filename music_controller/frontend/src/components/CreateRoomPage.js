import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { Link, useNavigate } from "react-router-dom";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Collapse } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";


function CreateRoomPage({
    initialVotesToSkip=2,
    initialGuestCanPause=true,
    update=false,
    roomCode=null,
    updateCallback=()=>{}
}) {

    const [guestCanPause, setGuestCanPause] = useState(initialGuestCanPause);
    const [votesToSkip, setvotesToSkip] = useState(initialVotesToSkip);
    const [succesMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    const handleVotesChange = (event) => {
        setvotesToSkip(event.target.value)
    }

    const handleGuestCanPauseChange = (event) => {
        setGuestCanPause(event.target.value === 'true' ? true : false);
    }

    const handleRoomButtonPress = () => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                votes_to_skip: votesToSkip,
                guest_can_pause: guestCanPause
            })
        };
        fetch('/api/create-room', requestOptions)
        .then((response) => response.json())
        .then((data) => navigate('/room/' + data.code));
    }

    const renderCreateButtons = () => {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" onClick={handleRoomButtonPress}>
                        Create A Room
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="secondary" variant="contained" to="/" component={Link}>
                        Back
                    </Button>
                </Grid>
            </Grid>
        );
    }

    const renderUpdateButtons = () => {
        return (
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" onClick={handleUpdateButtonPressed}>
                        Update Room
                    </Button>
                </Grid>
        );
    }

    const handleUpdateButtonPressed = () => {
        const requestOptions = {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                votes_to_skip: votesToSkip,
                guest_can_pause: guestCanPause,
                code: roomCode
            })
        };
        fetch('/api/update-room', requestOptions)
        .then((response) => {
            if (response.ok) {
                setSuccessMsg("Room updated successfully!")
            }
            else {
                setErrorMsg("Error updating room...")
            }
            updateCallback();
        });
    }

    const pageTitle = update ? "Update Room" : " Create A Room";

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Collapse in={succesMsg != "" || errorMsg != ""}>
                    {succesMsg != "" ? (
                        <Alert severity="success" onClose={() => {setSuccessMsg=""}}> {succesMsg} </Alert>
                    ) : (
                        <Alert severity="error" onClose={() => {setErrorMsg=""}}> {errorMsg} </Alert>
                    )}
                </Collapse>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4"> {pageTitle} </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl component="fieldset">
                    <FormHelperText>
                        <div align="center">
                            Guest Control of Playback State
                        </div>
                    </FormHelperText>
                    <RadioGroup 
                        row 
                        defaultValue={guestCanPause.toString()}
                        onChange={handleGuestCanPauseChange}
                    >
                        <FormControlLabel 
                            value="true" 
                            control={<Radio color="primary"/>} 
                            label="Play/Pause" 
                            labelPlacement="bottom"
                        />
                        <FormControlLabel 
                            value="false" 
                            control={<Radio color="secondary"/>} 
                            label="No Control" 
                            labelPlacement="bottom"
                        />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl>
                    <TextField 
                        required={true} 
                        type="number"
                        onChange={handleVotesChange}
                        defaultValue={votesToSkip}
                        inputProps={{
                            min: 1,
                            style: {textAlign: "center"}
                        }}
                    />
                    <FormHelperText>
                        <div align="center">
                            Votes Required to Skip Song
                        </div>
                    </FormHelperText>
                </FormControl>
            </Grid>
            {update ? renderUpdateButtons() : renderCreateButtons()}
        </Grid>
    );
}

export default CreateRoomPage;