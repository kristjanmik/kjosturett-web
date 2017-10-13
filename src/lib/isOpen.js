let isOpen = false;

//the site is always open in dev mode
if (__DEV__) {
  isOpen = true;
}

export default () => {
  //Browser won't have access to the isOpen boolean
  //Check if clock is more than 18:50 on monday
  return process.env.BROWSER || Date.now() > 1508179800000 || isOpen;
};

export const goLive = () => {
  isOpen = true;
};

export const manualOpeningDone = () => {
  return isOpen || Date.now() > 1508179800000;
};
