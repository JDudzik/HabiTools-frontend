import { NavIcon } from './NavIcon';
import { Link, BadgeIconButton } from 'components';
import { useApiListEventMessages } from 'lib/api/methods/eventMessageApi';


export const NotificationsButton = ({ isUserLoggedIn }) => {
  const { data: eventMessages } = useApiListEventMessages({
    filters: {
      should_notify: true,
      acknowledged: false,
    },
    pagination: {
      page_size: 100,
      page: 1,
    },
  }, {
    enabled: isUserLoggedIn,
    instance: 'global_notifications',
  });

  const notificationCount = eventMessages?.messages?.length || 0;
  const anySevere = eventMessages?.messages?.some(msg => msg.priority >= 3);

  return (
    <Link href="/notifications">
      <BadgeIconButton
        badge={{
          label: anySevere ? 'High priority notifications' : 'notifications',
          content: anySevere ? '!' : notificationCount,
          color: anySevere ? 'error' : 'secondary',
          variant: anySevere ? 'string' : 'standard',
          sx: {
            ' & .MuiBadge-standard': {
              color: 'white',
            },
            '& .MuiBadge-string': {
              fontSize: '1rem',
              fontWeight: 'bold',
            },
          },
        }}
        button={{
          color: 'inherit',
        }}
      >
        <NavIcon icon={ notificationCount > 0 ? 'Notifications' : 'NotificationsNone' } />
      </BadgeIconButton>
    </Link>
  );
};
