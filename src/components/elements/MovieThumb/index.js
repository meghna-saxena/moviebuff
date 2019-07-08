import * as React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './MovieThumb.css';

const MovieThumb = ({ clickable, image, movieId, movieName }) => {
    return (
        <React.Fragment>
            {movieId ?
                <div className="rmdb-moviethumb">
                    {clickable
                        ? <Link to={{ pathname: `/${movieId}`, movieName: `${movieName}` }}>
                            <img src={image} alt="moviethumb" />
                        </Link>
                        : <img src={image} alt="moviethumb" />
                    }
                </div>
                : <h1>No Movie Found</h1>}
        </React.Fragment>
    )
}

MovieThumb.propTypes = {
    image: PropTypes.string,
    movieId: PropTypes.number,
    movieName: PropTypes.string
}

export default MovieThumb;