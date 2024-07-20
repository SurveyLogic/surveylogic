import {useEffect, useState} from 'react';
import {produce} from 'immer';
import {useNotificationSubscriptions} from './requests/notification-subscriptions';
import {Navbar} from '../../ui/navigation/navbar/navbar';
import {ProgressCircle} from '../../ui/progress/progress-circle';
import {Checkbox} from '../../ui/forms/toggle/checkbox';
import {useUpdateNotificationSettings} from './requests/update-notification-settings';
import {Button} from '../../ui/buttons/button';
import {NotificationSubscriptionGroup} from './notification-subscription';
import {toast} from '../../ui/toast/toast';
import {Trans} from '../../i18n/trans';
import {message} from '../../i18n/message';
import {useIsMobileMediaQuery} from '../../utils/hooks/is-mobile-media-query';

type Selection = Record<string, ChannelSelection>;

// {email: true, mobile: true, browser: false}
type ChannelSelection = Record<string, boolean>;

export function NotificationSettingsPage() {
  const updateSettings = useUpdateNotificationSettings();
  const {data, isFetched} = useNotificationSubscriptions();
  const [selection, setSelection] = useState<Selection>();

  useEffect(() => {
    if (data && !selection) {
      const initialSelection: Selection = {};
      const initialValue: ChannelSelection = {};
      data.available_channels.forEach(channel => {
        initialValue[channel] = false;
      });

      data.subscriptions.forEach(group => {
        group.subscriptions.forEach(subscription => {
          const backendValue = data.user_selections.find(
            s => s.notif_id === subscription.notif_id
          );
          initialSelection[subscription.notif_id] = backendValue?.channels || {
            ...initialValue,
          };
        });
      });
      setSelection(initialSelection);
    }
  }, [data, selection]);

  return (
    <div className="bg-alt min-h-full">
      <Navbar menuPosition="notifications-page" />
      {!isFetched || !data || !selection ? (
        <div className="container mx-auto my-100 flex justify-center">
          <ProgressCircle
            size="md"
            isIndeterminate
            aria-label="Loading subscriptions..."
          />
        </div>
      ) : (
        <div className="container px-10 md:px-20 my-20 md: my-40 mx-auto">
          <div className="px-20 pt-20 pb-30 rounded border bg-paper">
            {data.subscriptions.map(group => (
              <div key={group.group_name} className="mb-10 text-sm">
                <GroupRow
                  key={group.group_name}
                  group={group}
                  allChannels={data?.available_channels}
                  selection={selection}
                  setSelection={setSelection}
                />
                {group.subscriptions.map(subscription => (
                  <SubscriptionRow
                    key={subscription.notif_id}
                    subscription={subscription}
                    selection={selection}
                    setSelection={setSelection}
                    allChannels={data?.available_channels}
                  />
                ))}
              </div>
            ))}
            <Button
              className="mt-20 ml-10"
              variant="flat"
              color="primary"
              disabled={updateSettings.isLoading}
              onClick={() => {
                updateSettings.mutate(
                  Object.entries(selection).map(([notifId, channels]) => {
                    return {notif_id: notifId, channels};
                  })
                );
              }}
            >
              <Trans message="Update preferences" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

interface GroupRowProps {
  group: NotificationSubscriptionGroup;
  allChannels: string[];
  selection: Selection;
  setSelection: (value: Selection) => void;
}
function GroupRow({
  group,
  allChannels,
  selection,
  setSelection,
}: GroupRowProps) {
  const isMobile = useIsMobileMediaQuery();
  const toggleAll = (channelName: string, value: boolean) => {
    const nextState = produce(selection, draftState => {
      Object.keys(selection).forEach(notifId => {
        draftState[notifId][channelName] = value;
      });
    });
    setSelection(nextState);
  };

  const checkboxes = (
    <div className="ml-auto flex items-center gap-40">
      {allChannels.map(channelName => {
        const allSelected = Object.values(selection).every(s => s[channelName]);
        const someSelected =
          !allSelected && Object.values(selection).some(s => s[channelName]);
        return (
          <Checkbox
            key={channelName}
            orientation="vertical"
            isIndeterminate={someSelected}
            checked={allSelected}
            onChange={async e => {
              if (channelName === 'browser') {
                const granted = await requestBrowserPermission();
                toggleAll(channelName, !granted ? false : !allSelected);
              } else {
                toggleAll(channelName, !allSelected);
              }
            }}
          >
            <Trans message={channelName} />
          </Checkbox>
        );
      })}
    </div>
  );

  return (
    <div className="flex items-center p-10 border-b">
      <div className="font-medium">
        <Trans message={group.group_name} />
      </div>
      {!isMobile && checkboxes}
    </div>
  );
}

interface SubscriptionRowProps {
  subscription: {name: string; notif_id: string};
  allChannels: string[];
  selection: Selection;
  setSelection: (value: Selection) => void;
}
function SubscriptionRow({
  subscription,
  allChannels,
  selection,
  setSelection,
}: SubscriptionRowProps) {
  const notifId = subscription.notif_id;

  const toggleChannel = (channelName: string, value: boolean) => {
    const nextState = produce(selection, draftState => {
      draftState[subscription.notif_id][channelName] = value;
    });
    setSelection(nextState);
  };

  return (
    <div className="md:flex items-center py-10 pl-8 md:pl-20 pr-10 border-b">
      <div className="pb-14 md:pb-0 font-semibold md:font-normal">
        <Trans message={subscription.name} />
      </div>
      <div className="ml-auto flex items-center gap-40">
        {allChannels.map(channelName => (
          <Checkbox
            key={channelName}
            orientation="vertical"
            checked={selection[notifId][channelName]}
            onChange={async e => {
              const newValue = !selection[notifId][channelName];
              if (channelName === 'browser') {
                const granted = await requestBrowserPermission();
                toggleChannel(channelName, !granted ? false : newValue);
              } else {
                toggleChannel(channelName, newValue);
              }
            }}
            aria-label={channelName}
          >
            <div className="md:invisible md:h-0">
              <Trans message={channelName} />
            </div>
          </Checkbox>
        ))}
      </div>
    </div>
  );
}

function requestBrowserPermission(): Promise<boolean> {
  if (Notification.permission === 'granted') {
    return Promise.resolve(true);
  }
  if (Notification.permission === 'denied') {
    toast.danger(
      message(
        'Notifications blocked. Please enable them for this site from browser settings.'
      )
    );
    return Promise.resolve(false);
  }
  return Notification.requestPermission().then(permission => {
    return permission === 'granted';
  });
}
