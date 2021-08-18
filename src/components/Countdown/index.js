import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import CountdownNow from 'react-countdown-now';
import s from './Countdown.scss';

const Countdown = () => (
  <CountdownNow
    date={new Date('Saturday, September 25, 2021 8:00:00 AM')}
    renderer={({ days, completed }) => {
      if (completed) {
        // Render a completed state
        return <div>Alþingiskosningarnar 2021</div>;
      }
      let out = '';
      if (days > 0) {
        out = `${days + 1} dagar í kosningar`;
      }

      return <span>{out}</span>;
    }}
  />
);

export default withStyles(s)(Countdown);
