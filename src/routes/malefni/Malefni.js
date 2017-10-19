import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import categories from '../../../data/build/categories.json';

import s from './Malefni.scss';

class Malefni extends PureComponent {
  render() {
    return (
      <div className={s.root}>
        <div className={s.categories}>
          {categories.map(category => (
            <a
              href={`/malefni/${category.url}`}
              className={s.category}
              key={category.url}
            >
              <img src={category.image} className={s.image} />
              <h4 className={s.name}>{category.name}</h4>
            </a>
          ))}
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Malefni);
