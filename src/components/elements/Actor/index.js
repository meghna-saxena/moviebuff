import * as React from 'react'
import * as config from '../../../config';
import './Actor.css';

const Actor = (props) => {
    const POSTER_SIZE = 'w154';
    
    const actorImage = props.actor.profile_path
        ? `${config.IMAGE_BASE_URL}${config.POSTER_SIZE}${props.actor.profile_path}`
        : './images/no_image.jpg';

    return (
        <div className="rmdb-actor">
            <img src={actorImage} alt="actorthumb" />
            <span className="rmdb-actor-name">
                {props.actor.name}
            </span>
            <span className="rmdb-actor-character">
            {props.actor.character}
        </span>
        </div>
    )
}

export default Actor;
