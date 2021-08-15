// @flow

import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './About.scss';

class About extends PureComponent {
  render() {
    return (
      <div className={s.root}>
        <p>
          Kjósturétt.is er óháður upplýsingavefur í aðdraganda kosninga sem fór
          fyrst í loftið fyrir alþingiskosningarnar árið 2013. Í gegnum þrennar
          kosningar hefur vefurinn því verið þjóðinni innan handar. Allar
          upplýsingarnar á vefnum eru fengnar frá stjórnmálaflokkunum sjálfum og
          eru þær settar fram óbreyttar. Verkefnið er unnið í góðgerðarstarfi af
          Íslendingum og er öll vinnan aðgengileg á{' '}
          <a
            href="https://github.com/kristjanmik/kjosturett-web"
            target="_blank"
          >
            Github
          </a>
          . Við vonum að vefurinn hjálpi þér, kæri kjósandi, og skili þér með
          gott veganesti á kjörstaði.
        </p>

        <h3>Stofnendur verkefnisins</h3>

        <div className={s.we}>
          <div className={s.person}>
            <img className={s.img} src={'/kristjan.jpg'} alt="Kristján" />
            <p className={s.name}>Kristján Ingi Mikaelsson</p>
          </div>
          <div className={s.person}>
            <img className={s.img} src={'/ragnar.jpg'} alt="Ragnar" />
            <p className={s.name}>Ragnar Þór Valgeirsson</p>
            <p className={s.title}>
              Meðeigandi og forritari hjá{' '}
              <a href="https://aranja.com" target="_blank">
                Aranja
              </a>
            </p>
          </div>
        </div>

        <h3>Að verkefninu hafa einnig komið</h3>

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
