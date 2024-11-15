import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { encodeAnswersToken } from '../../utils';
import s from './KosningaProf.scss';
import Checkbox from '../../components/Checkbox';
import { cleanAnswer } from '../../utils';

const answerMap = {
  '0': 'Mjög ósammála',
  '1': 'Frekar ósammála',
  '2': 'Frekar sammála',
  '3': 'Mjög sammála',
  '6': 'Sleppa Spurningu',
};
const areYouSure =
  'Ertu viss um að þú viljir yfirgefa síðuna núna? Öll svörin munu týnast.';
const defaultAnswer = null;

class UploadCandidateImage extends PureComponent {
  render() {
    const { token, uploadImageSuccess, uploadImageFailure } = this.props;

    if (uploadImageSuccess) {
      return <p className={s.uploadSuccess}>Innsending á mynd tókst!</p>;
    }
    if (uploadImageFailure) {
      return <p className={s.uploadFailure}>Innsending á mynd tókst ekki.</p>;
    }
    return (
      <div className={s.uploadForm}>
        <h3>Hlaða upp mynd</h3>
        <p>
          Hérna getur þú hlaðið upp mynd af þér sem verður notuð í
          kosningaprófinu
        </p>
        <form
          id="uploadForm"
          action={`/candidate/avatar?token=${token}`}
          method="post"
          encType="multipart/form-data"
        >
          <input type="file" name="avatar" />
          <input type="hidden" name="token" value={token} />
          <input
            type="submit"
            value="Senda inn mynd"
            className={s.uploadSubmit}
          />
        </form>
      </div>
    );
  }
}

class UploadCandidateVideo extends PureComponent {
  render() {
    const { token, uploadVideoSuccess, uploadVideoFailure } = this.props;

    if (uploadVideoSuccess) {
      return <p className={s.uploadSuccess}>Innsending á myndbandi tókst!</p>;
    }
    if (uploadVideoFailure) {
      return (
        <p className={s.uploadFailure}>Innsending á myndbandi tókst ekki.</p>
      );
    }
    return (
      <div className={s.uploadForm}>
        <h3>Hlaða upp myndbandi</h3>
        <p>
          Hérna getur þú hlaðið upp myndbandi sem birtist í kosningaprófinu
          (hámark 60 sek og með .mp4 sniði)
        </p>
        <form
          id="uploadForm"
          action={`/candidate/video?token=${token}`}
          method="post"
          encType="multipart/form-data"
        >
          <input type="file" name="video" />
          <input type="hidden" name="token" value={token} />
          <input
            type="submit"
            value="Senda inn myndband"
            className={s.uploadSubmit}
          />
        </form>
      </div>
    );
  }
}

class Kosningaprof extends PureComponent {
  static contextTypes = {
    fetch: PropTypes.func.isRequired,
  };
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
    error: false,
    finished: false,
    //Submission by a party or a candidate
    partyMode: true,
    answers: this.props.questions.reduce((all, { id }) => {
      // eslint-disable-next-line
      all[id] = defaultAnswer;
      return all;
    }, {}),
  };
  constructor(props) {
    super(props);
    this.onSend = this.onSend.bind(this);
  }
  componentDidMount() {
    const { token, t } = queryString.parse(window.location.search);
    if (!token) {
      window.location = '/';
    }
    // eslint-disable-next-line
    this.setState({ token, partyMode: t === 'p' });
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
        error: false,
        started: true,
        answers: {
          ...answers,
          [id]: target.value,
        },
      };
    });
  };

  isImportant(answer) {
    return answer !== null && answer.includes('!');
  }

  setImportantQuestion(id) {
    const { answers } = this.state;

    const currentValue = answers[id];
    if (this.isImportant(currentValue)) {
      const newValue = cleanAnswer(currentValue);
      this.onChange(id)({ target: { value: `${newValue}` } });
    } else {
      this.onChange(id)({ target: { value: `${currentValue}!` } });
    }
  }

  async onSend() {
    const { answers, token } = this.state;

    const hasNotFinishedAllQuestions = Object.keys(answers).some(
      id => answers[id] === null
    );
    if (hasNotFinishedAllQuestions) {
      this.setState({ error: true });
      return;
    }

    await this.context.fetch(`/konnun/replies?timestamp=${Date.now()}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token,
        reply: encodeAnswersToken(Object.keys(answers).map(x => answers[x])),
      }),
    });

    this.setState({ finished: true });
  }
  render() {
    const {
      questions,
      token,
      uploadImageSuccess,
      uploadImageFailure,
      uploadVideoSuccess,
      uploadVideoFailure,
    } = this.props;
    const { answers, started, finished, error, partyMode } = this.state;

    return (
      <div className={s.root}>
        {!finished && !partyMode && (
          <UploadCandidateImage
            token={token}
            uploadImageSuccess={uploadImageSuccess}
            uploadImageFailure={uploadImageFailure}
          />
        )}
        {!finished && !partyMode && (
          <UploadCandidateVideo
            token={token}
            uploadVideoSuccess={uploadVideoSuccess}
            uploadVideoFailure={uploadVideoFailure}
          />
        )}
        {finished && <h3>Takk fyrir þátttökuna!</h3>}

        {!finished && (
          <div className={s.intro}>
            <h1>Kosningapróf Kjóstu rétt 2024</h1>
            <p>
              Svörin við prófinu birtast í niðurstöðusíðu kosningaprófsins fyrir
              almenning. Það getur tekið allt að 30 mínútur fyrir svörin að
              uppfærast. Nýjasta svarið gildir.{' '}
              <b>
                Athugið að með hverri spurningu sem er sleppt er dregið úr vægi
                annarra innsendra svara og því er ólíklegra að fá þú eða
                flokkurinn komi upp þegar aðrir taka prófið.
              </b>
            </p>
          </div>
        )}
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
                      checked={this._cleanAnswer(answers[id]) === value}
                      onChange={this.onChange(id)}
                    />
                    <label htmlFor={name}>{answerMap[value]}</label>
                  </div>
                );
              })}
              {answers[id] !== null && answers[id] !== '6' && (
                <div className={s.checkbox}>
                  <Checkbox
                    style={{ marginBottom: '0' }}
                    id={id}
                    text="Mikilvæg spurning fyrir mig/flokkinn"
                    onClick={() => this.setImportantQuestion(id)}
                    checked={this.isImportant(answers[id])}
                  />
                </div>
              )}
            </div>
          ))}
        {started && !finished && <button onClick={this.onSend}>Senda</button>}
        {error && (
          <div>
            <strong>
              Vinsamlegast kláraðu að svara öllum spurningum, eða hakaðu við
              sleppa spurningu.
            </strong>
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(s)(Kosningaprof);
