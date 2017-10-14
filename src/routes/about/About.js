// @flow

import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Collapsable from '../../components/Collapsable';
import PartyProfile from '../../components/PartyProfile';
import { getAssetUrl } from '../../utils';
import s from './About.scss';

class About extends PureComponent {
  render() {
    return (
      <div className={s.root}>
        <p>
          Kjóstu rétt fór í loftið níu dögum fyrir Alþingiskosningarnar 2013.
          Verkefnið varð til af illri nauðsyn þar sem erfitt var að átta sig á
          stefnumálum allra stjórnmálaflokkanna. Á þeim tíma buðu 15 flokkar sig
          fram en það stefnir í sambærilegan framboðsfjölda í ár þar sem 12
          framboð hafa verið staðfest.
        </p>

        <p>
          Algengt er að fólk viti ekki hvað hver og einn stjórnmálaflokkur
          stendur fyrir og hvaða málefni eru höfð í fyrirrúmi. Mikilvægt er að
          geta nálgast þær upplýsingar hjá óháðum miðli sem er ekki að biðla til
          kjósenda.
        </p>

        <h3>Framkvæmd verkefnisins</h3>
        <p>
          Haft var samband við alla stjórnmálaflokkana og þeim boðið að senda
          svör við þeim 12 málefnum sem lögð voru fram. Hver stjórnmálaflokkur
          sendir inn sín svör og Kjóstu rétt endurbirtir þau án breytinga.
        </p>

        <p>
          Að verkefninu koma Kristján Ingi Mikaelsson frumkvöðull og stofnandi
          Watchbox ásamt Ragnari Þór Valgeirssyni meðeigandi og forritari hjá
          Aranja.
        </p>

        <h3>Styrkja verkefnið</h3>
        <p>
          Verkefnið þiggur ekki neina styrki frá fyrirtækjum og er ekki rekið
          áfram af auglýsingum. Hægt er að styrkja okkur með millifærslu á kt:
          520612-0250 rn:0114-26-006120 eða með kass/aur í númerið 696-4523
        </p>

        <p>Við þökkum kærlega fyrir allan stuðning</p>
      </div>
    );
  }
}

export default withStyles(s)(About);
