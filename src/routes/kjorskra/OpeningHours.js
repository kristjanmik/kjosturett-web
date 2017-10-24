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
    const openReykjavik = new Date('Saturday, October 28, 2017 9:00:00 AM');
    const closeReykjavik = new Date('Saturday, October 28, 2017 10:00:00 PM');
    return (
      <div>
        {sveitafelag.includes('Reykjavík') && (
          <div>
            <div>
              Kjörstaðurinn þinn verður opinn frá klukkan
              <b> 9:00 - 22:00</b>
            </div>
          </div>
        )}
        <div>
          {now.getDate() === 24 &&
            now.getHours() >= openReykjavik.getHours() && (
              <Countdown
                date={closeReykjavik}
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
    );
  }
}

export default OpeningHours;
