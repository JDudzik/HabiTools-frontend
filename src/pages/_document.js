import React from 'react';
import Document, {
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document';
import { appConfig } from 'lib/data';

const earlyAuthRedirectScript = `
(function () {
  try {
    if (window.location.pathname !== '/') return;

    var userContextString = window.localStorage.getItem('userContext');
    if (!userContextString) return;

    var userContext = JSON.parse(userContextString);
    var isAuthenticated = userContext && userContext.token && userContext.user && userContext.user.email;

    if (isAuthenticated) {
      window.location.replace('${ appConfig?.authorizedUserHome }');
    }
  } catch (error) {
    // Intentionally swallow errors to avoid impacting first paint.
  }
})();
`;


export default class MyDocument extends Document {
  render() {
    const isHomePage = this.props?.__NEXT_DATA__?.page === '/';

    return (
      <Html>
        <Head>
          {appConfig?.authorizedUserHome && isHomePage ? (
            <script
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: earlyAuthRedirectScript }}
            />
          ) : null}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
