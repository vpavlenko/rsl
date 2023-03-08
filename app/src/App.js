import React, { Component } from "react";
import Videos from "./Videos";
import axios from "axios";

import Autosuggest from "react-autosuggest";

let _ = require("lodash");

function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getSuggestionValue(suggestion) {
  return suggestion.word;
}

function renderSuggestion(suggestion) {
  return <span>{suggestion.word}</span>;
}

function getSectionSuggestions(section) {
  return section.words;
}

class App extends Component {
  state = {
    suggestions: [],
    videos: null,
    value: "",
    dicts: [],
    words: [],
    groupedWords: [],
    selected: false,
  };

  componentDidMount() {
    var dicts = [];
    var words = [];

    axios.get("manifest.json").then((response) => {
      const dict_names = response.data.dictionaries;
      dict_names.forEach((file) => {
        axios.get(`dictionaries/${file}`).then((resp) => {
          dicts.push({ title: `${file}`.split(".json")[0], words: resp.data });
          resp.data.forEach((wordInfo) => {
            words.push({
              title: `${file}`.split(".json")[0],
              word: wordInfo.word,
              variants: wordInfo.variants,
            });
          });
        });
      });
    });

    this.setState({
      dicts: dicts,
      words: words,
    });
  }

  getSuggestions = (value) => {
    const escapedValue = escapeRegexCharacters(value.trim());

    if (escapedValue === "") {
      return [];
    }

    const regex = new RegExp("^" + escapedValue, "i");

    let groupedWords;
    if (!this.state.groupedWords.length) {
      groupedWords = _.groupBy(this.state.words, (car) => car.word);
      this.setState({ groupedWords: groupedWords });
    } else groupedWords = this.state.groupedWords;

    const filtered = Object.keys(groupedWords)
      .filter((key) => regex.test(key))
      .reduce((obj, key) => {
        obj[key] = groupedWords[key];
        return obj;
      }, {});

    return Object.keys(filtered)
      .sort()
      .map((key) => {
        return { word: key };
      });
  };

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue,
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
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

  onSuggestionSelected = (event, { suggestion }) => {
    this.setState({
      selected: true,
    });
  };

  get renderVideos() {
    let wordInfo = [];
    let videos = [];

    if (this.state.selected && this.state.value.length > 0) {
      this.state.groupedWords[this.state.value].forEach((dict) => {
        wordInfo.push({ variants: dict.variants, dict: dict.title });
      });

      if (wordInfo) {
        for (let v of wordInfo) {
          for (let variant of v.variants) {
            let url;
            if (variant.start)
              url = `https://www.youtube.com/embed/${
                variant.video.split("v=")[1]
              }?start=${Math.floor(variant.start)}&end=${Math.ceil(
                variant.end
              )}&rel=0&loop=1&controls=0&showinfo=0`;
            else if (
              !variant.video.endsWith(".mp4") &&
              !variant.video.endsWith(".webm")
            )
              url = `https://www.youtube.com/embed/${
                variant.video.split("v=")[1]
              }`;
            else url = variant.video;

            videos.push(
              <Videos url={url} dict={v.dict} source={variant.source} />
            );
          }
        }
      }
    }

    return videos;
  }

  render() {
    const inputProps = {
      placeholder: "Введите слово",
      value: this.state.value,
      onChange: this.onChange,
      autoFocus: true,
    };

    return (
      <div>
        <div>
          <h1>Поиск по словарям РЖЯ</h1>
          <a href="https://vk.com/public189313853">Группа в ВК</a>
        </div>
        <div className={"search-field"}>
          <Autosuggest
            suggestions={this.state.suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            onSuggestionSelected={this.onSuggestionSelected}
            getSectionSuggestions={getSectionSuggestions}
            inputProps={inputProps}
          />
        </div>
        <div className="videos-grid">{this.renderVideos}</div>
        <div style={{ width: "40em", margin: "1em" }}>
          Агрегатор словарей русского жестового языка сделан в ноябре 2019 и с
          тех пор не обновлялся. Разработчики:{" "}
          <a href="https://t.me/vitalypavlenko">Виталий Павленко</a>, Лиза
          Свитанко, Даниил Охлопков.
          <p>
            Агрегатор словарей даёт возможность одновременно искать по многим
            доступным в интернете общим словарям, таким как:
            <ul>
              <li>
                <a target="_blank" href="https://www.spreadthesign.com/">
                  Spread The Sign
                </a>{" "}
                (27023 слова)
              </li>
              <li>
                <a
                  target="_blank"
                  href="https://surdocentr.ru/publikatsii/obzory-slovarej-zhestovykh-yazykov/197-on-line-slovar-digitgestus-russkij-zhestovyj-yazyk"
                >
                  DigitGestus
                </a>{" "}
                (3384 слова)
              </li>
              <li>
                <a target="_blank" href="https://vk.com/jestovnet">
                  Город жестов
                </a>{" "}
                (2789 слов)
              </li>
              <li>
                <a
                  target="_blank"
                  href="https://www.youtube.com/playlist?list=PLnzoJGrIUn81yN6rVjajY_hdW4Prw_0-J"
                >
                  словарь с синими шторами
                </a>{" "}
                (3157 слов)
              </li>

              <li>
                <a target="_blank" href="http://surdoserver.ru/">
                  Сурдосервер
                </a>{" "}
                (2701 слов)
              </li>
              <li>
                <a target="_blank" href="https://slovar.surdocentr.ru/">
                  ЦНИИ русского жестового языка
                </a>{" "}
                (1586 слов)
              </li>
              <li>
                <a target="_blank" href="https://signlang.ru/studyrsl/topics/">
                  Лаборатория лингвистики жестового языка
                </a>{" "}
                (1088 слов)
              </li>
              <li>
                <a
                  target="_blank"
                  href="https://web.archive.org/web/20190717064525/http://www.nisor.ru/snews/oa-/iooa-uoo-ooo-a"
                >
                  институт социальной ребилитации НГТУ
                </a>{" "}
                (1156 слов)
              </li>
              <li>
                <a
                  target="_blank"
                  href="https://www.youtube.com/playlist?list=PL_VzOPUOoGKQQ7hyco7uz5apagoF99raf"
                >
                  Енох Иаредович
                </a>{" "}
                (1230 слов)
              </li>
              <li>
                <a
                  target="_blank"
                  href="https://www.youtube.com/playlist?list=PLzQrZe3EemP7-hrTR9OEtFWOMkz9HTGoR"
                >
                  Церковь глухих в интернете
                </a>{" "}
                (1047 слов)
              </li>
              <li>
                <a
                  target="_blank"
                  href="https://www.youtube.com/watch?v=ZTT0UWIE65U&list=PL_x7BZC9wDdvtlajPS2xnv54ZJ90_K6ef"
                >
                  Школа жестового языка "Образ"
                </a>{" "}
                (244 слов)
              </li>
              <li>
                <a
                  target="_blank"
                  href="https://www.youtube.com/playlist?list=PLbnWmVvet_0xylwaOtIHIvUfUDT_09iWh"
                >
                  Безэквивалентная лексика
                </a>{" "}
                (107 слов)
              </li>
            </ul>
          </p>
          <p>
            Также в агрегаторе есть религиозные словари:
            <ul>
              <li>
                <a
                  target="_blank"
                  href="https://www.youtube.com/watch?v=ipTfYTo-_ZI"
                >
                  Телекомпания "Глас", Киев, 2006 год
                </a>{" "}
                (460 слов)
              </li>
              <li>
                <a
                  target="_blank"
                  href="https://www.youtube.com/watch?v=QeLTJWWXSy8"
                >
                  Кинокомпания "Ковчег"
                </a>{" "}
                (708 слов)
              </li>
              <li>
                <a
                  target="_blank"
                  href="http://surdonika.ru/metodics/editions/slovar-religioznykh-zhestov.php"
                >
                  Координационный центр по работе с глухими, слепоглухими и
                  слабослышащими РПЦ
                </a>{" "}
                (225 слов)
              </li>
              <li>
                <a target="_blank" href="https://voginfo.ru/lexicon/">
                  ВОГ и РПЦ
                </a>{" "}
                (217 слов)
              </li>
            </ul>
          </p>
          <p>
            Мы надеемся, что проект будет полезен всем, кто изучает жестовый
            язык, а также, быть может, лингвистам, изучающим диалектные
            различия. (Если вы такой лингвист и будете делать публикацию,{" "}
            <a href="mailto:cxielamiko@gmail.com">скажите нам заранее</a>, мы
            придумаем, как вы нас сможете процитировать.)
          </p>
          <p>
            Жестовые языки сильно более вариативны по сравнению со звучащими.
            Жесты сильно различаются по городам и между поколениями. Агрегатор
            показывает это разнообразие. Было бы круто снабдить выдачу
            информацией о городах и поколениях, помогите нам.
          </p>
          <p>
            <a href="https://github.com/vpavlenko/rsl">Исходный код</a>
          </p>
        </div>
      </div>
    );
  }
}

export default App;
