import * as React from 'react';
import FontAwesome from 'react-fontawesome';
import './SearchBar.css';

class SearchBar extends React.Component {
    state = {
        value: ''
    }

    timeout = null;

    handleSearch = (event) => {
        this.setState({ value: event.target.value })
        clearTimeout(this.timeout);

        this.timeout = setTimeout(() => {
            this.props.search(false, this.state.value)
        }, 500);
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