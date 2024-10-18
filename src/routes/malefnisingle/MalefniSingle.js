import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Collapsable from '../../components/Collapsable';
import ListResponsive from '../../components/ListResponsive';
import { getAssetUrl } from '../../utils';
import s from './MalefniSingle.scss';

class MalefniSingle extends PureComponent {
  render() {
    const { parties, categories, selectedCategory } = this.props;

    return (
      <div className={s.root}>
        <ListResponsive
          mobileTitle="Málefni:"
          current={`/malefni/${selectedCategory}`}
          links={categories.map(category => ({
            title: category.name,
            href: `/malefni/${category.url}`,
          }))}
        />
        <Collapsable
          items={
            parties &&
            parties.map(party => ({
              key: party.url,
              title: party.name,
              content:
                party.statement ||
                'Ekkert svar hefur borist við þessum málaflokki.<br/><a href="https://2021.kjosturett.is"> Hér</a> er hægt að nálgast svör úr alþingiskosningunum 2021.',
              image: getAssetUrl('party-icons', party.url),
              //Need to get this from category
              // extra: party.video
              //   ? {
              //       type: 'video',
              //       url: party.video,
              //     }
              //   : null,
            }))
          }
        />
      </div>
    );
  }
}

export default withStyles(s)(MalefniSingle);
