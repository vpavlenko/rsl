import React, {Component} from 'react';
import Videos from './Videos';
import axios from 'axios';

import Autosuggest from 'react-autosuggest';

let _ = require('lodash');

function escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestionValue(suggestion) {
    return suggestion.word;
}

function renderSuggestion(suggestion) {
    return (
        <span>{suggestion.word}</span>
    );
}

function getSectionSuggestions(section) {
    return section.words;
}


class App extends Component {
    state = {
        suggestions: [],
        videos: null,
        value: '',
        dicts: [],
        words: [],
        groupedWords: [],
        selected: false,
    };

    componentDidMount() {
        var dicts = [];
        var words = [];

        axios.get('manifest.json')
            .then((response) => {
                const dict_names = response.data.dictionaries;
                dict_names.forEach(file => {
                    axios.get(`dictionaries/${file}`)
                        .then(resp => {
                            dicts.push({title: `${file}`.split('.json')[0], words: resp.data});
                            resp.data.forEach(wordInfo => {
                                words.push({
                                    title: `${file}`.split('.json')[0],
                                    word: wordInfo.word, variants: wordInfo.variants
                                })
                            });
                        })
                })
            });

        this.setState({
            dicts: dicts,
            words: words,
        });
    }

    getSuggestions = (value) => {
        const escapedValue = escapeRegexCharacters(value.trim());

        if (escapedValue === '') {
            return [];
        }

        const regex = new RegExp('^' + escapedValue, 'i');

        let groupedWords;
        if (!this.state.groupedWords.length) {
            groupedWords = _.groupBy(this.state.words, car => car.word);
            this.setState({groupedWords: groupedWords});
        }
        else groupedWords = this.state.groupedWords;

        const filtered = Object.keys(groupedWords)
            .filter(key => regex.test(key))
            .reduce((obj, key) => {
                obj[key] = groupedWords[key];
                return obj;
            }, {});

        return Object.keys(filtered).map(key => {
            return {word: key}
        });
    };

    onChange = (event, {newValue, method}) => {
        this.setState({
            value: newValue,
        });
    };

    onSuggestionsFetchRequested = ({value}) => {
        this.setState({
            suggestions: this.getSuggestions(value),
            selected: false,
        });
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: [],
        });
    };

    onSuggestionSelected = (event, {suggestion}) => {
        this.setState({
            selected: true,
        });
    };

    get renderVideos() {
        let wordInfo = [];
        let videos = [];

        if (this.state.selected && this.state.value.length > 0) {
            this.state.groupedWords[this.state.value].forEach(dict => {
                wordInfo.push({variants: dict.variants, dict: dict.title})
            });

            if (wordInfo) {
                for (let v of wordInfo) {
                    let url;
                    if (v.variants[0].start)
                        url = `https://www.youtube.com/embed/${v.variants[0].video.split('v=')[1]}?start=${Math.floor(v.variants[0].start)}&end=${Math.ceil(v.variants[0].end)}&rel=0&loop=1&controls=0&showinfo=0`;
                    else if (!v.variants[0].video.endsWith(".mp4")) url = `https://www.youtube.com/embed/${v.variants[0].video.split('v=')[1]}`;
                    else url = v.variants[0].video;

                    videos.push(<Videos url={url} dict={v.dict}/>);
                }
            }
        }

        return videos;
    };

    render() {
        const inputProps = {
            placeholder: "Введите слово",
            value: this.state.value,
            onChange: this.onChange
        };

        return (
            <div>
                <div style={{paddingTop: "80px", margin: "auto", width: "25%"}}>
                    <Autosuggest
                        suggestions={this.state.suggestions}
                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                        getSuggestionValue={getSuggestionValue}
                        renderSuggestion={renderSuggestion}
                        onSuggestionSelected={this.onSuggestionSelected}
                        getSectionSuggestions={getSectionSuggestions}
                        inputProps={inputProps}/>
                </div>
                <div className="videos-grid">
                    {this.renderVideos}
                </div>

            </div>
        );

    }
}

export default App;

