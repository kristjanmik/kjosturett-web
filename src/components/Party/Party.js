import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import s from './Party.scss';
import { getAssetUrl } from '../../utils';
import Link from '../../Link';

const Container = ({
  url,
  href,
  onClick,
  isSelected,
  isFaded,
  letter,
  name,
  leader
}) => {
  const Wrap = href ? Link : 'button';
  return (
    <Wrap
      href={href}
      onClick={onClick}
      className={cx(s.party, isSelected && s.isSelected, isFaded && s.isFaded)}
    >
      <span className={s.imgWrap}>
        <img
          src={getAssetUrl('party-icons', url)}
          className={s.image}
          alt={`${name}'s logo`}
        />
      </span>
      <span className={s.info}>
        <h3 className={s.name}>{name}</h3>
        <p className={s.leader}>{leader}</p>

        <span className={s.letter}>
          <span>x</span>
          {letter}
        </span>
      </span>
    </Wrap>
  );
};

export default withStyles(s)(Container);
