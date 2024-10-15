import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import styles from './VideoPlayer.scss';

const Container = ({ video, poster }) => (
  <video
    id="my-video"
    className="video-js"
    controls
    preload="auto"
    width="100%"
    height="500"
    poster={poster}
    data-setup="{}"
    muted
    autoPlay
  >
    <source src={video} type="video/mp4" />
    <p className="vjs-no-js">
      To view this video please enable JavaScript, and consider upgrading to a
      web browser that
      <a href="https://videojs.com/html5-video-support/" target="_blank">
        supports HTML5 video
      </a>
    </p>
  </video>
);

export default withStyles(styles)(Container);
