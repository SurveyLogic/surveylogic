import {ButtonProps} from '../ui/buttons/button';

export interface DatabaseNotification {
  id: string;
  read_at: string;
  created_at: string;
  type: string;
  data: DatabaseNotificationData;
}

export interface DatabaseNotificationAction {
  label: string;
  action: string;
  // only emit "notificationClicked" event on notification
  // server and don't open "action" link in new window
  emitOnly?: boolean;
  color?: ButtonProps['color'];
}

export interface DatabaseNotificationData {
  image: string;
  warning?: boolean;
  mainAction?: DatabaseNotificationAction;
  buttonActions?: DatabaseNotificationAction[];
  lines: DatabaseNotificationLine[];
}

export interface DatabaseNotificationLine {
  content: string;
  icon?: string;
  type?: 'secondary' | 'primary';
  action?: DatabaseNotificationAction;
}

export interface BroadcastNotification extends DatabaseNotificationData {
  id: string;
  type: string;
}
