export const PageErrors = ({ pageError }) => (
  <>
    {pageError.status === 'FAILED_TO_FETCH' && (
      <div>
        <h2>Oops!</h2>
        <p>It looks like you might be offline.</p>
        <p>Make sure you are connected to the internet and try again.</p>
        <br />
      </div>
    )}


    {pageError.status === 'INADEQUATE_PERMISSION' && (
      <div>
        <h2>You Do Not Have Permission</h2>
        <p>You don't have the adaquate permissions to perform this action.</p>
        <p>If you are supposed to have permission, please contact an administrator.</p>
        <br />
      </div>
    )}
  </>
);
