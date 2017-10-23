// @flow

import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Collapsable from '../../components/Collapsable';
import PartyProfile from '../../components/PartyProfile';
import { getAssetUrl } from '../../utils';
import Candidate from '../../components/Candidate/Candidate.js';
import s from './PartySingle.scss';

class PartySingle extends PureComponent {
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
              categories &&
              categories.map(({ name, category, statement }) => ({
                key: category,
                title: name,
                content:
                  statement ||
                  `${party.name} hefur ekki skilað inn umfjöllun um ${name.toLowerCase()}.`,
              }))
            }
          />
        </div>
          <div className={s.candidatesContainer}>
            {
              partyCandidates.map((candidate, index) => {
                console.log(candidate.nafn)
                return (
                  <Candidate
                    key={index}
                    name={candidate.nafn}
                    place={candidate.saeti}
                    slug={candidate.slug}
                    party={candidate.bokstafur}
                  />
                )
              })
            }
          </div>
      </div>
    );
  }
}

export default withStyles(s)(PartySingle);
