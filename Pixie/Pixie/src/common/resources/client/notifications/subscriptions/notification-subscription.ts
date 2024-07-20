export interface NotificationSubscription {
  id?: number;
  name: string;
  notif_id: string;
  channels: {[key: string]: boolean};
}

export interface NotificationSubscriptionGroup {
  group_name: string;
  subscriptions: Pick<NotificationSubscription, 'name' | 'notif_id'>[];
}
