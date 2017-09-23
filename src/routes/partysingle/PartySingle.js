import React, { PureComponent } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import { Collapse } from 'react-collapse';
import Scroll from 'react-scroll';
import PartyProfile from '../../components/PartyProfile';
import s from './PartySingle.scss';

const scroll = Scroll.animateScroll;

class PartySingle extends PureComponent {
  state = {
    open: [],
  };
  render() {
    const { open } = this.state;
    const { party, categories } = this.props;

    return (
      <div className={s.root}>
        <PartyProfile {...party} />
        <div className={s.categories}>
          {categories.map(category => (
            <div className={s.category} key={category.category}>
              <div className={s.info}>
                <div>
                  <img
                    src={`https://s3.eu-west-2.amazonaws.com/assets.kjosturett.is/${category.category}_black.svg`}
                    className={s.image}
                  />
                </div>
                <h5
                  className={s.name}
                  onClick={(e) => {
                    let found = false;
                    const newOpen = [...this.state.open].filter((categoryUrl) => {
                      console.log(categoryUrl, category);
                      if (categoryUrl === category.category) {
                        found = true;
                        return false;
                      }
                      return true;
                    });

                    if (!found) {
                      newOpen.push(category.category);
                    }

                    this.setState(() => ({
                      open: newOpen,
                    }));

                    let curtop = 0;
                    if (e.target.offsetParent) {
                      do {
                        curtop += e.target.offsetTop;
                      } while ((e.target = e.target.offsetParent));
                    }
                    scroll.scrollTo(curtop - 20);
                  }}
                >
                  {category.name}
                </h5>
              </div>
              <Collapse
                isOpened={
                  category.statement === '' ||
                  open.indexOf(category.category) > -1
                }
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      category.statement !== ''
                        ? category.statement
                        : 'Ekkert svar barst við þessum málaflokki',
                  }}
                  className={cx(
                    s.text,
                    category.statement === '' ? s.textNoReply : null,
                  )}
                />
              </Collapse>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default withStyles(s)(PartySingle);
