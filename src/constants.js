
export const API_KEY = process.env.REACT_APP_API_KEY
export const ENDPOINT = process.env.REACT_APP_ENDPOINT
export const ENDPOINT_DISCOVER = `${ENDPOINT}/discover/movie?api_key=${API_KEY}&sort_by=vote_count.desc`
export const ENDPOINT_SEARCH = `${ENDPOINT}/search/movie?api_key=${API_KEY}`
export const ENDPOINT_MOVIE = `${ENDPOINT}/movie/507086?api_key=${API_KEY}&append_to_response=videos`