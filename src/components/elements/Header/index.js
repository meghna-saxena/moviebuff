import React from 'react';
import './Header.css';

const Header = () => {
    return (
        <div className="rmdb-header">
            <div className="rmdb-header-content">
                <img className="rmdb-logo" alt="rmdb-logo" src="./images/reactMovie_logo.png" />
                <img className="rmdb-tmdb-logo" alt="tmdb-logo" src="./images/tmdb_logo.png" />
            </div>
        </div>
    )
}

export default Header;