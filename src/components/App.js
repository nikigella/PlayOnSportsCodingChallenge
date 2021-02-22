import React, { Component } from 'react';
import MyComponent from './codingchallenge'

class App extends Component {
    render() {
        return (
            <div className="container">
                {/* you can only have one child or div under the BrowserRouter tag */}
            <MyComponent />
            </div>
        );
    }
};

export default App;