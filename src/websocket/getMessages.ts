import messages from './messages';

export default (data: { from: string, to: string}, io) => {
  const { from, to } = data;
  const messagesList = messages.filter((item) => [from, to].includes(item.from));
  io.emit('messagesListResponse', messagesList);
};
