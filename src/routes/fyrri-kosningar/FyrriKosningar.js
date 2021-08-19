import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './FyrriKosningar.scss';
import Link from '../../Link';

const ELECTIONS = [
  {
    year: 2017,
    link: 'https://2017.kjosturett.is',
    title: 'Kosningarnar 2017',
  },
  {
    year: 2013,
    link:
      'http://wayback.vefsafn.is/wayback/20130713200640/http://www.kjosturett.is/kosningar2013',
    title: 'Kosningarnar 2013',
  },
];

const FyrriKosningar = () => (
  <div className={s.root}>
    <p>
      Óháð upplýsingveita Kjóstu rétt hefur verið virk fyrir íslenskar
      alþingiskosningarnar með einum eða öðrum hætti frá árinu 2013. Hér má líta
      til baka og skoða málefni fyrri tíma og þá flokka sem voru í framboði í
      þeim kosningum.
    </p>
    <h3>Alþingiskosningar</h3>
    <ul className={s.list}>
      {ELECTIONS.map(({ link, title }) => (
        <li className={s.election}>
          <Link href={link} key={link} target="_blank">
            {title}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default withStyles(s)(FyrriKosningar);
