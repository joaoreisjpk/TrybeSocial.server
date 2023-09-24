export default (message, ...rest) => {
  if (JSON.parse(process.env.DEBUG)) console.log(message, rest);
};
