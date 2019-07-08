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

            // const popularMovieEndpoint = this.createEndpoint("movie/popular");
            // popularMovieEndpoint(false)("")
            this.fetchItems(this.createEndpoint("movie/popular", false, ""));
        }
    }

    fetchItems = async (endpoint) => {
        const { movies, heroImage, searchTerm } = this.state;

        const result = await (await fetch(endpoint)).json();

        try {
            if (result.results.length >= 1) {
                this.setState({
                    movies: [...movies, ...result.results],
                    heroImage: heroImage || result.results[0],
                    loading: false,
                    currentPage: result.page,
                    totalPages: result.total_pages
                }, () => {
                    if (searchTerm === '') {
                        localStorage.setItem('HomeState', JSON.stringify(this.state));
                    }
                })
            } else {
                this.setState({ loading: false });
            }
        }
        catch (error) {
            console.error('Error:', error);
        }
    }

    // fetchItems = (endpoint) => {
    //     const { movies, heroImage, searchTerm } = this.state;

    //     fetch(endpoint)
    //         .then(result => result.json()) //convert to json since its raw data
    //         .then(result => {
    //             if (result.results.length >= 1) {
    //                 this.setState({
    //                     movies: [...movies, ...result.results],
    //                     heroImage: heroImage || result.results[0],
    //                     loading: false,
    //                     currentPage: result.page,
    //                     totalPages: result.total_pages
    //                 }, () => {
    //                     if (searchTerm === '') {
    //                         localStorage.setItem('HomeState', JSON.stringify(this.state));
    //                     }
    //                 })
    //             } else {
    //                 this.setState({ loading: false });
    //             }
    //         })
    //         .catch(error => console.error("Error:", error));
    // }

    // curry method
    // createEndpoint = type => {
    //     return loadMore => {
    //         return searchTerm => {
    //             ...
    //         }
    //     }
    // }

    // createEndpoint = (type, loadMore, searchTerm) => {
    //     const { currentPage } = this.state;

    //     return `${config.API_URL}${type}?api_key=${config.API_KEY}&language=en-US&
    //             page=${loadMore && currentPage + 1}&query=${searchTerm}`;
    // }

    createEndpoint = (type, loadMore, searchTerm) => {
        console.log('inside funcc', type, loadMore, searchTerm);
        const { currentPage } = this.state;

        return `${config.API_URL}${type}?api_key=${config.API_KEY}&language=en-US&
                page=${loadMore && currentPage + 1}&query=${searchTerm}`;
    }

    updateItems = (loadMore, searchTerm) => {
        // const searchedMovieEndpoint = this.createEndpoint("search/movie");
        // const popularMovieEndpoint = this.createEndpoint("movie/popular");

        this.setState({
            movies: loadMore ? [...this.state.movies] : [],
            loading: true,
            searchTerm: loadMore ? this.state.searchTerm : searchTerm
        }, () => {
            this.fetchItems(
                !this.state.searchTerm
                    ? this.createEndpoint("movie/popular", loadMore, "")
                    : this.createEndpoint("search/movie", loadMore, this.state.searchTerm)
            );
        })
    }

    // searchItems = (searchTerm) => {
    //     let endpoint = '';
    //     this.setState({
    //         movies: [], // clear the old list of movies since now we need new movie which we searched for
    //         loading: true,
    //         searchTerm: searchTerm
    //     })

    //     if (searchTerm === '') {
    //         endpoint = `${config.API_URL}movie/popular?api_key=${config.API_KEY}&language=en-US&page=1`;
    //     } else {
    //         endpoint = `${config.API_URL}search/movie?api_key=${config.API_KEY}&language=en-US&query=${searchTerm}`;
    //     }

    //     this.fetchItems(endpoint);
    // }

    // loadMoreItems = () => {
    //     let endpoint = '';
    //     this.setState({ loading: true });

    //     if (this.state.searchTerm === '') {
    //         // fetch popular movies if no search term
    //         endpoint = `${config.API_URL}movie/popular?api_key=${config.API_KEY}&language=en-US&page=${this.state.currentPage + 1}`;
    //     } else {
    //         // fetch the searched term movies
    //         endpoint = `${config.API_URL}search/movie?api_key=${config.API_KEY}&language=en-US&query${this.state.searchTerm}&page=${this.state.currentPage + 1}`;
    //     }

    //     this.fetchItems(endpoint);
    // }

    getHeaderText = () => {
        const { movies, searchTerm } = this.state;

        if (searchTerm && movies.length >= 1) {
            return 'Search Result'
        } else if (searchTerm) {
            return 'No movie found'
        } else {
            return 'Popular Movies'
        }
    }

    render() {
        const { movies, heroImage, loading, currentPage, totalPages, searchTerm } = this.state;

        return (
            <div className="rmdb-home" >
                {heroImage && !searchTerm ?
                    <div>
                        <HeroImage
                            image={`${config.IMAGE_BASE_URL}${config.BACKDROP_SIZE}${heroImage.backdrop_path}`}
                            title={heroImage.original_title}
                            text={heroImage.overview}
                        />
                    </div> : null}
                <SearchBar search={this.updateItems} />
                <div className="rmdb-home-grid">
                    <FourColGrid
                        header={this.getHeaderText()}
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
                    {(currentPage < totalPages && !loading && movies.length >= 1) ?
                        <LoadMoreBtn text="Load More" onClick={this.updateItems} />
                        : null
                    }
                </div>
            </div >
        )
    }
}

export default Home;