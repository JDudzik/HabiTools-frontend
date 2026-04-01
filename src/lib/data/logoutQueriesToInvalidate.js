// These are the queries that should be invalidated when the users logs-out or logs-in.
export const logoutQueriesToInvalidate = [
  // Options are: 'invalidate', 'reset', and 'remove'.
  // "remove" should be the default choice unless there is an issue.
  [ 'useApiSearchUsers', 'remove' ],
  [ 'useApiListAnalyticLogs', 'remove' ],
  [ 'useApiSingleAnalyticLog', 'remove' ],
  [ 'useApiGetArticle', 'remove' ],
  [ 'useApiListArticles', 'remove' ],
  [ 'useApiVerifyEmailConfirmation', 'remove' ],
  [ 'useApiListErrorLogs', 'remove' ],
  [ 'useApiSingleErrorLog', 'remove' ],
  [ 'useApiListFeedbackLogs', 'remove' ],
  [ 'useApiSingleFeedbackLog', 'remove' ],
  [ 'useApiEmailAvailable', 'remove' ],
  [ 'useApiListEventMessages', 'remove' ],
  [ 'EXAMPLE', 'remove' ],
];