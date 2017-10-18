import React from 'react';
import ComingSoon from './ComingSoon';
import { manualOpeningDone } from '../../lib/isOpen';

export default () => {
  if (manualOpeningDone()) {
    return { redirect: '/' };
  }
  return {
    chunks: ['coming-soon'],
    title: 'Kjóstu Rétt 2017',
    component: <ComingSoon />,
  };
};
