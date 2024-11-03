export default function questionAnswer(reply = []) {
  return reply.reduce((all, answer, index) => {
    // eslint-disable-next-line no-param-reassign
    all[index + 1] = parseInt(answer, 10);
    return all;
  }, {});
}
