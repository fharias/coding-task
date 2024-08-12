import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export const fetchMovies = createAsyncThunk('movies/fetchMovies', async (url) => {
    const response = await fetch(url)
    return response.json()
})

const moviesSlice = createSlice({
    name: 'movies',
    initialState: { 
        movies: {
            results: [],
            page: 1,
            total_pages: 1
        },
        fetchStatus: '',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchMovies.fulfilled, (state, action) => {
            state.fetchStatus = 'success'
            if (action.payload.page === 1) {
                state.movies = action.payload
            } else {
                state.movies.results = [...state.movies.results, ...action.payload.results]
                state.movies.page = action.payload.page
            }
        }).addCase(fetchMovies.pending, (state) => {
            state.fetchStatus = 'loading'
        }).addCase(fetchMovies.rejected, (state) => {
            state.fetchStatus = 'error'
        })
    }
})

export default moviesSlice