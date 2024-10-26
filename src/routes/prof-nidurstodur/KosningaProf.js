import SliderStyles from '../../../node_modules/rc-slider/assets/index.css';
import React, { PureComponent } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Slider from 'rc-slider';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { encodeAnswersToken } from '../../utils';
import s from './styles.scss';
import history from '../../history';
import Checkbox from '../../components/Checkbox';

const answersKey = 'prof:answers';
const indexKey = 'prof:answers:index';

const disableTest = true;

const initialAnswers = questions =>
  questions.reduce((all, { id }) => {
    // eslint-disable-next-line
    all[id] = null;
    return all;
  }, {});

const marks = {
  0: 'Mjög ósammála',
  1: 'Ósammála',
  2: 'Sammála',
  3: 'Mjög sammála',
};

const isImportant = answer => {
  return answer && answer.toString().includes('!');
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
        // We want to use strings here in order to simplify the calculation using SVT.
        // When we click "clear" we get null
        // As 0 is evaluated to false we need to check if the value is explicitly null
        [id]: value !== null ? value.toString() : value,
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
    // TODO make sure it matches the length
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
    const hasAnswer = answers[id] !== null && answers[id] !== undefined;
    const isImportantQuestion = hasAnswer && isImportant(answers[id]);
    const hasSomeAnswers = Object.values(answers).some(value => value !== null);

    const skipQuestion = () => {
      this.onChange(id)(null);

      if (isEmbedded && !isLastQuestion) {
        this.changeQuestion(1);
      }
    };

    const _cleanAnswer = () => {
      return hasAnswer ? parseInt(answers[id].replace(/\!/g, ''), 10) : null;
    };

    const importantQuestion = () => {
      const currentValue = answers[id];
      if (isImportant(currentValue)) {
        const newValue = _cleanAnswer();
        this.onChange(id)(newValue);
      } else {
        this.onChange(id)(`${currentValue}!`);
      }
    };
    // The slider doesn't accept the importance value (!) so we need to clean it up and only
    // keep the numerical value
    const cleanAnswer = _cleanAnswer();

    return (
      <div key={id} id={id} className={cx(s.question, extraStyle)}>
        <h3 className={s.questionText}>{question}</h3>
        <div className={s.importantQuestion}>
          <Checkbox
            id={`importan-question-${id}`}
            text="Mikilvægt fyrir mig"
            onClick={importantQuestion}
            checked={isImportantQuestion}
          />
        </div>
        <Slider
          dots
          min={0}
          max={3}
          value={cleanAnswer}
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
        <div>
          {!isEmbedded && hasAnswer && (
            <div className={s.questionControls}>
              <button className={s.skip} onClick={skipQuestion}>
                <i>Sleppa spurningu</i>
              </button>
            </div>
          )}
          {isEmbedded && (
            <div className={s.questionEmbedControls}>
              {currentQuestionIndex >= 0 && (
                <button
                  className={s.nextPrev}
                  onClick={() => this.changeQuestion(-1)}
                >
                  Til baka
                </button>
              )}
              <button
                className={s.nextPrev}
                onClick={skipQuestion}
                style={{ backgroundColor: 'rgb(102, 109, 117)' }}
              >
                Sleppa spurningu
              </button>
              {currentQuestionIndex < questions.length - 1 && (
                <button
                  className={s.nextPrev}
                  onClick={() => this.changeQuestion(1)}
                  style={{ backgroundColor: 'rgb(34,36,40)' }}
                  disabled={!hasAnswer}
                >
                  Áfram
                </button>
              )}
              {isLastQuestion && (
                <button
                  disabled={!hasSomeAnswers}
                  className={s.embedSubmit}
                  onClick={() => this.onSend()}
                >
                  Sjá niðurstöður
                </button>
              )}
            </div>
          )}
          {isLastQuestion && !hasSomeAnswers && (
            <p style={{ margin: '1rem 0' }}>
              Til að sjá niðurstöður verður þú að taka afstöðu með eða móti
              allavega einni fullyrðingu.
            </p>
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
    const { isEmbedded } = this.props;
    const { showReset } = this.state;

    if (disableTest) {
      return (
        <div className={s.lead}>
          <p>
            <strong>
              Við erum að vinna í að uppfæra prófið fyrir kosningarnar 2024.
              Nýtt kosningapróf kemur innan skamms. Þangað til getur þú tekið{' '}
              <a href="https://2021.kjosturett.is/kosningaprof">
                prófið frá 2021
              </a>
            </strong>
          </p>
        </div>
      );
    }

    return (
      <div className={s.lead}>
        <p>
          <strong>
            Við erum að vinna í að uppfæra prófið fyrir kosningarnar 2024 en
            þangað til getur þú tekið prófið frá árinu 2021
          </strong>
        </p>
        <p>
          Taktu kosningarpróf <strong>Kjóstu rétt</strong> til þess að sjá hvaða
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
        {!disableTest && (
          <div
            ref={element => {
              this.questionsEl = element;
            }}
          >
            {this.renderAllQuestions()}
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(s, SliderStyles)(Kosningaprof);
