import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import Collapsable from '../../components/Collapsable';
import Link from '../../Link';
import Scroll from 'react-scroll';
import { getAssetUrl } from '../../utils';
import s from './MalefniSingle.scss';

class MalefniSingle extends PureComponent {
  render() {
    const { parties, categories, selectedCategory } = this.props;

    return (
      <div className={s.root}>
        <div className={s.categories}>
          {categories.map(category => (
            <Link
              key={category.url}
              className={cx(
                s.category,
                category.url === selectedCategory ? s.categoryActive : null
              )}
              href={`/malefni/${category.url}`}
            >
              {category.name}
            </Link>
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
              image: getAssetUrl(party.url),
            }))
          }
        />
      </div>
    );
  }
}

export default withStyles(s)(MalefniSingle);
