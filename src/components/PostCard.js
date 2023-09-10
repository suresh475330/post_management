import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import { CardActions, Grid, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Container } from "@mui/material"
import Loading from './Loading';
import { useSelector, useDispatch } from 'react-redux';
import { getPosts, deletePost, getComments } from '../features/postSlice';
import { useEffect } from 'react';
import Fuse from 'fuse.js';

function ErrorMsg({ msg }) {
  return (
    <div style={{ paddingTop: "1rem" }}>
      <h1 style={{ textAlign: "center", color: "#FFFFFF" }} >{msg}</h1>
    </div>
  )
}

export default function PostCard() {

  const { posts, postsStatus, postsError, isPosts, searchQuery } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isPosts && posts.length === 0) {
      dispatch(getPosts());
    }
  }, [isPosts, posts,dispatch])


  function handleDelete(id) {
    dispatch(deletePost(id))
  }

  const options = {
    keys: [
      "title",
      "body"
    ],
    includeScore: true
  };
  const fuse = new Fuse(posts, options);
  const results = fuse.search(searchQuery)
  const filterResult = searchQuery ? results.map(result => result.item) : posts;

  return (
    <Container maxWidth="md" sx={{ paddingTop: "2rem", paddingBottom: "2rem" }}>

      {postsStatus === "failed" && <ErrorMsg msg={postsError} />}

      {postsStatus === "loading" ? (
        <Loading />
      ) : (
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>

          {filterResult.length > 0 && filterResult.map((cardItems) => {
            return (

              <Grid key={cardItems.id} item xs={4} sm={4} md={4} >
                <Card sx={{ maxWidth: 345 }}  >
                  <CardHeader
                    onClick={() => dispatch(getComments(cardItems.id))} sx={{ cursor: "pointer" }}
                    avatar={
                      <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                        {cardItems.userId}
                      </Avatar>
                    }
                    title={cardItems.title} />


                  <CardContent onClick={() => dispatch(getComments(cardItems.id))} sx={{ cursor: "pointer" }}>
                    <Typography variant="body2" color="text.secondary">
                      {cardItems.body}
                    </Typography>
                  </CardContent>
                  <CardActions >
                    <IconButton aria-label="Delete" onClick={() => handleDelete(cardItems.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>

                </Card>
              </ Grid>
            )
          })}

        </Grid>
      )}


    </Container>

  )
}