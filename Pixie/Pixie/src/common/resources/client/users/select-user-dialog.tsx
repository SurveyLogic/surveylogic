import {Dialog} from '../ui/overlays/dialog/dialog';
import {DialogHeader} from '../ui/overlays/dialog/dialog-header';
import {Trans} from '../i18n/trans';
import {DialogBody} from '../ui/overlays/dialog/dialog-body';
import {TextField} from '../ui/forms/input-field/text-field/text-field';
import {SearchIcon} from '../icons/material/Search';
import {useState} from 'react';
import {useTrans} from '../i18n/use-trans';
import {message} from '../i18n/message';
import {Avatar} from '../ui/images/avatar';
import {NormalizedModel} from '../datatable/filters/normalized-model';
import {IllustratedMessage} from '../ui/images/illustrated-message';
import {SvgImage} from '../ui/images/svg-image/svg-image';
import teamSvg from '../admin/roles/team.svg';
import {useDialogContext} from '../ui/overlays/dialog/dialog-context';
import {USER_MODEL} from '../auth/user';
import {useNormalizedModels} from './queries/use-normalized-models';

interface SelectUserDialogProps {
  onUserSelected: (user: NormalizedModel) => void;
}

export function SelectUserDialog({onUserSelected}: SelectUserDialogProps) {
  const {close} = useDialogContext();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const {trans} = useTrans();
  const query = useNormalizedModels(USER_MODEL, {
    query: searchTerm,
    perPage: 14,
  });
  const users = query.data?.results || [];

  const emptyStateMessage = (
    <IllustratedMessage
      className="pt-20"
      size="sm"
      title={<Trans message="No matching users" />}
      description={<Trans message="Try another search query" />}
      image={<SvgImage src={teamSvg} />}
    />
  );

  const selectUser = (user: NormalizedModel) => {
    close();
    onUserSelected(user);
  };

  return (
    <Dialog>
      <DialogHeader>
        <Trans message="Select a user" />
      </DialogHeader>
      <DialogBody>
        <TextField
          autoFocus
          className="mb-20"
          startAdornment={<SearchIcon />}
          placeholder={trans(message('Search for user by name or email'))}
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
          }}
        />
        {!query.isLoading && !users.length && emptyStateMessage}
        <div className="grid grid-cols-2 gap-x-10">
          {users.map(user => (
            <UserListItem
              key={user.id}
              user={user}
              onUserSelected={selectUser}
            />
          ))}
        </div>
      </DialogBody>
    </Dialog>
  );
}

interface UserListItemProps {
  user: NormalizedModel;
  onUserSelected: (user: NormalizedModel) => void;
}
function UserListItem({user, onUserSelected}: UserListItemProps) {
  return (
    <div
      key={user.id}
      className="flex items-center gap-10 outline-none focus-visible:ring ring-offset-4 hover:bg-hover p-10 rounded"
      role="button"
      tabIndex={0}
      onClick={() => {
        onUserSelected(user);
      }}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onUserSelected(user);
        }
      }}
    >
      <Avatar src={user.image} />
      <div className="overflow-hidden">
        <div className="text-ellipsis overflow-hidden">{user.name}</div>
        <div className="text-muted text-ellipsis overflow-hidden">
          {user.description}
        </div>
      </div>
    </div>
  );
}
