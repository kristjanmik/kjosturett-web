import SliderStyles from '../../../node_modules/rc-slider/assets/index.css';
import React, { PureComponent } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Slider from 'rc-slider';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { encodeAnswersToken } from '../../utils';
import s from './styles.scss';
import history from '../../history';

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
    }).isRequired,
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
  onChange = id => value => {
    this.setState(
      ({ answers }) => {
        const newAnswers = {
          ...answers,
          [id]: value,
        };

        localStorage.setItem(storageKey, JSON.stringify(newAnswers));
        return {
          started: true,
          answers: newAnswers,
        };
      },
      () => {
        console.log(this.state);
      },
    );
  };
  onLayout() {
    this.questionsEl.childNodes.forEach(question => {
      const { top } = question.getBoundingClientRect();
      this.positions[question.id] = top;
    });
    this.viewHeight = window.innerHeight;
  }
  onScroll() {
    const bottom = window.pageYOffset + 0.75 * this.viewHeight;
    const visible = {};

    Object.keys(this.positions).forEach(id => {
      visible[id] = this.positions[id] < bottom;
    });

    this.setState({ visible });
  }
  async onSend() {
    const { answers } = this.state;
    const answerValues = Object.keys(answers)
      .map(x => answers[x])
      .map(x => (x == null ? this.props.answers.default : x));

    history.push(`/kosningaprof/${encodeAnswersToken(answerValues)}`);
  }
  loadAnswers() {
    const answers = JSON.parse(localStorage.getItem(storageKey));

    if (answers != null) {
      this.setState({ answers, showReset: true });
    }
  }
  render() {
    const { questions } = this.props;
    const { answers, showReset, finished, visible } = this.state;
    const marks = {
      1: 'Ósammála',
      3: 'Hlutlaus',
      5: 'Sammála',
    };
    return (
      <div className={cx(s.root, s.questions)}>
        <div
          ref={element => {
            this.questionsEl = element;
          }}
        >
          {!finished &&
            questions.map(({ question, id }) => (
              <div
                key={id}
                id={id}
                className={cx(s.question, !visible[id] && s.hidden)}
              >
                <h3>{question}</h3>
                <Slider
                  dots
                  min={1}
                  max={5}
                  value={answers[id] != null ? answers[id] : 3}
                  marks={marks}
                  onChange={this.onChange(id)}
                  dotStyle={{
                    borderColor: '#333',
                  }}
                  handleStyle={{
                    backgroundColor: '#333',
                    borderColor: '#777',
                  }}
                  trackStyle={{
                    backgroundColor: 'transparent',
                  }}
                />
              </div>
            ))}
        </div>
        <button onClick={this.onSend}>Senda</button>
        {showReset && (
          <button className={s.reset} onClick={this.onReset}>
            Frumstilla svör
          </button>
        )}
      </div>
    );
  }
}

export default withStyles(s, SliderStyles)(Kosningaprof);
