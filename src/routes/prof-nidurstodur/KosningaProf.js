import SliderStyles from '../../../node_modules/rc-slider/assets/index.css';
import React, { PureComponent } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Slider from 'rc-slider';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { encodeAnswersToken } from '../../utils';
import s from './styles.scss';
import history from '../../history';

const answersKey = 'prof:answers';
const indexKey = 'prof:answers:index';

const initialAnswers = questions =>
  questions.reduce((all, { id }) => {
    // eslint-disable-next-line
    all[id] = null;
    return all;
  }, {});

const marks = {
  1: 'Mjög ósammála',
  3: 'Hlutlaus',
  5: 'Mjög sammála',
};

class Kosningaprof extends PureComponent {
  static contextTypes = {
    fetch: PropTypes.func.isRequired,
  };
  static defaultProps = {
    title: 'Kjóstu rétt',
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
      })
    ).isRequired,
    isEmbedded: PropTypes.bool,
    title: PropTypes.string,
  };
  constructor(props) {
    super(props);

    this.state = {
      started: false,
      token: null,
      finished: false,
      visible: {},
      showReset: false,
      currentQuestionIndex: -1,
      answers: initialAnswers(props.questions),
    };

    this.positions = {};

    this.onReset = this.onReset.bind(this);
    this.onSend = this.onSend.bind(this);
    this.changeQuestion = this.changeQuestion.bind(this);
  }
  componentDidMount() {
    this.loadAnswers();
  }
  onReset() {
    // eslint-disable-next-line
    if (window.confirm('Ertu viss um að þú byrja upp á nýtt?')) {
      const answers = initialAnswers(this.props.questions);
      this.clearState();
      this.setState({
        answers,
        showReset: false,
      });
    }
  }

  onChange = id => value => {
    this.setState(({ answers }) => {
      const newAnswers = {
        ...answers,
        [id]: value,
      };

      return {
        started: true,
        answers: newAnswers,
      };
    }, this.saveState);
  };
  async onSend() {
    const { isEmbedded } = this.props;
    const { answers } = this.state;
    const answerValues = Object.keys(answers)
      .map(x => answers[x])
      .map(x => (x == null ? this.props.answers.default : x));
    const answersToken = encodeAnswersToken(answerValues);

    this.context
      .fetch(`/konnun/replies/all?timestamp=${Date.now()}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reply: answersToken,
        }),
      })
      .catch(console.error);
    const segments = [isEmbedded && 'embed', 'kosningaprof', answersToken];
    const path = segments.filter(Boolean).join('/');
    history.push(`/${path}`);
  }

  clearState = () => {
    localStorage.removeItem(answersKey);
    localStorage.removeItem(indexKey);
  };
  saveState = () => {
    const { currentQuestionIndex, answers } = this.state;
    localStorage.setItem(answersKey, JSON.stringify(answers));
    localStorage.setItem(indexKey, currentQuestionIndex);
  };

  loadAnswers() {
    const answers = JSON.parse(localStorage.getItem(answersKey));
    const currentQuestionIndex = Number(localStorage.getItem(indexKey));

    if (answers != null) {
      this.setState({ answers, currentQuestionIndex, showReset: true });
    }
  }

  changeQuestion(nextOrPrev) {
    this.setState(
      ({ currentQuestionIndex }) => ({
        currentQuestionIndex: currentQuestionIndex + nextOrPrev,
      }),
      this.saveState
    );
  }

  renderQuestion(question, id, extraStyle) {
    const { answers, currentQuestionIndex } = this.state;
    const { isEmbedded, questions } = this.props;
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    return (
      <div key={id} id={id} className={cx(s.question, extraStyle)}>
        <h3 className={s.questionText}>{question}</h3>
        <Slider
          dots
          min={1}
          max={5}
          value={answers[id]}
          marks={marks}
          onChange={this.onChange(id)}
          dotStyle={{
            borderColor: '#e9e9e9',
            marginBottom: -5,
            width: 18,
            height: 18,
          }}
          handleStyle={{
            backgroundColor: '#333',
            borderColor: '#999',
            marginLeft: 4,
            marginTop: -7,
            width: 18,
            height: 18,
          }}
          trackStyle={{
            backgroundColor: 'transparent',
          }}
        />
        <div className={s.questionControls}>
          {answers[id] !== null && (
            <button
              className={s.skip}
              onClick={() => {
                this.onChange(id)(null);

                if (isEmbedded && !isLastQuestion) {
                  this.changeQuestion(1);
                }
              }}
            >
              <i>Sleppa spurningu</i>
            </button>
          )}
          {isEmbedded && (
            <div className={s.questionEmbedControls}>
              {currentQuestionIndex > 0 && (
                <button
                  className={s.nextPrev}
                  onClick={() => this.changeQuestion(-1)}
                >
                  Til baka
                </button>
              )}
              {currentQuestionIndex < questions.length - 1 && (
                <button
                  className={s.nextPrev}
                  onClick={() => this.changeQuestion(1)}
                >
                  Næsta spurning
                </button>
              )}
              {isLastQuestion && (
                <button className={s.embedSubmit} onClick={() => this.onSend()}>
                  Reikna niðurstöður
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  renderAllQuestions() {
    const { questions } = this.props;
    const { answers } = this.state;
    const hasData = Object.values(answers).some(value => value !== null);
    return (
      <div>
        {questions.map(({ question, id }) => this.renderQuestion(question, id))}
        {hasData && (
          <p style={{ textAlign: 'center' }}>
            <button onClick={this.onSend}>Reikna niðurstöður</button>
          </p>
        )}
      </div>
    );
  }

  renderIntroText() {
    const { title, isEmbedded } = this.props;
    const { showReset } = this.state;

    return (
      <div className={s.lead}>
        <p>
          Taktu kosningarpróf <strong>{title}</strong> til þess að sjá hvaða
          flokkur passar best við þínar skoðanir. Því fleiri spurningum sem þú
          svarar, því nákvæmari niðurstöður færðu.
        </p>
        {showReset && (
          <p>
            Þú getur tekið upp þráðinn frá því síðast og klárað prófið, eða{' '}
            <button className={s.reset} onClick={this.onReset}>
              byrjað
            </button>{' '}
            upp á nýtt.
          </p>
        )}
        {isEmbedded && (
          <button onClick={() => this.changeQuestion(1)}>Áfram</button>
        )}
      </div>
    );
  }

  render() {
    const { isEmbedded, questions } = this.props;
    const { currentQuestionIndex } = this.state;

    if (isEmbedded) {
      if (currentQuestionIndex === -1) {
        return (
          <div className={cx(s.root, s.questions)}>
            {this.renderIntroText()}
          </div>
        );
      }

      const { question, id } = questions[currentQuestionIndex];

      return (
        <div className={cx(s.root, s.questions)}>
          <div className={s.progress}>
            <div
              className={s.progressBar}
              style={{
                transform: `translateX(${-100 *
                  (1 - (currentQuestionIndex + 1) / questions.length)}%)`,
              }}
            />
          </div>
          <div
            ref={element => {
              this.questionsEl = element;
            }}
          >
            {this.renderQuestion(question, id, s.embeddedQuestion)}
          </div>
        </div>
      );
    }

    return (
      <div className={cx(s.root, s.questions)}>
        {this.renderIntroText()}
        <div
          ref={element => {
            this.questionsEl = element;
          }}
        >
          {this.renderAllQuestions()}
        </div>
      </div>
    );
  }
}

export default withStyles(s, SliderStyles)(Kosningaprof);
