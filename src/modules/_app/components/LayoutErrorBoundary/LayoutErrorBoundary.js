import { PureComponent } from 'react';
import { Button } from '@mui/material';
import posthog from 'posthog-js';
import { Link } from 'components';


export class LayoutErrorBoundary extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }
  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }
  componentDidCatch(error) {
    const messageJson = error.stack || error.toString();
    posthog.captureException(error);
    this.props.mutateSubmitError({ source: 'LayoutErrorBoundary', message: error.message, message_json: messageJson }, { sendToPosthog: false });
  }
  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h2>Oops! It looks like something went wrong.</h2>
          <p>We're looking into it.</p>
          <p>
            If this problem continues, try closing all tabs and re-opening your browser.<br />
            Otherwise, please contact support through the <Link href="/feedback?source=ErrorPage.other_error">Feedback Page</Link>
          </p><br />
          <Button
            variant="contained"
            color="primary"
            onClick={ () => this.setState({ hasError: false }) }
          >Try Again?</Button>
        </div>
      );
    }

    // Return children components in case of no error
    return this.props.children;
  }
}

export default LayoutErrorBoundary;
