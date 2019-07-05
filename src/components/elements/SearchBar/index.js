import React from 'react';
import FontAwesome from 'react-fontawesome';
import './SearchBar.css';

class SearchBar extends React.Component {
    state = {
        value: ''
    }

    render() {
        return (
            <div className="rmdb-searchbar">
                <div className="rmdb-searchbar-content">
                    <FontAwesome className="rmdb-fa-search" name="search" size="2x" />
                    <input
                        className="rmdb-searchbar-input"
                        type="text"
                        placeholder="Search"
                        onChange={this.handleSearch}
                        value={this.state.value} // controlled component
                    />
                </div>
            </div>
        )
    }
}

export default SearchBar;