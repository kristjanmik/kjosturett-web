import React, { PureComponent } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Scroll from 'react-scroll';
import queryString from 'query-string';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { encodeAnswersToken } from '../../utils';
import s from './KosningaProf.scss';
import checkmark from '../../checkmark.svg';

const areYouSure =
  'Ertu viss um að þú viljir yfirgefa síðuna núna? Öll svörin munu týnast.';

const storageKey = 'prof:answers';

const initialAnswers = questions =>
  questions.reduce((all, { id }) => {
    // eslint-disable-next-line
    all[id] = null;
    return all;
  }, {});

class Kosningaprof extends PureComponent {
  static contextTypes = {
    fetch: PropTypes.func.isRequired,
  };
  static propTypes = {
    answers: PropTypes.shape({
      default: PropTypes.string.isRequired,
      textMap: PropTypes.object.isRequired,
    }),
    questions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        question: PropTypes.string.isRequired,
      }),
    ).isRequired,
  };
  constructor(props) {
    super(props);

    this.state = {
      started: false,
      token: null,
      finished: false,
      visible: {},
      showReset: false,
      answers: initialAnswers(props.questions),
    };

    this.positions = {};

    this.onScroll = this.onScroll.bind(this);
    this.onLayout = this.onLayout.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onSend = this.onSend.bind(this);
  }
  componentDidMount() {
    window.addEventListener('resize', this.onLayout);
    window.addEventListener('layout', this.onLayout);
    window.addEventListener('scroll', this.onScroll);

    this.onLayout();
    this.onScroll();
    this.loadAnswers();
  }
  componentWillUnmount() {
    window.onbeforeunload = null;
    window.removeEventListener('resize', this.onLayout);
    window.removeEventListener('layout', this.onLayout);
    window.removeEventListener('scroll', this.onScroll);
  }
  onReset() {
    this.setState({
      answers: initialAnswers(this.props.questions),
      showReset: false,
    });
  }
  onChange = id => ({ target }) => {
    setTimeout(() => {
      Scroll.animateScroll.scrollTo(this.positions[~~id + 1] - 110);
    }, 500);

    this.setState(({ answers, started }) => {
      if (!started) {
        window.onbeforeunload = event => {
          // eslint-disable-next-line
          event.returnValue = areYouSure;
          return areYouSure;
        };
      }
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
  onLayout() {
    this.questionsEl_.childNodes.forEach(question => {
      const { top } = question.getBoundingClientRect();
      this.positions[question.id] = top;
    });
    this.viewHeight_ = window.innerHeight;
  }
  onScroll() {
    const bottom = window.pageYOffset + 0.75 * this.viewHeight_;
    const visible = {};

    Object.keys(this.positions).forEach(id => {
      visible[id] = this.positions[id] < bottom;
    });

    this.setState({ visible });
  }
  async onSend() {
    const { answers, token } = this.state;
    const answerValues = Object.keys(answers)
      .map(x => answers[x])
      .map(x => (x == null ? this.props.answers.default : x));

    await this.context.fetch(`/konnun/replies?timestamp=${Date.now()}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        reply: encodeAnswersToken(answerValues),
      }),
    });

    this.setState({ finished: true });
  }
  loadAnswers() {
    const answers = JSON.parse(localStorage.getItem(storageKey));

    if (answers != null) {
      this.setState({ answers, showReset: true });
    }
  }
  render() {
    const { questions } = this.props;
    const { answers, started, showReset, finished, visible } = this.state;
    const answerMap = this.props.answers.textMap;
    return (
      <div className={s.root}>
        {finished && <h3>Takk fyrir þátttökuna!</h3>}
        {!finished &&
          showReset && (
            <button className={s.reset} onClick={this.onReset}>
              Frumstilla svör
            </button>
          )}
        <div ref={element => (this.questionsEl_ = element)}>
          {!finished &&
            questions.map(({ question, id }) => (
              <div
                key={id}
                id={id}
                className={cx(s.question, !visible[id] && s.hidden)}
              >
                <h3>{question}</h3>
                {Object.keys(answerMap).map(value => {
                  const name = `${id}_${value}`;
                  const active = answers[id] === value;
                  return (
                    <div key={value}>
                      <input
                        id={name}
                        name={name}
                        value={value}
                        type="radio"
                        checked={active}
                        onChange={this.onChange(id)}
                      />
                      <label htmlFor={name}>
                        {active && <img src={checkmark} alt="ég er" />}
                        {answerMap[value]}
                      </label>
                    </div>
                  );
                })}
              </div>
            ))}
        </div>
        {started && !finished && <button onClick={this.onSend}>Senda</button>}
      </div>
    );
  }
}

export default withStyles(s)(Kosningaprof);
