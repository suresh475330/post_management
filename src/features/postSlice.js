import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = "https://jsonplaceholder.typicode.com/posts";
const localPosts = JSON.parse(window.localStorage.getItem("posts"));
const isPosts = JSON.parse(window.localStorage.getItem("isPosts"));



const initialState = {
    posts: localPosts ? localPosts : [],
    isPosts: isPosts ? true : false,
    postsStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed',
    postsError: null,

    comments: [],
    commentsStatus: 'idle',
    commentsError: null,
    commentsOpen: false,

    postdDeleteCount: 0,

    searchQuery: localStorage.getItem('searchInput') || ''


}

export const getPosts = createAsyncThunk("post/getPosts", async () => {
    const res = await axios.get(baseUrl);
    return res.data;
})

export const getComments = createAsyncThunk("post/getComments", async (id) => {
    const res = await axios.get(`${baseUrl}/${id}/comments`);
    return res.data;
})

export const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        reset: (state, action) => {
            window.localStorage.removeItem("posts");
            window.localStorage.removeItem("isPosts");
            window.localStorage.removeItem("searchInput");
            state.posts = [];
            state.isPosts = false;
            state.postdDeleteCount = 0;
            state.searchQuery = '';
        },
        deletePost: (state, action) => {
            state.posts = state.posts.filter((post) => { return post.id !== action.payload })
            window.localStorage.setItem("posts", JSON.stringify(state.posts));
            state.postdDeleteCount = state.postdDeleteCount + 1;
        },
        handleCommentClose: (state, action) => {
            state.commentsOpen = false;
        },
        handleCommentOpen: (state, action) => {
            state.commentsOpen = true;
        },
        updateSearchQuery: (state, action) => {

            function isInputValid(input) {
                // Use a regular expression to check for spaces
                const spaceRegex = /\s/;
                return !spaceRegex.test(input);
            }

            if (isInputValid(action.payload)) {
                state.searchQuery = action.payload;
              }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPosts.pending, (state, action) => {
                state.postsStatus = "loading";
            })
            .addCase(getPosts.fulfilled, (state, action) => {
                state.postsStatus = "succeeded";
                state.posts = action.payload;
                state.isPosts = true;
                window.localStorage.setItem("isPosts", true);
                window.localStorage.setItem("posts", JSON.stringify(action.payload));
            })
            .addCase(getPosts.rejected, (state, action) => {
                state.postsStatus = "failed";
                state.postsError = action.error;
            })
            .addCase(getComments.pending, (state, action) => {
                state.commentsStatus = "loading";
            })
            .addCase(getComments.fulfilled, (state, action) => {
                state.commentsStatus = "succeeded";
                state.comments = action.payload;
                state.commentsOpen = true;
            })
            .addCase(getComments.rejected, (state, action) => {
                state.commentsStatus = "failed";
                state.commentsError = action.error;
            })
    }
})


// this is for dispatch
export const { reset, deletePost, handleCommentClose, handleCommentOpen, updateSearchQuery } = postSlice.actions;

// this is for configureStore
export default postSlice.reducer;