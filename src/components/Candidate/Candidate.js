// @flow

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Candidate.scss';
import Avatar from 'react-avatar';

const Candidate = ({ name, place, slug, party }) => (
  <div className={s.candidate}>
    <Avatar 
      name={name}
      round={true}
      color='#ededed'
      src={`https://kjosturett-is.imgix.net/${slug}.jpg?fit=facearea&facepad=2.0&w=300&h=300`} />
    <p><strong>{name}</strong></p>
    <p>{`${place}. sæti`}</p>
  </div>
);

export default withStyles(s)(Candidate);
