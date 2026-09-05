import { useApiGetAdminToolIntegrityReport } from 'lib/api/methods/habiticaApi';
import {
  Stack,
  Box,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { L, SimpleDisplay } from 'components';


const TOOL_INTEGRITY_REPORT_PERMISSION = 'data_manipulation';

const handledErrors = [
  'INADEQUATE_PERMISSION',
];

const formatDateTime = (timestamp) => {
  if (!timestamp) { return '-'; }

  const parsed = Number(timestamp);
  if (Number.isNaN(parsed)) { return '-'; }

  return new Date(parsed).toLocaleString();
};

const JsonAccordion = ({ title, data }) => {
  return (
    <Accordion disableGutters>
      <AccordionSummary expandIcon={ <ExpandMoreIcon /> }>
        <L.p mb={ 0 }><strong>{ title }</strong></L.p>
      </AccordionSummary>
      <AccordionDetails>
        <Box
          component="pre"
          sx={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflowX: 'auto',
            fontSize: '0.8rem',
            m: 0,
          }}
        >
          { JSON.stringify(data ?? null, null, 2) }
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};


export const useHabiticaToolIntegrityReportMenuAction = ({
  userState,
  openConfirmation,
  handleApiError,
}) => {
  const { refetch: refetchToolIntegrityReport, isFetching } = useApiGetAdminToolIntegrityReport({ enabled: false });

  const hasPermission = userState?.permissionsCheck?.has?.(TOOL_INTEGRITY_REPORT_PERMISSION);
  if (!hasPermission) {
    return null;
  }

  const openReport = async () => {
    openConfirmation({
      title: 'Loading Tool Integrity Report',
      content: (
        <Stack spacing={ 2 } mt={ 1 } alignItems="center">
          <CircularProgress size={ 24 } />
          <L.p>Fetching data...</L.p>
        </Stack>
      ),
      primaryButtonText: 'Close',
      removeSecondaryAction: true,
    });

    const result = await refetchToolIntegrityReport();
    if (result?.isError) {
      handleApiError?.({ error: result.error, handledErrors });
      return;
    }

    const report = result?.data || {};
    const orphanedWebhooks = Array.isArray(report?.orphaned_webhooks) ? report.orphaned_webhooks : [];
    const expiredTools = Array.isArray(report?.expired_undeleted_tools) ? report.expired_undeleted_tools : [];

    openConfirmation({
      title: 'Habitica Tool Integrity Report',
      content: (
        <Stack spacing={ 1.5 } mt={ 1 } alignItems="stretch">
          <Alert severity={ orphanedWebhooks.length || expiredTools.length ? 'warning' : 'success' }>
            { orphanedWebhooks.length || expiredTools.length
              ? 'Issues found. Review orphaned webhooks and expired tools below.'
              : 'No integrity issues found.' }
          </Alert>

          <SimpleDisplay title="Checked At" sx={{ flexGrow: 1, m: 0.5 }} color="secondary.main">
            { formatDateTime(report?.checked_at) }
          </SimpleDisplay>

          <SimpleDisplay title="Orphaned Webhooks" sx={{ flexGrow: 1, m: 0.5 }} color="secondary.main">
            { report?.orphaned_webhooks_count ?? orphanedWebhooks.length }
          </SimpleDisplay>

          <SimpleDisplay title="Expired Undeleted Tools" sx={{ flexGrow: 1, m: 0.5 }} color="secondary.main">
            { report?.expired_undeleted_tools_count ?? expiredTools.length }
          </SimpleDisplay>

          <JsonAccordion title="Orphaned Webhooks (raw)" data={ orphanedWebhooks } />
          <JsonAccordion title="Expired Undeleted Tools (raw)" data={ expiredTools } />
        </Stack>
      ),
      primaryButtonText: 'Close',
      removeSecondaryAction: true,
    });
  };

  return {
    key: 'view-habitica-tool-integrity-report',
    text: isFetching ? 'Loading Tool Integrity Report...' : 'View Habitica Tool Integrity Report',
    onClick: () => openReport(),
    props: {
      dense: true,
      disabled: isFetching,
    },
  };
};