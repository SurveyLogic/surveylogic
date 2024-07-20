import {MessageDescriptor} from './message-descriptor';

interface MessageProps extends Omit<MessageDescriptor, 'message'> {}
export function message(msg: string, props?: MessageProps): MessageDescriptor {
  return {...props, message: msg};
}
