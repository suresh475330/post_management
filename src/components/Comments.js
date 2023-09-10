
import { useDispatch, useSelector } from 'react-redux';
import { handleCommentClose } from '../features/postSlice';

import * as React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { Avatar, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { blue } from '@mui/material/colors';
import CircularProgress from '@mui/material/CircularProgress';


export function LoadingComments() {

  return (
    <div style={{ position : "relative", }}>
      <CircularProgress sx={{ color: "#1E3264", width: "5rem", position : "absolute",top : "50%", left : "50%", transform : "translate(-50%, -50%)" }} />
    </div>
  );
}

function ErrorMsg({ msg }) {
    return (
      <div style={{ paddingTop: "1rem" }}>
        <h1 style={{ textAlign: "center", color: "#FFFFFF" }} >{msg}</h1>
      </div>
    )
  }

export default function Comments() {

    const { comments,commentsOpen,commentsStatus,commentsError } = useSelector((state) => state.post);
    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(handleCommentClose());
    };

    if(commentsStatus === "loading"){
        return <LoadingComments />
    }

    if(commentsStatus === "failed"){
        return <ErrorMsg msg={commentsError} />
    }


    return (
        <div>
            <Dialog onClose={handleClose} open={commentsOpen}>
                <DialogTitle> Comments </DialogTitle>
                <List sx={{ pt: 0 }}>

                    {comments.map((itemData) => (
                        <ListItem disableGutters key={itemData.id}>
                            <ListItemButton >
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                                        <PersonIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={itemData.email} secondary={itemData.body} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Dialog>
        </div>
    );
}

