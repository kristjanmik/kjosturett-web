import React, { PureComponent } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { encodeAnswersToken } from '../../utils';
import s from './KosningaProf.scss';

const storageKey = 'prof:answers';
const answerMap = {
  1: 'Mjög ósammála',
  2: 'Frekar ósammála',
  3: 'Hlutlaus',
  4: 'Frekar sammála',
  5: 'Mjög sammála',
  6: 'Vil ekki svara'
};
const areYouSure =
  'Ertu viss um að þú viljir yfirgefa síðuna núna? Öll svörin munu týnast.';
const defaultAnswer = '3';

const initialAnswers = questions =>
  questions.reduce((all, { id }) => {
    // eslint-disable-next-line
    all[id] = defaultAnswer;
    return all;
  }, {})

class Kosningaprof extends PureComponent {
  static contextTypes = {
    fetch: PropTypes.func.isRequired
  };
  static propTypes = {
    questions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        question: PropTypes.string.isRequired
      })
    ).isRequired
  };
  state = {
    started: false,
    token: null,
    finished: false,
    showReset: false,
    answers: initialAnswers(this.props.questions),
  };
  constructor(props) {
    super(props);
    this.onSend = this.onSend.bind(this);
  }
  componentDidMount() {
    const { token } = queryString.parse(window.location.search);
    if (!token) {
      window.location = '/';
    }

    let answers = this.state.answers;
    let showReset = false;
    try {
      answers = JSON.parse(localStorage.getItem(storageKey));
      showReset = true;
    } catch (error) {}

    this.setState({
      showReset,
      answers,
      token,
    });
  }
  onReset = () => {
    this.setState({
      answers: initialAnswers(this.props.questions),
      showReset: false,
    });
  }
  onChange = id => ({ target }) => {
    this.setState(({ answers, started }) => {
      const newAnswers = {
        ...answers,
        [id]: target.value,
      };
      localStorage.setItem(storageKey, JSON.stringify(newAnswers));
      return {
        started: true,
        answers: newAnswers,
      };
    });
  };
  async onSend() {
    console.log('this is', this);
    const { answers, token } = this.state;

    await this.context.fetch(`/konnun/replies?timestamp=${Date.now()}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token,
        reply: encodeAnswersToken(Object.keys(answers).map(x => answers[x]))
      }),
    });

    this.setState({ finished: true });
  }
  render() {
    const { questions } = this.props;
    const { answers, showReset, started, finished } = this.state;
    return (
      <div className={s.root}>
        {finished && <h3>Takk fyrir þátttökuna!</h3>}
        {!finished && showReset &&
          <button className={s.reset} onClick={this.onReset}>Frumstilla svör</button>
        }
        {!finished &&
          questions.map(({ question, id }) => (
            <div key={id} className={s.question}>
              <h3>{question}</h3>
              {Object.keys(answerMap).map(value => {
                const name = `${id}_${value}`;
                return (
                  <div key={value}>
                    <input
                      id={name}
                      name={name}
                      value={value}
                      type="radio"
                      checked={answers[id] === value}
                      onChange={this.onChange(id)}
                    />
                    <label htmlFor={name}>{answerMap[value]}</label>
                  </div>
                );
              })}
            </div>
          ))}
        {started && !finished && <button onClick={this.onSend}>Senda</button>}
      </div>
    );
  }
}

export default withStyles(s)(Kosningaprof);
