// import { useNavigate } from 'react-router-dom';
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth/index'

// import React, { useContext, useState, useRef } from 'react';
import React, { useContext } from 'react';
// import { Typography, TextField, Button, ListItemText } from '@mui/material';
import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
import Card from '@mui/material/Card';
// import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';

import Grid from '@mui/material/Grid';

import CardContent from '@mui/material/CardContent';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import IconButton from '@mui/material/IconButton';


function Comment(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    // const [comment, setComment] = useState('');
    const map = store.currentMap;
    let userName = "";
    if (auth.user) {
        userName = auth.user.firstName + " " + auth.user.lastName;
    }
    let disabled = false;


    let StyledIconButton = styled(IconButton)({
        color: "black",
        '&:hover': {
            opacity: 1,
            transition: "color 0.7s, transform 0.7s",
            transform: 'scale(1.1)',
            color: '#FDE66B'
        }
    });

    // const navigate = useNavigate();

    function handleUpdateComments(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            map.comments.push([(auth.user ? userName : ""), event.target.value]);

            store.updateCurrentList(map);
            event.target.value = "";
        }
    }

    function handleCloseComment() {
        store.closeComment();
        console.log(store.openComment);
    }

    if (!auth.user) {
        disabled = true;
    }

    // Hardcode the comment
    let comments = [["Annie", "I live your map!!!"], ["Joe", "The map looks nice."], ["John", "Beautiful map!"], ["AJA", "Amazing work!"],
    ["Annie", "Second comment."], ["Joe", "The map looks nice2."], ["John", "Beautiful map2!"], ["AJA", "Amazing work2!"],
    ["Annie", "Third comment."], ["Joe", "The map looks nice3."], ["John", "Beautiful map3!"],
    ["Annie", "Fourth comment"], ["Joe", "The map looks nice4."], ["John", "Beautiful map4!"],
    ];
    let reversed = [];
    for (let k = comments.length - 1; k >= 0; k--) {
        reversed.push(comments[k]);
    }
    //Make sure newest comments are at the top by reversing the comments list
    // let reversed = [];
    // if (map) {
    //     for (let k = map.comments.length - 1; k >= 0; k--) {
    //         reversed.push(map.comments[k]);
    //     }
    //     if (map.published.isPublished === false) {
    //         disabled = true;
    //     }
    // }
    // if (!map) {
    //     disabled = true;
    // }
    return (

        <Card sx={{
            width: '102%',
            position: 'relative',
            top: '60px',
            backgroundColor: '#D9D9D9',
            height: '960px',

        }}>
            <CardContent>
                <StyledIconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    sx={{ mr: 2 }}
                    // disabled={disabled}
                    onClick={() => handleCloseComment()}
                >
                    <CloseOutlinedIcon
                        style={{ fontSize: "25px", float: "left" }}

                    ></CloseOutlinedIcon>
                </StyledIconButton>

                <Grid container spacing={1} style={{
                    top: '300px',
                    left: '10px',
                    height: '700px',
                    overflowY: 'auto',

                }}>

                    {
                        reversed.map((comment, i) => (

                            <Grid item key={i} xs={12}
                                sx={{
         
                                    borderRadius: "12px",
                                    backgroundColor: "#ECF2FF",
                                    margin: '10px',
                                    fontsize: "8pt",
                                    // padding: "10px 10px",
                                    marginTop: '1px',

                                }}
                            >
                                <strong>
                                    <u id="commentName" style={{ color: "#756060" }}>{comment[0]}</u>
                                </strong><br />
                                <div id="commentText" style={{ fontSize: '20px' }}>{comment[1]}</div>
                            </Grid>
                        ))
                    }
                </Grid>
            </CardContent>
            <CardActions>
                {
                    auth && auth.type !== "guest" ?

                        <Box
                            component="form"
                            sx={{
                                width: '95%',
                                position: 'sticky',
                                left: '20px',
                                right: '20px',
                            }}
                            noValidate
                            autoComplete="off"
                        >

                            <TextField
                                sx={{
                                    backgroundColor: "#ECECEC",
                                    // top: '320px',
                                    top: '50px',

                                    // borderRadius: "20px",
                                    // borderColor: '#ffe5ec',
                                }}
                                fullWidth
                                rows={2}
                                label="Add a comment..."
                                disabled={disabled}
                                onKeyPress={(event) => handleUpdateComments(event)}
                            />
                        </Box>
                        :
                        <Box ></Box>
                }
            </CardActions>
        </Card>

    );
};

export default Comment;