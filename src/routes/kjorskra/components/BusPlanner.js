// @flow

import React, { PureComponent, PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './BusPlanner.scss';

const WalkIcon = () => (
  <img src={require('./walk.png')} style={{ marginLeft: '10px' }} />
);
const BusIcon = ({ number }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: '10px',
      background: '#ffce04',
      borderRadius: '100%',
      width: '28px',
      height: '28px',
      color: '#ad0000',
      fontWeight: 'bold'
    }}
  >
    {number}
  </div>
);

class BusPlanner extends PureComponent {
  static contextTypes = {
    fetch: PropTypes.func.isRequired
  };
  state = {
    data: null
  };
  async componentDidMount() {
    const { from, to } = this.props;

    const now = new Date();
    const timestamp = `${now.getHours()}:${('0' + now.getMinutes()).substr(
      -2
    )}`;

    const date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

    const url = `https://otp.straeto.is/otp/routers/default/plan?fromPlace=${from.lat},${from.lng}&toPlace=${to.lat},${to.lng}&time=${timestamp}&date=${date}&mode=TRANSIT,WALK&arriveBy=false&wheelchair=false&showIntermediateStops=false&numItineraries=3&locale=is`;

    const response = await this.context.fetch(url, {
      headers: {
        Accept: 'application/json'
      }
    });
    const data = await response.json();

    this.setState({
      data
    });
  }
  render() {
    const { data } = this.state;

    return (
      <div>
        <h3>Taktu gullvagninn á kjörstað með Strætó</h3>
        {data && (
          <div className={s.routes}>
            {data.plan.itineraries.map((itinery, index) => {
              console.log('itinery', itinery);

              const startDate = new Date(itinery.startTime);
              const start = `${startDate.getHours()}:${('0' +
                startDate.getMinutes()
              ).substr(-2)}`;

              const endDate = new Date(itinery.endTime);
              const end = `${endDate.getHours()}:${('0' + endDate.getMinutes()
              ).substr(-2)}`;

              return (
                <div key={index} className={s.route}>
                  <p>
                    <b>{`${start} - ${end}`}</b>, tekur{' '}
                    <b>{Math.ceil(itinery.duration / 60)}</b> mínútur
                  </p>
                  <div className={s.itinery}>
                    {itinery.legs.map((leg, i) => {
                      return (
                        <div key={i}>
                          {leg.mode === 'WALK' ? (
                            <WalkIcon />
                          ) : (
                            <BusIcon number={leg.route} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {!data && <p>Hleð gögnum</p>}
        <p>
          Fáðu nánari upplýsingar á{' '}
          <a href="https://straeto.is" target="_blank">
            Strætó.is
          </a>
        </p>
      </div>
    );
  }
}

export default withStyles(s)(BusPlanner);
