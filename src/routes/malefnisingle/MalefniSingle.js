import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import { Collapse } from 'react-collapse';
import Scroll from 'react-scroll';

let scroll = Scroll.animateScroll;
import s from './MalefniSingle.scss';

class MalefniSingle extends PureComponent {
  state = {
    open: []
  };
  render() {
    const { open } = this.state;
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
              <div className={s.imageContainer}>
                <img
                  src={`https://s3.eu-west-2.amazonaws.com/assets.kjosturett.is/${category.url}_black.svg`}
                  className={s.image}
                />
              </div>
              <h5 className={s.name}>{category.name}</h5>
            </a>
          ))}
        </div>
        <div className={s.parties}>
          {parties.map(party => (
            <div className={s.party} key={party.url}>
              <div className={s.info}>
                <div>
                  <img src={party.image} className={s.image} />
                </div>
                <h5
                  className={s.name}
                  onClick={e => {
                    let found = false;
                    let open = [...this.state.open].filter(partyUrl => {
                      if (partyUrl === party.url) {
                        found = true;
                        return false;
                      }
                      return true;
                    });

                    if (!found) {
                      open.push(party.url);
                    }

                    this.setState(() => ({
                      open
                    }));

                    var curtop = 0;
                    if (e.target.offsetParent) {
                      do {
                        curtop += e.target.offsetTop;
                      } while ((e.target = e.target.offsetParent));
                    }
                    scroll.scrollTo(curtop - 20);
                  }}
                >
                  {party.name}
                </h5>
              </div>
              <Collapse isOpened={open.indexOf(party.url) > -1}>
                <div
                  dangerouslySetInnerHTML={{ __html: party.statement }}
                  className={s.text}
                />
              </Collapse>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default withStyles(s)(MalefniSingle);
