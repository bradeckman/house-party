import React, { useState, useEffect } from "react";
import { Grid, Button, Typography, IconButton } from "@material-ui/core";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateAfterIcon from "@material-ui/icons/NavigateNext";
import { Link } from "react-router-dom";

const pages = {
    JOIN: 'pages.join',
    CREATE: 'pages.create'
}


export default function Info(props) {

    const [page, setPage] = useState(pages.JOIN);
    
    const joinInfo = () => {
        return (
            <div>
                Select <b> Join A Room </b> and supply a room code to enter an existing room 
            </div>
        );
    }
    const createInfo = () => {
        return (
            <div>
                Select <b> Create A Room </b> to start a new room 
            </div>
        );    }

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4"> What is House Party? </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="body1">
                    { page === pages.JOIN ? joinInfo() : createInfo() }
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <IconButton onClick={() => {page === pages.CREATE ? setPage(pages.JOIN) : setPage(pages.CREATE)}}> 
                {page === pages.CREATE ? <NavigateBeforeIcon /> : <NavigateAfterIcon />}
                </IconButton>
            </Grid>
            <Grid item xs={12} align="center">
                <Button color="secondary" variant="contained" to="/" component={Link}> Back </Button>
            </Grid>
        </Grid>
    );
}