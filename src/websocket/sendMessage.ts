import { Imessage } from './interfaces';
import messages from './messages';

export default (data: Imessage, io) => {
  messages.push(data);
  io.emit('receiveMessage', data);
};
