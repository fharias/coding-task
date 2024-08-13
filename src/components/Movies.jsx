import React, { useCallback, useEffect } from 'react';
import Movie from './Movie';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import '../styles/movies.scss';

const Movies = ({ movies, viewTrailer, loadMoreMovies }) => {
    const fetchMoreListItems = useCallback(() => {
        loadMoreMovies();
    }, [loadMoreMovies]);

    const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreListItems);

    useEffect(() => {
        if (!isFetching) return;
        fetchMoreListItems();
        setIsFetching(false);
    }, [isFetching, fetchMoreListItems]);

    return (
        <div className="wrapper" data-testid="movies">
            {movies.results?.map((movie, index) => (
                <Movie
                    movie={movie}
                    key={`${movie.id}-${index}`}
                    viewTrailer={viewTrailer}
                />
            ))}
            {isFetching && <div>Loading more movies...</div>}
        </div>
    );
};

export default Movies;