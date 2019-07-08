import * as React from 'react';
import * as config from '../../config';
import HeroImage from '../elements/HeroImage';
import SearchBar from '../elements/SearchBar';
import FourColGrid from '../elements/FourColGrid';
import MovieThumb from '../elements/MovieThumb'
import LoadMoreBtn from '../elements/LoadMoreBtn';
import Spinner from '../elements/Spinner';
import './Home.css';

const Home = () => {
    const [state, setState] = React.useState({ movies: [] });
    const [isLoading, setIsLoading] = React.useState(false);
    const [isError, setIsError] = React.useState(false);

    const fetchMovies = async endpoint => {
        setIsError(false);
        setIsLoading(true);

        // use URLSearchParams to get search params
        const params = new URLSearchParams(endpoint);
        if (!params.get('page')) { // if last page we wont have this param so no more loading movies
            setState(prevState => ({
                ...prevState,
                movies: [],
                searchTerm: params.get('query')
            }))
        }

        try {
            const result = await (await fetch(endpoint)).json();
            setState(prevState => ({
                ...prevState,
                movies: [...prevState.movies, ...result.results],
                heroImage: prevState.heroImage || result.results[0],
                currentPage: result.page,
                totalPages: result.total_pages
            }))
        }
        catch (e) {
            setIsError(true);
        }

        setIsLoading(false);
    }

    // run once on mount
    React.useEffect(() => {
        fetchMovies(createEndpoint("movie/popular", false, ""));
    }, [])

    const createEndpoint = (type, loadMore, searchTerm) => {
        const { currentPage } = state;

        return `${config.API_URL}${type}?api_key=${config.API_KEY}&
                page=${loadMore && currentPage + 1}&query=${searchTerm}`;
    }

    const updateItems = (loadMore, searchTerm) => {
        fetchMovies(
            !state.searchTerm
                ? createEndpoint("movie/popular", loadMore, "")
                : createEndpoint("search/movie", loadMore, state.searchTerm)
        );
    }

    const getHeaderText = () => {
        const { movies, searchTerm } = state;

        if (searchTerm && movies.length >= 1) {
            return 'Search Result'
        } else if (searchTerm) {
            return 'No movie found'
        } else {
            return 'Popular Movies'
        }
    }

    return (
        <div className="rmdb-home" >
            {state.heroImage && !state.searchTerm ?
                <div>
                    <HeroImage
                        image={`${config.IMAGE_BASE_URL}${config.BACKDROP_SIZE}${state.heroImage.backdrop_path}`}
                        title={state.heroImage.original_title}
                        text={state.heroImage.overview}
                    />
                </div> : null}
            <SearchBar search={updateItems} />
            <div className="rmdb-home-grid">
                <FourColGrid
                    header={getHeaderText()}
                    loading={isLoading}
                >
                    {state.movies.map((element, i) => (
                        <MovieThumb
                            key={i}
                            clickable={true}
                            image={element.poster_path ? `${config.IMAGE_BASE_URL}${config.POSTER_SIZE}${element.poster_path}` : './images/no_image.jpg'}
                            movieId={element.id}
                            movieName={element.original_title}
                        />
                    ))}
                </FourColGrid>
                {isLoading ? <Spinner /> : null}
                {(state.currentPage < state.totalPages && !isLoading && state.movies.length >= 1) ?
                    <LoadMoreBtn text="Load More" onClick={updateItems} />
                    : null
                }
            </div>
        </div >
    )
}

export default Home;