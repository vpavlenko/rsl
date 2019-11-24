import React, {Component} from 'react';

class Videos extends Component {
    render() {
        return (
            <div
                className="video"
                style={{
                    position: "relative",
                    paddingBottom: "56.25%" /* 16:9 */,
                    paddingTop: 25,
                    height: 0
                }}
            >
                <iframe width="560" height="315"
                        src={this.props.video}
                        frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen>
                </iframe>
            </div>
        );
    }
}

export default Videos;