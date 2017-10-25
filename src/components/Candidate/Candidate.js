// @flow

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Avatar from 'react-avatar';
import s from './Candidate.scss';

const Candidate = ({ name, place, slug, party, color }) => (
  <div className={s.candidate}>
    <Avatar 
      name={name}
      round={true}
      color={color}
      src={`https://kjosturett-is.imgix.net/${slug}.jpg?fit=facearea&facepad=2.0&w=300&h=300`} />
    <p><strong>{name}</strong></p>
    <p>{`${place}. sæti`}</p>
  </div>
);

export default withStyles(s)(Candidate);
