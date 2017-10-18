let isOpen = true;

// the site is always open in dev mode
if (__DEV__) {
  isOpen = true;
}

// Let's automatically open this thing at 18:10 for brevity
const openTimestamp = 1508177400000;

export default () =>
  // Browser won't have access to the isOpen boolean
  process.env.BROWSER || Date.now() > openTimestamp || isOpen;

export const goLive = () => {
  isOpen = true;
};

export const manualOpeningDone = () => isOpen || Date.now() > openTimestamp;
