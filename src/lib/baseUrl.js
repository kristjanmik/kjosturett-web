export default () => {
  if (process.env.BROWSER) return window.App.apiUrl;
  return (
    process.env.API_CLIENT_URL || `http://localhost:${process.env.PORT || 3000}`
  );
};
