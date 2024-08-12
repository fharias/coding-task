import Movie from './Movie'
import useInfiniteScroll from '../hooks/useInfiniteScroll'
import '../styles/movies.scss'

const Movies = ({ movies, viewTrailer, closeCard, loadMoreMovies }) => {
    const [isFetching, setIsFetching] = useInfiniteScroll(loadMoreMovies);

    return (
        <div className="movies-grid" data-testid="movies">
            {movies.movies.results?.map((movie, index) => (
                <div key={`${movie.id}-${index}`} className={`fade-in-movie ${index >= movies.movies.results.length - 20 ? 'new-movie' : ''}`}>
                    <Movie 
                        movie={movie} 
                        viewTrailer={viewTrailer}
                        closeCard={closeCard}
                    />
                </div>
            ))}
            {isFetching && <div className="loading">Loading more movies...</div>}
        </div>
    )
}

export default Movies