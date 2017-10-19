import React, { PureComponent } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './KosningaProf.scss';

const answerMap = {
  1: 'Mjög ósammála',
  2: 'Frekar ósammála',
  3: 'Hlutlaus',
  4: 'Frekar sammála',
  5: 'Mjög sammála',
};
const areYouSure =
  'Ertu viss um að þú viljir yfirgefa síðuna núna? Öll svörin munu týnast.';
const defaultAnswer = '3';

class Kosningaprof extends PureComponent {
  static propTypes = {
    questions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        question: PropTypes.string.isRequired,
      })
    ).isRequired,
  };
  state = {
    started: false,
    token: null,
    answers: this.props.questions.reduce((all, { id }) => {
      // eslint-disable-next-line
      all[id] = defaultAnswer;
      return all;
    }, {}),
  };
  componentDidMount() {
    const { token } = queryString.parse(window.location.search);
    if (!token) {
      window.location = '/';
    }
    // eslint-disable-next-line
    this.setState({ token });
  }
  componentWillUnmount() {
    window.onbeforeunload = null;
  }
  onChange = id => ({ target }) => {
    this.setState(({ answers, started }) => {
      if (!started) {
        window.onbeforeunload = event => {
          // eslint-disable-next-line
          event.returnValue = areYouSure;
          return areYouSure;
        };
      }
      return {
        started: true,
        answers: {
          ...answers,
          [id]: target.value,
        },
      };
    });
  };
  onSend = async () => {
    const { answers, token } = this.state;

    const arr = Object.keys(answers).map(x => answers[x]);
    const first = parseInt(arr.slice(0, 14).join(''), 10).toString(36);
    const second = parseInt(arr.slice(14 + 1).join(''), 10).toString(36);

    await fetch('/kosningaprof', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        reply: `${first}:${second}`,
      }),
    });
  };
  render() {
    const { questions } = this.props;
    const { answers } = this.state;
    return (
      <div className={s.root}>
        {questions.map(({ question, id }) => (
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
        <button onClick={this.onSend}>Senda</button>
      </div>
    );
  }
}

export default withStyles(s)(Kosningaprof);
