import React, {Component} from 'react';
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";

class Videos extends Component {
    render() {

        return (
            <Card style={{margin: "20px 0"}}>
                <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                        Источник видео: <a href={this.props.source} target="_blank">{this.props.dict}</a>
                    </Typography>

                </CardContent>
                <div
                    className="video"
                    style={{
                        position: "relative",
                        padding: 25,
                        paddingTop: 0,
                    }}
                >
                    <iframe width="560" height="315"
                            src={this.props.url}
                            frameBorder="0"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen>
                    </iframe>
                </div>
            </Card>

        );
    }
}

export default Videos;