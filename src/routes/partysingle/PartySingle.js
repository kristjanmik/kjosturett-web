// @flow

import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Collapsable from '../../components/Collapsable';
import PartyProfile from '../../components/PartyProfile';
import { getAssetUrl } from '../../utils';
import Candidate from '../../components/Candidate/Candidate.js';
import groupBy from 'lodash/groupBy';
import s from './PartySingle.scss';
import CollapsableStyles from '../../components/Collapsable/Collapsable.scss';

const CONSTITUENCY_ENUM = {
  nordaustur: 'Norðausturkjördæmi',
  nordvestur: 'Norðvesturkjördæmi',
  nordur: 'Norðausturkjördæmi',
  sudur: 'Suðurkjördæmi',
  sudvestur: 'Suðvesturkjördæmi',
  'reykjavik-sudur': 'Reykjavíkurkjördæmi suður',
  'reykjavik-nordur': 'Reykjavíkurkjördæmi norður',
};

class PartySingle extends PureComponent {
  renderCandidates(candidatesByconstituencies) {
    return (
      <div>
        {Object.keys(candidatesByconstituencies).map(constituency => (
          <div key={constituency}>
            <div className={s.subtitle}>
              <span>{CONSTITUENCY_ENUM[constituency]}</span>
            </div>
            {candidatesByconstituencies[constituency].map(candidate => (
              <Candidate
                key={candidate.slug}
                name={candidate.nafn}
                place={candidate.saeti}
                slug={candidate.slug}
                party={candidate.bokstafur}
                color={this.props.party.color}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }
  render() {
    const { party, categories, partyCandidates } = this.props;
    return (
      <div className={s.root}>
        <div className={s.header}>
          <PartyProfile {...party} />
          <img
            className={s.logo}
            src={getAssetUrl('party-icons', party.url)}
            alt="Logo"
          />
        </div>
        <div className={s.topics}>
          <Collapsable
            openByDefault
            items={
              categories && [
                ...categories.map(({ name, category, statement }) => ({
                  key: category,
                  title: name,
                  content:
                    statement ||
                    `${party.name} hefur ekki skilað inn umfjöllun um ${name.toLowerCase()}.`,
                })),
                {
                  key: 'frambod',
                  title: 'Framboð',
                  children: this.renderCandidates(
                    groupBy(partyCandidates, 'kjordaemi')
                  ),
                },
              ]
            }
          />
        </div>
      </div>
    );
  }
}

export default withStyles(s)(PartySingle);
