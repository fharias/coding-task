import { useEffect, useState } from 'react'
import { Routes, Route, createSearchParams, useSearchParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import 'reactjs-popup/dist/index.css'
import { fetchMovies } from './data/moviesSlice'
import { ENDPOINT_SEARCH, ENDPOINT_DISCOVER, ENDPOINT, API_KEY } from './constants'
import Header from './components/Header'
import Movies from './components/Movies'
import Starred from './components/Starred'
import WatchLater from './components/WatchLater'
import TrailerModal from './components/TrailerModal'
import './app.scss'

const App = () => {
  const state = useSelector((state) => state)
  const { movies } = state  
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('search')
  const [videoKey, setVideoKey] = useState(null)
  const [isOpen, setOpen] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [page, setPage] = useState(1)
  const navigate = useNavigate()
  
  const closeModal = () => {
    setOpen(false)
    setVideoKey(null)
    setSelectedMovie(null)
  }

  const getSearchResults = (query, pageNum = 1) => {
    if (query !== '') {
      dispatch(fetchMovies(`${ENDPOINT_SEARCH}&query=${query}&page=${pageNum}`))
      setSearchParams(createSearchParams({ search: query }))
    } else {
      dispatch(fetchMovies(`${ENDPOINT_DISCOVER}&page=${pageNum}`))
      setSearchParams()
    }
  }

  const searchMovies = (query) => {
    navigate('/')
    setPage(1)
    getSearchResults(query)
  }

  const getMovies = (pageNum = 1) => {
    if (searchQuery) {
      dispatch(fetchMovies(`${ENDPOINT_SEARCH}&query=${searchQuery}&page=${pageNum}`))
    } else {
      dispatch(fetchMovies(`${ENDPOINT_DISCOVER}&page=${pageNum}`))
    }
  }

  const loadMoreMovies = () => {
    const currentPage = movies.movies.page;
    const nextPage = currentPage + 1;
    if (nextPage <= movies.movies.total_pages) {
      if (searchQuery) {
        dispatch(fetchMovies(`${ENDPOINT_SEARCH}&query=${searchQuery}&page=${nextPage}`));
      } else {
        dispatch(fetchMovies(`${ENDPOINT_DISCOVER}&page=${nextPage}`));
      }
    }
  }

  const viewTrailer = async (movie) => {
    if (movie) {
      setSelectedMovie(movie)
      await getMovie(movie.id)
      setOpen(true)
    }
  }

  const getMovie = async (id) => {
    const URL = `${ENDPOINT}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`

    setVideoKey(null)
    const videoData = await fetch(URL)
      .then((response) => response.json())

    if (videoData.videos && videoData.videos.results.length) {
      const trailer = videoData.videos.results.find(vid => vid.type === 'Trailer')
      setVideoKey(trailer ? trailer.key : videoData.videos.results[0].key)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        loadMoreMovies();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [movies.movies.page, movies.movies.total_pages, searchQuery]);

  useEffect(() => {
    getMovies()
  }, [])

  return (
    <div className="App">
      <Header searchMovies={searchMovies} searchParams={searchParams} setSearchParams={setSearchParams} />

      <div className="container">
        <Routes>
          <Route path="/" element={<Movies movies={movies.movies} viewTrailer={viewTrailer} loadMoreMovies={loadMoreMovies} />} />
          <Route path="/starred" element={<Starred viewTrailer={viewTrailer} />} />
          <Route path="/watch-later" element={<WatchLater viewTrailer={viewTrailer} />} />
          <Route path="*" element={<h1 className="not-found">Page Not Found</h1>} />
        </Routes>
        {isOpen && videoKey && (
          <TrailerModal
            videoKey={videoKey}
            onClose={closeModal}
            movie={selectedMovie}
          />
        )}
      </div>
    </div>
  )
}

export default App