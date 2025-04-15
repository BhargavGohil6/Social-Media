import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { savePostLocally, fetchLocalPosts, syncPostsWithBackend, deletePostLocally } from './database';
import axios from 'axios';

export const fetchPostsAsync = createAsyncThunk('posts/fetchPosts', async () => {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts'); // Replace with your API
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch posts');
  }
});
export const syncPostsAsync = createAsyncThunk('posts/syncPosts', async () => {
  const localPosts = await fetchLocalPosts();
  const syncedPosts = await syncPostsWithBackend(localPosts);
  return syncedPosts;
});
export const addPostAsync = createAsyncThunk('posts/addPost', async (post) => {
  await savePostLocally(post);
  return post;
});

export const updatePostAsync = createAsyncThunk('posts/updatePost', async (post) => {
  await updatePostLocally(post);
  return post;
});

export const deletePostAsync = createAsyncThunk('posts/deletePost', async (postId) => {
  await deletePostLocally(postId);
  return postId;
});

export const fetchPosts = createAsyncThunk('posts/fetchAll', async () => {
  const localPosts = await fetchLocalPosts();
  return localPosts;
});

export const addPost = createAsyncThunk('posts/add', async (newPost) => {
  await savePostLocally(newPost);
  return newPost;
});

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    likePost: (state, action) => {
      const post = state.posts.find((post) => post.id === action.payload);
      if (post) {
        post.reactions += 1; 
        post.liked = true; 
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    dislikePost: (state, action) => {
      const post = state.posts.find((post) => post.id === action.payload);
      if (post) {
        post.reactions -= 1; 
        post.liked = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPostsAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload; 
      })
      .addCase(fetchPostsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Add the new post to the beginning of the array
      .addCase(addPostAsync.fulfilled, (state, action) => {
        console.log('Added post payload:', action.payload); 
        state.posts.unshift(action.payload); 
      })
      // Update posts with synced data
      .addCase(syncPostsAsync.fulfilled, (state, action) => {
        state.posts = action.payload; 
      })
      .addCase(updatePostAsync.fulfilled, (state, action) => {
        const index = state.posts.findIndex(post => post.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(deletePostAsync.fulfilled, (state, action) => {
        state.posts = state.posts.filter(post => post.id !== action.payload);
      })
       .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload); 
      });
      
  },
});

export const { likePost, dislikePost } = postsSlice.actions;
export default postsSlice.reducer;