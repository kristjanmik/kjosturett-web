// @flow

import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Scroll from 'react-scroll';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Collapse } from 'react-collapse';
import styles from './Collapsable.scss';

class Collapsable extends React.Component {
  static propTypes = {
    openByDefault: PropTypes.bool,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        image: PropTypes.string,
      })
    ),
  };
  static defaultProps = {
    openByDefault: false,
    items: [],
  };
  static spring = {
    stiffness: 200,
    damping: 20,
  };
  state = {
    open: this.props.items.reduce((state, item) => {
      state[item.key] = this.props.openByDefault;
      return state;
    }, {}),
  };
  toggle = (key: string) => e => {
    this.setState(state => {
      const open = { ...state.open };
      open[key] = !Boolean(open[key]);
      return { open };
    });

    let curtop = 0;
    if (e.target.offsetParent) {
      do {
        curtop += e.target.offsetTop;
      } while ((e.target = e.target.offsetParent));
    }
    Scroll.animateScroll.scrollTo(curtop - 20);
  };
  render() {
    const { items } = this.props;
    const { open } = this.state;

    return (
      <div className={styles.root}>
        {items.map(({ key, title, content, image }) => (
          <div className={styles.category} key={key}>
            <div className={styles.header} onClick={this.toggle(key)}>
              {image && <img className={styles.image} src={image} />}
              <h3 className={styles.title}>{title}</h3>
            </div>
            <Collapse
              isOpened={open[key] === true}
              springConfig={Collapsable.spring}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: content,
                }}
                className={cx(
                  styles.content
                  // category.statement === '' ? s.textNoReply : null
                )}
              />
            </Collapse>
          </div>
        ))}
      </div>
    );
  }
}

export default withStyles(styles)(Collapsable);
