import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './styles.scss';
import history from '../../history';
import answers from '../../../data/poll/answers.json';
import Link from '../../Link';
import Party from '../../components/Party';
import PartyGrid from '../../components/PartyGrid';

const distanceValueMap = {
  '0': 0,
  '0.2': 1,
  '0.8': 1,
  '1': 2,
  '1.6': 4,
  '1.8': 4,
  '2': 4,
};

class CompareParties extends PureComponent {
  state = {
    selected: [],
    isEditing: false,
  };
  render() {
    const {
      questions,
      parties,
      filterParties,
      replyDistance,
      score,
      url,
    } = this.props;

    if (this.state.isEditing || filterParties.length < 2) {
      return (
        <div className={s.root}>
          <h1 className={s.heading}>
            Veldu stjórnmálaflokka til að bera saman
          </h1>
          <div className={s.chooseContainer}>
            <PartyGrid>
              {parties.map(party => {
                const isSelected = this.state.selected.includes(party.letter);
                return (
                  <Party
                    {...party}
                    key={party.letter}
                    isSelected={isSelected}
                    isFaded={this.state.selected.length && !isSelected}
                    onClick={() => {
                      this.setState(({ selected }) => {
                        if (selected.includes(party.letter)) {
                          return {
                            selected: selected.filter(x => x !== party.letter),
                          };
                        }

                        return {
                          selected: [...selected, party.letter],
                        };
                      });
                    }}
                  />
                );
              })}
            </PartyGrid>
          </div>
          {this.state.selected.length === 1 && (
            <p style={{ textAlign: 'center', marginTop: '20px' }}>
              Veldu amk. einn flokk til viðbótar.
            </p>
          )}
          {this.state.selected.length > 1 && (
            <div className={s.buttonContainer}>
              <button
                className={s.edit}
                onClick={() => {
                  this.setState({ selected: [] });
                  history.replace(`/flokkar/bera-saman/`);
                }}
              >
                Hreinsa val
              </button>
              <button
                className={s.edit}
                onClick={() => {
                  this.setState({ isEditing: false });
                  history.push(
                    `/flokkar/bera-saman/${this.state.selected.join('')}`
                  );
                }}
              >
                Bera Saman
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className={s.root}>
        <h1 className={s.heading}>Samanburður eftirfarandi stjórnmálaflokka</h1>

        <div className={s.chooseContainer}>
          <PartyGrid>
            {filterParties.map(party => {
              return <Party {...party} key={party.letter} />;
            })}
          </PartyGrid>
        </div>
        <button
          className={cx(s.edit, s.newSelection)}
          onClick={() =>
            this.setState({
              isEditing: true,
              selected: filterParties.map(x => x.letter),
            })
          }
        >
          Velja aðra flokka
        </button>
        {filterParties.length > 1 && (
          <h2
            id="score"
            className={s.scoreContainer}
          >{`Flokkarnir eiga ${score.toFixed(0)}% samleið`}</h2>
        )}
        {filterParties.length > 1 && (
          <p className={s.buttons}>
            <Link
              className={s.shareButton}
              style={{ background: '#4760a5' }}
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                'https://kjosturett.is' + url
              )}`}
              target="_blank"
            >
              {`Deila samanburði á Facebook`}
            </Link>
            <Link
              className={s.shareButton}
              style={{ background: '#1da0f2', marginLeft: '15px' }}
              href={`https://twitter.com/home?status=${encodeURIComponent(
                'Samanburður flokka á kjósturétt.is: https://kjosturett.is' +
                  url
              )}`}
              target="_blank"
            >
              {`Deila samanburði á Twitter`}
            </Link>
          </p>
        )}
        <p className={s.resultDisclaimer}>
          Niðurstöður eru reiknaðar út frá eftirfarandi fullyrðingum:
        </p>
        {filterParties.length > 1 && (
          <div className={s.questionsContainer}>
            {questions
              .map(question => ({
                ...question,
                replies: filterParties.map(p => p.reply[question.id - 1]),
                distance: replyDistance[question.id - 1],
              }))
              .sort((a, b) => {
                if (a.distance > b.distance) return 1;
                if (a.distance < b.distance) return -1;
                return 0;
              })
              .map(({ id, question, replies, distance }) => {
                return (
                  <div className={s.partyQuestion} key={id}>
                    <h4>
                      <i
                        className={cx(
                          s.dot,
                          !distance !== 0 &&
                            s[
                              `dot${
                                distanceValueMap[
                                  Math.round(distance * 100) / 100
                                ]
                              }`
                            ]
                        )}
                      />
                      {question}
                    </h4>
                    {distance === 0 && filterParties.length === 2 && (
                      <div>
                        {`Báðir flokkarnir eru ${(
                          answers.textMap[replies[0]] || `axel 1 ${replies[0]}`
                        ).toLowerCase()}${
                          ['3', '6'].includes(replies[0]) ? 'ir gagnvart' : ''
                        } fullyrðingunni`}
                      </div>
                    )}
                    {distance === 0 && filterParties.length > 2 && (
                      <div>
                        {`Allir flokkarnir eru ${(
                          answers.textMap[replies[0]] || 'axel 2'
                        ).toLowerCase()}${
                          ['3', '6'].includes(replies[0]) ? 'ir gagnvart' : ''
                        } fullyrðingunni`}
                      </div>
                    )}
                    {distance > 0 && (
                      <div>
                        {filterParties.map(party => (
                          <div key={party.name}>
                            <p>
                              <span>{party.name}</span>{' '}
                              {`${
                                ['Píratar', 'Vinstri Græn'].includes(party.name)
                                  ? 'eru'
                                  : 'er'
                              } `}
                              <b>
                                {(
                                  answers.textMap[party.reply[id - 1]] ||
                                  `axel3 -- ${party.reply[id - 1]}`
                                ).toLowerCase()}
                              </b>
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(s)(CompareParties);
