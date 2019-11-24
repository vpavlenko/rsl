import React, {Component} from 'react';
import Videos from './Videos';

import Omnibar from 'omnibar';
import SearchExtension from './SearchExtension';
import EchoExtension from "./EchoExtension";


class App extends Component {
    state = {
        videos: null,
    };

    resultItems = (props) => {
        this.setState({videos: props.item.videos});
    };

    renderVideos = (props) => {
        let videos = [];
        if (props.item.videos) {
            props.item.videos.forEach(video => {
                videos.push(<Videos video={video} />);
            })
        }

        return videos;
    };

    render() {
        return (
            <div style={{padding: "20px"}}>
                <Omnibar
                    placeholder="Enter an expression"
                    extensions={[SearchExtension]}
                    render={this.renderVideos}
                />
            </div>
        );
    }
}

export default App;