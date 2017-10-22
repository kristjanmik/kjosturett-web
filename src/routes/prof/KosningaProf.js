import React, { PureComponent } from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'
import Scroll from 'react-scroll'
import queryString from 'query-string'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import { encodeAnswersToken } from '../../utils'
import s from './KosningaProf.scss'
import checkmark from '../../checkmark.svg'

const areYouSure =
  'Ertu viss um að þú viljir yfirgefa síðuna núna? Öll svörin munu týnast.'

const initialAnswers = questions =>
  questions.reduce((all, { id }) => {
    // eslint-disable-next-line
    all[id] = defaultAnswer;
    return all;
  }, {})

class Kosningaprof extends PureComponent {
  static contextTypes = {
    fetch: PropTypes.func.isRequired,
  }
  static propTypes = {
    answers: PropTypes.shape({
      default: PropTypes.string.isRequired,
      textMap: PropTypes.object.isRequired,
    }),
    questions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        question: PropTypes.string.isRequired,
      })
    ).isRequired
  };
  constructor(props) {
    super(props)
    this.state = {
      started: false,
      token: null,
      finished: false,
      visible: {},
      showReset: false,
      answers: initialAnswers(this.props.questions),
    }

    this.positions = {}

    this.onScroll = this.onScroll.bind(this)
    this.onLayout = this.onLayout.bind(this)
    this.onSend = this.onSend.bind(this)
  }
  componentDidMount() {
    const { token } = queryString.parse(window.location.search);

    let answers = this.state.answers;
    let showReset = false;
    try {
      answers = JSON.parse(localStorage.getItem(storageKey));
      showReset = true;
    } catch (error) {}

    window.addEventListener('resize', this.onLayout)
    window.addEventListener('layout', this.onLayout)
    window.addEventListener('scroll', this.onScroll)

    this.onLayout()
    this.onScroll()
    
    // eslint-disable-next-line
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
  componentWillUnmount() {
    window.onbeforeunload = null
  }
  onChange = id => ({ target }) => {
    setTimeout(() => {
      Scroll.animateScroll.scrollTo(this.positions[~~id + 1] - 110)
    }, 500)

    this.setState(({ answers, started }) => {
      if (!started) {
        window.onbeforeunload = event => {
          // eslint-disable-next-line
          event.returnValue = areYouSure
          return areYouSure
        }
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
      const { top } = question.getBoundingClientRect()
      this.positions[question.id] = top
    })
    this.viewHeight_ = window.innerHeight
  }
  onScroll() {
    const bottom = window.pageYOffset + 0.75 * this.viewHeight_
    const visible = {}

    Object.keys(this.positions).forEach(id => {
      visible[id] = this.positions[id] < bottom
    })

    this.setState({ visible })
  }
  async onSend() {
    const { answers, token } = this.state
    const answerValues = Object.keys(answers)
      .map(x => answers[x])
      .map(x => (x == null ? this.props.answers.default : x))

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
    })

    this.setState({ finished: true })
  }
  render() {
    const { questions } = this.props
    const { answers, started, finished, visible } = this.state
    const answerMap = this.props.answers.textMap
    return (
      <div className={s.root}>
        {finished && <h3>Takk fyrir þátttökuna!</h3>}
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
                  const name = `${id}_${value}`
                  const active = answers[id] === value
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
                  )
                })}
              </div>
            ))}
        </div>
        {started && !finished && <button onClick={this.onSend}>Senda</button>}
      </div>
    )
  }
}

export default withStyles(s)(Kosningaprof)
