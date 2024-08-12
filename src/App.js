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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [currentMovieTitle, setCurrentMovieTitle] = useState('');

  const closeModal = () => {
    setIsModalOpen(false)
    setVideoKey(null)
  }
  
  const closeCard = () => {

  }

  const getSearchResults = (query) => {
    if (query !== '') {
      dispatch(fetchMovies(`${ENDPOINT_SEARCH}&query=`+query))
      setSearchParams(createSearchParams({ search: query }))
    } else {
      dispatch(fetchMovies(ENDPOINT_DISCOVER))
      setSearchParams()
    }
  }

  const searchMovies = (query) => {
    navigate('/')
    getSearchResults(query)
  }

  const getMovies = (page = 1) => {
    if (searchQuery) {
      dispatch(fetchMovies(`${ENDPOINT_SEARCH}&query=${searchQuery}&page=${page}`));
    } else {
      dispatch(fetchMovies(`${ENDPOINT_DISCOVER}&page=${page}`));
    }
  }

  const loadMoreMovies = () => {
    setCurrentPage(prevPage => {
      const nextPage = prevPage + 1;
      getMovies(nextPage);
      return nextPage;
    });
  };

  const viewTrailer = async (movie) => {
    await getMovie(movie.id)
    setCurrentMovieTitle(movie.title);
    setIsModalOpen(true)
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
    setCurrentPage(1);
    getMovies(1);
  }, [searchQuery])

  return (
    <div className="App">
      <Header searchMovies={searchMovies} searchParams={searchParams} setSearchParams={setSearchParams} />

      <div className="container">
        <Routes>
          <Route path="/" element={<Movies movies={movies} viewTrailer={viewTrailer} closeCard={closeCard} loadMoreMovies={loadMoreMovies} />} />
          <Route path="/starred" element={<Starred viewTrailer={viewTrailer} />} />
          <Route path="/watch-later" element={<WatchLater viewTrailer={viewTrailer} />} />
          <Route path="*" element={<h1 className="not-found">Page Not Found</h1>} />
        </Routes>
      </div>

      <TrailerModal isOpen={isModalOpen} onClose={closeModal} videoKey={videoKey} movieTitle={currentMovieTitle} />
    </div>
  )
}

export default App