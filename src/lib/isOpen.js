let isOpen = false;

//the site is always open in dev mode
if (__DEV__) {
  isOpen = true;
}

//Let's automatically open this thing at 18:10 for brevity
const openTimestamp = 1508177400000;

export default () => {
  //Browser won't have access to the isOpen boolean
  return process.env.BROWSER || Date.now() > openTimestamp || isOpen;
};

export const goLive = () => {
  isOpen = true;
};

export const manualOpeningDone = () => {
  return isOpen || Date.now() > openTimestamp;
};
