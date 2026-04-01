import { PureComponent } from 'react';
import posthog from 'posthog-js';


export class TopErrorReport extends PureComponent {
  componentDidCatch(error) {
    const messageJson = error.stack || error.toString();
    posthog.captureException(error);
    this.props.mutateSubmitError({ source: 'TopErrorReport', message: error.message, message_json: messageJson }, { sendToPosthog: false });

    throw error;
  }

  render() {
    return this.props.children;
  }
}
