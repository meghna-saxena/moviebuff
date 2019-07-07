import * as React from 'react';
import * as config from '../../config';
import Navigation from '../elements/Navigation';
import MovieInfo from '../elements/MovieInfo';
import MovieInfoBar from '../elements/MovieInfoBar';
import FourColGrid from '../elements/FourColGrid';
import Actor from '../elements/Actor';
import Spinner from '../elements/Spinner';
import './Movie.css';

class Movie extends React.Component {
    state = {
        movie: null,
        actors: null,
        directors: [],
        loading: false
    }

    componentDidMount() {
        if (localStorage.getItem(`${this.props.match.params.movieId}`)) {
            const state = JSON.parse(localStorage.getItem(`${this.props.match.params.movieId}`));

            this.setState({ ...state });
        } else {
            this.setState({ loading: true });

            // fetch movie
            const endpoint = `${config.API_URL}movie/${this.props.match.params.movieId}?api_key=${config.API_KEY}&language=en-US`;

            this.fetchItems(endpoint)
        }
    }

    fetchItems = async (endpoint) => {
        const { movieId } = this.props.match.params;

        try {
            const result = await (await fetch(endpoint)).json();

            if (result.status_code) { // means movie is not found
                this.setState({ loading: false });
            } else {
                this.setState({ movie: result });
                // after movie is fetched; fetch actors in setState callback function
                const creditsEndpoint = `${config.API_URL}movie/${this.props.match.params.movieId}/credits?api_key=${config.API_KEY}`;

                const creditsResult = await (await fetch(creditsEndpoint)).json();
                const directors = creditsResult.crew.filter(member => member.job === "Director");

                this.setState({
                    actors: creditsResult.cast,
                    directors: directors,
                    loading: false
                }, () => {
                    localStorage.setItem(`${this.props.match.params.movieId}`, JSON.stringify(this.state));
                });

            }
        }
        catch (error) {
            console.error("Error:", error);
        }
    }


    render() {
        const { movie, loading, directors, actors } = this.state;
        const { movieName } = this.props.location;

        const actorProfile = actors && actors.map((element, i) => {
            return <Actor key={i} actor={element} />
        })

        return (
            <div className="rmdb-movie" >
                {movie ?
                    <div>
                        <Navigation movie={movieName} />
                        <MovieInfo movie={movie} directors={directors} />
                        <MovieInfoBar
                            time={movie.runtime}
                            budget={movie.budget}
                            revenue={movie.revenue}
                        />
                    </div>
                    : null}
                {actors ?
                    <div className="rmdb-movie-grid">
                        <FourColGrid header={'Actors'}>
                            {actorProfile}
                        </FourColGrid>
                    </div>
                    : null}
                {!actors && !loading ? <h1>No Movie Found</h1> : null}
                {loading ? <Spinner /> : null}
            </div>
        )
    }
}

export default Movie;
