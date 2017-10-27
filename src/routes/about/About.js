// @flow

import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './About.scss';

class About extends PureComponent {
  render() {
    return (
      <div className={s.root}>
        <p>
          Algengt er að fólk viti ekki hvað hver og einn stjórnmálaflokkur
          stendur fyrir og hvaða málefni eru höfð í fyrirrúmi. Mikilvægt er að
          geta nálgast þær upplýsingar hjá óháðum miðli sem er ekki að biðla til
          kjósenda.
        </p>

        <p>
          Níu dögum fyrir Alþingiskosningarnar 2013 fór fyrsta útgáfa Kjóstu
          rétt síðunnar í loftið. Verkefnið varð til af illri nauðsyn því erfitt
          var að átta sig á stefnumálum allra 15 stjórnmálaflokkanna sem þá buðu
          sig fram. Í ár er einnig mikið um framboð og eru 11 flokkar að bjóða
          sig fram til kosninga 2017.
        </p>

        <h3>Framkvæmd verkefnisins</h3>
        <p>
          Haft var samband við alla stjórnmálaflokkana sem eru í framboði og
          þeim boðið að senda svör við 13 málefnum. Hver stjórnmálaflokkur
          sendir inn sín svör og Kjóstu rétt endurbirtir þau án breytinga.
        </p>

        <h3>Stofnendur kjósturétt.is</h3>

        <div className={s.we}>
          <div className={s.person}>
            <img className={s.img} src={'/kristjan.jpg'} alt="Kristján" />
            <p className={s.name}>Kristján Ingi Mikaelsson</p>
            <p className={s.title}>
              Frumkvöðull og stofnandi{' '}
              <a href="https://watchboxapp.com/" target="_blank">
                Watchbox
              </a>.
            </p>
          </div>
          <div className={s.person}>
            <img className={s.img} src={'/ragnar.jpg'} alt="Ragnar" />
            <p className={s.name}>Ragnar Þór Valgeirsson</p>
            <p className={s.title}>
              Meðeigandi og forritari hjá{' '}
              <a href="https://aranja.com" target="_blank">
                Aranja
              </a>.
            </p>
          </div>
        </div>

        <h3>Að verkefninu koma einnig</h3>

        <div className={s.contributors}>
          <div className={s.person}>
            <img
              className={s.img}
              src={require('./axel.jpg')}
              alt="Axel Máni"
            />
            <p className={s.name}>Axel Máni</p>
          </div>
          <div className={s.person}>
            <img
              className={s.img}
              src={require('./eirikur.jpg')}
              alt="Eirikur Heiðar Nilsson"
            />
            <p className={s.name}>Eirikur Heiðar Nilsson</p>
          </div>
          <div className={s.person}>
            <img
              className={s.img}
              src={require('./kristjan_lund.jpg')}
              alt="Kristjan Broder Lund"
            />
            <p className={s.name}>Kristjan Broder Lund</p>
          </div>
          <div className={s.person}>
            <img
              className={s.img}
              src={require('./thor.png')}
              alt="Hlöðver Thor Árnason"
            />
            <p className={s.name}>Hlöðver Thor Árnason</p>
          </div>
          <div className={s.person}>
            <img
              className={s.img}
              src={require('./borgar.jpg')}
              alt="Borgar Þorsteinsson"
            />
            <p className={s.name}>Borgar Þorsteinsson</p>
          </div>
        </div>

        <h3>Hafa samband</h3>
        <p>
          Hægt er að hafa samband við Kjóstu rétt í gegnum tölvupóst á netfangið{' '}
          <a href="mailto:kjosturett@kjosturett.is">kjosturett@kjosturett.is</a>
        </p>
      </div>
    );
  }
}

export default withStyles(s)(About);
