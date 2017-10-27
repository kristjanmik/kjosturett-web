import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Countdown from 'react-countdown-now';

class OpeningHours extends PureComponent {
  static propTypes = {
    sveitafelag: PropTypes.string.isRequired,
  };
  render() {
    const { sveitafelag } = this.props;
    const now = new Date();
    const pollingStations = [
      { municipality: 'Ísafjörður', open: '9:00', close: '21:00' },
      { municipality: 'Bolungarvík', open: '10:00', close: '21:00' },
      { municipality: 'Akureyri', open: '9:00', close: '22:00' },
      { municipality: 'Blönduós', open: '10:00', close: '22:00' },
      { municipality: 'Fljótsdalshérað', open: '9:00', close: '22:00' },
      { municipality: 'Reykjanesbær', open: '9:00', close: '22:00' },
      { municipality: 'Akranes', open: '9:00', close: '22:00' },
      { municipality: 'Garðabær', open: '9:00', close: '22:00' },
      { municipality: 'Hafnarfjörður', open: '9:00', close: '22:00' },
      { municipality: 'Kópavogur', open: '9:00', close: '22:00' },
      { municipality: 'Mosfellsbær', open: '9:00', close: '22:00' },
      { municipality: 'Seltjarnarnes', open: '9:00', close: '22:00' },
      { municipality: 'Reykjavík', open: '9:00', close: '22:00' },
    ];

    const pollingStation = pollingStations.find(station =>
      station.municipality.includes(sveitafelag),
    );
    let start;
    let end;
    let showCountdown;

    if (pollingStation) {
      start = new Date(
        `Saturday, October 28, 2017 ${pollingStation.open}:00 AM`,
      );
      end = new Date(
        `Saturday, October 28, 2017 ${pollingStation.close}:00 PM`,
      );
      showCountdown =
        now.getTime() > start.getTime() && now.getTime() < end.getTime();
    }
    return (
      <div>
        {pollingStation && (
          <div>
            <div>
              Kjörstaðurinn þinn verður opinn frá klukkan
              <b>
                {' '}
                {pollingStation.open} - {pollingStation.close}
              </b>
            </div>
            <div>
              {showCountdown && (
                <Countdown
                  date={end}
                  renderer={({ hours, minutes, completed }) => {
                    if (completed) {
                      // Render a completed state
                      return <div>Kosningum er lokið</div>;
                    }
                    let out = '';
                    if (hours > 0) {
                      out = `og þú hefur enn ${hours} klukkustundir og ${minutes} mínútur til stefnu!`;
                    }
                    return <span>{out}</span>;
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default OpeningHours;
