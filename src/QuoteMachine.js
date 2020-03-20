import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
import $ from 'jquery';

class QuoteMachine extends Component {
  constructor() {
    super();
    this.state = {
      quote: {
        content: '',
        link: '',
        author: '',
      },
      hasQuote: false,
      colors: [
        '#8C5A8C',
        '#745353',
        '#696969',
        '#4371B6',
        '#A03636',
        '#2F7F4C',
      ],
      currentColor: '#696969',
    };
    this.END_POINT =
      'https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?';
  }

  UNSAFE_componentWillMount() {
    $.getJSON(this.END_POINT, data => {
      console.log(data);
      if (data.quoteText && data.quoteLink && data.quoteAuthor) {
        const { quote } = this.state;
        quote.content = data.quoteText;
        quote.link = data.quoteLink;
        quote.author = data.quoteAuthor;
        this.setState({ quote });
      }
    });
  }

  newColorOnClick = () => {
    const { colors, currentColor } = this.state;
    if (colors.indexOf(currentColor) === 5) {
      this.setState({
        currentColor: colors[0],
      });
      const colorChange = colors[0];
      document.getElementById(
        'content-wrapper'
      ).style.backgroundColor = colorChange;
    } else {
      this.setState({
        currentColor: colors[colors.indexOf(currentColor) + 1],
      });
      document.getElementById('content-wrapper').style.backgroundColor =
        colors[colors.indexOf(currentColor) + 1];
    }
  };

  getRandomQuote = () => {
    $.getJSON(this.END_POINT, data => {
      console.log(data);
      if (data.quoteText && data.quoteLink && data.quoteAuthor) {
        const { quote, hasQuote } = this.state;
        quote.content = data.quoteText;
        quote.link = data.quoteLink;
        quote.author = data.quoteAuthor;
        setTimeout(() => {
          this.setState({ quote }, () => {
            if (hasQuote === false) {
              this.setState({ hasQuote: true });
            }
          });
        }, 700);
      } else {
        return console.error('No quote has been found 404');
      }
    });
  };

  renderQuote = () => {
    const { quote, currentColor } = this.state;
    const { author, content } = quote;

    return (
      <div id="text-container">
        <p id="text" style={{ color: currentColor }}>
          <FontAwesomeIcon icon={faQuoteLeft} size="1x" />
          &nbsp; {content}
        </p>
        <p id="author" style={{ color: currentColor }}>
          - {author}
        </p>
      </div>
    );
  };

  textFadeQuote = () => {
    const el = document.getElementById('text');
    el.classList.add('animate-flicker');
    el.style.animation = 'none';
    setTimeout(function() {
      el.style.animation = '';
    }, 10);
  };

  textFadeAuthor = () => {
    const author = document.getElementById('author');
    author.classList.add('animate-flicker');
    author.style.animation = 'none';
    setTimeout(function() {
      author.style.animation = '';
    }, 10);
  };

  render() {
    const { currentColor, quote } = this.state;
    const { author, content, link } = quote;
    const params = {
      url: link,
      text: `${content}     -${author}`,
    };
    const share =
      'http://twitter.com/intent/tweet' +
      `?&url=${encodeURIComponent(params.url)}&text=${encodeURIComponent(
        params.text
      )}`;
    return (
      <div className="container">
        <div className="content-wrapper" id="content-wrapper">
          <div id="quote-box">
            <div>{this.renderQuote()}</div>
            <div id="button-container">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={share}
                type="button"
                id="tweet-quote"
                style={{ backgroundColor: currentColor }}
              >
                <FontAwesomeIcon icon={faTwitter} size="2x" />
              </a>
              <button
                type="button"
                id="random-quote"
                style={{ backgroundColor: currentColor }}
                onClick={() => {
                  this.getRandomQuote();
                  this.newColorOnClick();
                  this.textFadeQuote();
                  this.textFadeAuthor();
                }}
              >
                Random Quote
              </button>
            </div>
            <br />
          </div>
          <p id="projectCreatedBy">By Ryan J</p>
        </div>
      </div>
    );
  }
}

export default QuoteMachine;
