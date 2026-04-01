// Find more icons to add at: https://mui.com/material-ui/material-icons/
import AccountCircle from '@mui/icons-material/AccountCircle';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import Home from '@mui/icons-material/Home';
import Menu from '@mui/icons-material/Menu';
import MenuOpen from '@mui/icons-material/MenuOpen';
import Notifications from '@mui/icons-material/Notifications';
import NotificationsNone from '@mui/icons-material/NotificationsNone';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Warning from '@mui/icons-material/Warning';

const availableIcons = {
  AccountCircle,
  ArrowDropDown,
  Home,
  Menu,
  MenuOpen,
  Notifications,
  NotificationsNone,
  PersonAdd,
  Warning,
};
// Note: The reason for explicitly defining icons is to reduce bundle size by only including icons being used in the nav.


export const NavIcon = (props) => {
  const { icon, ...remainingProps } = props;

  if (!Object.keys(availableIcons).includes(icon)) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error(`The icon "${ icon }" does not exist in available icons object within "NavIcon" component. Please either add it or choose a different icon`);
    }
    return null;
  }

  const SelectedIcon = availableIcons[icon];
  return (<SelectedIcon { ...remainingProps } />);
};
