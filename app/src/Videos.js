import React, {Component} from 'react';
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";

class Videos extends Component {
    render() {

        return (
            <Card className={"video-card"}>
                <CardContent style={{height: "90%"}}>
                    <Typography color="textSecondary" gutterBottom>
                        Источник видео: <a href={this.props.source} target="_blank">{this.props.dict}</a>
                    </Typography>
                    <iframe className="video"
                            src={this.props.url}
                            frameBorder="0"
                            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen>
                    </iframe>
                </CardContent>


            </Card>

        );
    }
}

export default Videos;