import React, { useState, useEffect } from "react";
import { Grid, Button, Typography, IconButton } from "@material-ui/core";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import NavigateAfterIcon from "@material-ui/icons/NavigateNext";
import { Link } from "react-router-dom";

const pages = {
    APP: 'pages.app',
    JOIN: 'pages.join',
    CREATE: 'pages.create'
}
const buttonKind = {
    BEFORE: 'before',
    AFTER: 'after'
}


export default function Info(props) {

    const [page, setPage] = useState(pages.APP);


    const renderPage = () => {
        console.log('in renderPage()');
        console.log(page);
        switch (page) {
            case pages.APP:
                return (
                    <div>
                        <i> Everyone loves to show off their favorite tunes. </i> <br />
                        With <b> House Party </b>, everyone is the DJ! &#128293; &#128293;<br />
                        Simply create a room and have your guests vote on songs. <br />
                        Using your Spotify account, the queue is dynamically updated and adds songs that reach the vote threshold.
                    </div>
                );            
                case pages.CREATE:
                    return (
                        <div>
                            Select <b> Create A Room </b> to start a new room as a host. <br />
                            Then share your code with your friends.
                        </div>
                    );  
            case pages.JOIN:
                return (
                    <div>
                        As a guest, select <b> Join A Room </b> and supply a room code to enter an existing room. <br />

                    </div>
                );
        }
    }

    const pageScroller = (kind=null) => {
        console.log('in pageScroller()')
        switch (page) {
            case pages.APP:
                setPage(pages.CREATE);
                break;
            case pages.CREATE:
                kind === buttonKind.BEFORE ? setPage(pages.APP) : setPage(pages.JOIN);
                break;
            case pages.JOIN:
                setPage(pages.CREATE);
                break;
        }
    }

    const renderButtons = () => {
        switch (page) {
            case pages.APP:
                return (
                    <IconButton onClick={pageScroller}> 
                        <NavigateAfterIcon />
                    </IconButton>)
            case pages.CREATE:
                return (
                    <div>
                        <IconButton onClick={() => {pageScroller(buttonKind.BEFORE)}}> 
                            <NavigateBeforeIcon />
                        </IconButton>
                        <IconButton onClick={() => {pageScroller(buttonKind.AFTER)}}> 
                            <NavigateAfterIcon />
                        </IconButton>
                    </div>
                );
            case pages.JOIN:
                return (
                    <IconButton onClick={pageScroller}> 
                        <NavigateBeforeIcon />
                    </IconButton>
                );
        }
    }

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography component="h3" variant="h3"> What is House Party? </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="body1">
                    {renderPage()}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                {renderButtons()}
            </Grid>
            <Grid item xs={12} align="center">
                <Button color="secondary" variant="contained" to="/" component={Link}> Back </Button>
            </Grid>
        </Grid>
    );
}