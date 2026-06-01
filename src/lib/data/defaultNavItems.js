/* Example Nav Item: */
/* {
  type: one of: ['link', 'cta'], // undefined uses 'link'
  key: string, // defaults to {text+link}
  text: string,
  ariaLabel: string, // Defaults to "button {text}"
  link: string,
  onClick: function,
  icon: string, // You can find and modify available icons in "NavIcon" component
  disabled: bool,
  requiredPermission: string,
  requiredAuthState: bool, // true = logged in, false = logged out, undefined = either
  location: string, // one of: ['navBar', 'sideDrawer'], undefined = all locations
  children: [
    {...nav items}
  ]
} */


export const defaultNavItems = {
  primary: [
    {
      text: 'Home',
      link: '/home',
    },
    {
      text: 'Tools',
      children: [
        {
          text: 'Auto-Accept Quests',
          link: '/tools/auto-accept-quests',
          ariaLabel: 'Navigate to Auto-Accept Quests tool page',
        },
        {
          text: 'Auto-Start Quests',
          link: '/tools/auto-start-quests',
          ariaLabel: 'Navigate to Auto-Start Quests tool page',
        },
        {
          text: 'Party Pulse',
          link: '/tools/party-pulse',
          ariaLabel: 'Navigate to Party Pulse tool page',
        },
      ],
    },
    {
      text: 'Feedback',
      link: '/feedback',
    },
    {
      text: 'Admin Links',
      requiredPermission: 'admin_nav_menu',
      children: [
        {
          text: 'Logs',
          requiredPermission: 'access_analytic_logs',
          children: [
            {
              text: 'Analytic Logs',
              link: '/logs/analytics',
              ariaLabel: 'Navigate to Analytic Logs page',
              requiredPermission: 'access_analytic_logs',
            },
            {
              text: 'Error Logs',
              link: '/logs/errors',
              ariaLabel: 'Navigate to Error Logs page',
              requiredPermission: 'access_error_logs',
            },
            {
              text: 'Feedback Logs',
              link: '/logs/feedbacks',
              ariaLabel: 'Navigate to Feedback Logs page',
              requiredPermission: 'access_feedback',
            },
          ],
        },
        {
          text: 'Article Update',
          link: '/article-update',
          requiredPermission: 'article_control',
        },
      ],
    },
  ],
  context: [],
};
