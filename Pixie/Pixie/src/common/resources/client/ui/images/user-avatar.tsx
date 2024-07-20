import {Avatar, AvatarProps} from '@common/ui/images/avatar';
import {User} from '@common/auth/user';
import {useContext} from 'react';
import {SiteConfigContext} from '@common/core/settings/site-config-context';

interface UserAvatarProps extends Omit<AvatarProps, 'label' | 'src' | 'link'> {
  user?: User;
}
export function UserAvatar({user, ...props}: UserAvatarProps) {
  const {auth} = useContext(SiteConfigContext);
  return (
    <Avatar
      {...props}
      label={user?.display_name}
      src={user?.avatar}
      link={user?.id && auth.getUserProfileLink?.(user)}
    />
  );
}
