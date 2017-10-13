import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import Collapsable from '../../components/Collapsable';
import Scroll from 'react-scroll';

let scroll = Scroll.animateScroll;
import s from './MalefniSingle.scss';

class MalefniSingle extends PureComponent {
  render() {
    const { parties, categories, selectedCategory } = this.props;

    return (
      <div className={s.root}>
        <div className={s.categories}>
          {categories.map(category => (
            <a
              key={category.url}
              className={cx(
                s.category,
                category.url === selectedCategory ? s.categoryActive : null
              )}
              href={`/malefni/${category.url}`}
            >
              {category.name}
            </a>
          ))}
        </div>
        <Collapsable
          items={
            parties &&
            parties.map(party => ({
              key: party.url,
              title: party.name,
              content:
                party.statement ||
                'Ekkert svar hefur borist við þessum málaflokki',
              image: `https://s3.eu-west-2.amazonaws.com/assets.kjosturett.is/${party.url}.png`,
            }))
          }
        />
      </div>
    );
  }
}

export default withStyles(s)(MalefniSingle);
