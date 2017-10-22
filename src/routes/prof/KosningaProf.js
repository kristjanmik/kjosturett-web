import React, { PureComponent } from 'react'
import cx from 'classnames'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import { encodeAnswersToken } from '../../utils'
import s from './KosningaProf.scss'
import checkmark from '../../checkmark.svg'

const areYouSure =
  'Ertu viss um að þú viljir yfirgefa síðuna núna? Öll svörin munu týnast.'

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
    ).isRequired,
  }
  state = {
    started: false,
    token: null,
    finished: false,
    answers: this.props.questions.reduce((all, { id }) => {
      // eslint-disable-next-line
      all[id] = null
      return all
    }, {}),
  }
  constructor(props) {
    super(props)
    this.onSend = this.onSend.bind(this)
  }
  componentDidMount() {
    const { token } = queryString.parse(window.location.search)
    // eslint-disable-next-line
    this.setState({ token })
  }
  componentWillUnmount() {
    window.onbeforeunload = null
  }
  onChange = id => ({ target }) => {
    this.setState(({ answers, started }) => {
      if (!started) {
        window.onbeforeunload = event => {
          // eslint-disable-next-line
          event.returnValue = areYouSure
          return areYouSure
        }
      }
      return {
        started: true,
        answers: {
          ...answers,
          [id]: target.value,
        },
      }
    })
  }
  async onSend() {
    const { answers, token } = this.state
    const answerValues = Object.keys(answers)
      .map(x => answers[x])
      .map(x => (x === null ? this.props.answers.default : x))

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
    const { answers, started, finished } = this.state
    const answerMap = this.props.answers.textMap
    return (
      <div className={s.root}>
        {finished && <h3>Takk fyrir þátttökuna!</h3>}
        {!finished &&
          questions.map(({ question, id }) => (
            <div key={id} className={s.question}>
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
        {started && !finished && <button onClick={this.onSend}>Senda</button>}
      </div>
    )
  }
}

export default withStyles(s)(Kosningaprof)
