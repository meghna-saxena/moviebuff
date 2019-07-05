import React from 'react';
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
        this.setState({ loading: true });

        const endpoint = `${config.API_URL}movie/popular?api_key=${config.API_KEY}&language=en-US&page=1`;
        this.fetchItems(endpoint);
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
                })
            })
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

        this.fetchItems(endpoint)
    }

    render() {
        return (
            <div className="rmdb-home">
                <HeroImage />
                <SearchBar />
                <FourColGrid />
                <Spinner />
                <LoadMoreBtn />
            </div>
        )
    }
}

export default Home;