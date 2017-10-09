import React, { PureComponent } from 'react'
import Countdown from '../../components/Countdown'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import logo from '../../logo.svg'
import s from './ComingSoon.scss'

class ComingSoon extends PureComponent {
  render() {
    return (
      <div className={s.root}>
        <div className={s.logoWrap}>
          <img src={logo} className={s.logo} />
          <div className={s.countDown}>
            <Countdown />
          </div>
        </div>
        <p className={s.intro}>
          Ný síða Kjóstu Rétt opnar mánudaginn 16. Október.
        </p>
      </div>
    )
  }
}

export default withStyles(s)(ComingSoon)
