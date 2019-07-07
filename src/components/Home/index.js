import * as React from 'react';
import * as config from '../../config';
import HeroImage from '../elements/HeroImage';
import SearchBar from '../elements/SearchBar';
import FourColGrid from '../elements/FourColGrid';
import MovieThumb from '../elements/MovieThumb'
import LoadMoreBtn from '../elements/LoadMoreBtn';
import Spinner from '../elements/Spinner';
import './Home.css';

class Home extends React.Component {
    state = {
        movies: [],
        heroImage: null,
        loading: false,
        currentPage: 0,
        totalPages: 0,
        searchTerm: ''
    }

    componentDidMount() {
        if (localStorage.getItem('HomeState')) {
            const state = JSON.parse(localStorage.getItem('HomeState'));
            this.setState({ ...state });
        } else {
            this.setState({ loading: true });

            const endpoint = `${config.API_URL}movie/popular?api_key=${config.API_KEY}&language=en-US&page=1`;

            this.fetchItems(endpoint);
        }
    }

    fetchItems = (endpoint) => {
        fetch(endpoint)
            .then(result => result.json()) //convert to json since its raw data
            .then(result => {
                this.setState({
                    movies: [...this.state.movies, ...result.results],
                    heroImage: this.state.heroImage || result.results[0],
                    loading: false,
                    currentPage: result.page,
                    totalPages: result.total_pages
                }, () => {
                    if (this.state.searchTerm === '') {
                        localStorage.setItem('HomeState', JSON.stringify(this.state));
                    }
                })
            })
    }

    searchItems = (searchTerm) => {
        let endpoint = '';
        this.setState({
            movies: [], // clear the old list of movies since now we need new movie which we searched for
            loading: true,
            searchTerm: searchTerm
        })

        if (searchTerm === '') {
            endpoint = `${config.API_URL}movie/popular?api_key=${config.API_KEY}&language=en-US&page=1`;
        } else {
            endpoint = `${config.API_URL}search/movie?api_key=${config.API_KEY}&language=en-US&query=${searchTerm}`;
        }

        this.fetchItems(endpoint);
    }

    loadMoreItems = () => {
        let endpoint = '';
        this.setState({ loading: true });

        if (this.state.searchTerm === '') {
            // fetch popular movies if no search term
            endpoint = `${config.API_URL}movie/popular?api_key=${config.API_KEY}&language=en-US&page=${this.state.currentPage + 1}`;
        } else {
            // fetch the searched term movies
            endpoint = `${config.API_URL}search/movie?api_key=${config.API_KEY}&language=en-US&query${this.state.searchTerm}&page=${this.state.currentPage + 1}`;
        }

        this.fetchItems(endpoint);
    }

    render() {
        const { movies, heroImage, loading, currentPage, totalPages, searchTerm } = this.state;

        return (
            <div className="rmdb-home">
                {heroImage ?
                    <div>
                        <HeroImage
                            image={`${config.IMAGE_BASE_URL}${config.BACKDROP_SIZE}${heroImage.backdrop_path}`}
                            title={heroImage.original_title}
                            text={heroImage.overview}
                        />
                        <SearchBar search={this.searchItems} />
                    </div> : null}
                <div className="rmdb-home-grid">
                    <FourColGrid
                        header={searchTerm ? 'Search Result' : 'Popular Movies'}
                        loading={loading}
                    >
                        {movies.map((element, i) => (
                            <MovieThumb
                                key={i}
                                clickable={true}
                                image={element.poster_path ? `${config.IMAGE_BASE_URL}${config.POSTER_SIZE}${element.poster_path}` : './images/no_image.jpg'}
                                movieId={element.id}
                                movieName={element.original_title}
                            />
                        ))}
                    </FourColGrid>
                    {loading ? <Spinner /> : null}
                    {(currentPage <= totalPages && !loading) ?
                        <LoadMoreBtn text="Load More" onClick={this.loadMoreItems} />
                        : null
                    }
                </div>
            </div>
        )
    }
}

export default Home;