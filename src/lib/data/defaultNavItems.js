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
      text: 'Logs',
      requiredPermission: 'test',
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
      text: 'example test links',
      children: [
        {
          text: 'dynamic links',
          children: [
            {
              text: 'permission based links',
              children: [
                {
                  text: 'need "test"',
                  link: '/',
                  requiredPermission: 'test',
                },
              ],
            },
            {
              text: 'auth based links',
              children: [
                {
                  text: 'need auth',
                  link: '/',
                  requiredAuthState: true,
                },
                {
                  text: 'need unauth',
                  link: '/',
                  requiredAuthState: false,
                },
              ],
            },
            { text: 'location based links',
              children: [
                {
                  text: 'only toolbar',
                  link: '/',
                  location: 'navBar',
                },
                {
                  text: 'only sidebar',
                  link: '/',
                  location: 'sideDrawer',
                },
              ],
            },
          ],
        },
        {
          text: 'deeply nested',
          children: [
            {
              text: 'one',
              children: [
                {
                  text: 'two',
                  link: '/',
                  icon: 'Home',
                },
                {
                  text: 'three',
                  children: [
                    {
                      text: '3-1',
                      link: '/',
                    },
                    {
                      text: '3-2',
                      link: '/',
                    },
                    {
                      text: '3-3',
                      link: '/',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          text: 'Let\'s go home!',
          link: '/',
          icon: 'Home',
        },
      ],
    },
    {
      text: 'Home',
      link: '/home',
      icon: 'Home',
    },
    {
      text: 'Pricing',
      link: '/pricing',
    },
    {
      text: 'My Account',
      link: '/my-account',
      requiredAuthState: true,
    },
    {
      text: 'Feedback',
      link: '/feedback',
    },
    {
      text: 'Debug Links',
      children: [
        {
          text: 'Email Confirmations',
          children: [
            {
              text: 'Verify Email',
              link: '/email-confirmations?type=verify-email&token=1',
            },
            {
              text: 'Reset Password',
              link: '/email-confirmations?type=reset-password&token=1',
            },
            
          ],
        },
        {
          text: 'Logs',
          requiredPermission: 'access_error_logs',
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
          text: 'Forgot Password',
          link: '/forgot-password',
        },
        {
          text: 'Template',
          link: '/template',
        },
        {
          text: 'Article Update',
          link: '/article-update',
          requiredAuthState: true,
          requiredPermission: 'article_control',
        },
        {
          text: 'Resend Verify Email',
          link: '/resend-email-verification',
        },
        {
          text: 'Log Something',
          icon: 'Home',
          onClick: props => console.log('some props:', props), // eslint-disable-line no-console
        },
      ],
    },
  ],
  context: [
    {
      text: 'Landing',
      link: '/',
      icon: 'Home',
    },
  ],
};
