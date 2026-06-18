import { Stack, IconButton, Paper } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { L } from 'components';


const TIER_DISPLAY = {
  calibrating: {
    label: 'Calibrating',
    backgroundColor: 'misc.ignoredBackground',
    textColor: 'text.black',
  },
  '3': {
    label: 'Paragon',
    backgroundColor: 'habitica.blue50',
    textColor: 'text.black',
  },
  '2': {
    label: 'Active',
    backgroundColor: 'habitica.teal100',
    textColor: 'text.black',
  },
  '1': {
    label: 'Passive',
    backgroundColor: 'habitica.green100',
    textColor: 'text.black',
  },
  '0': {
    label: 'Coasting',
    backgroundColor: 'habitica.yellow100',
    textColor: 'text.black',
  },
  '-1': {
    label: 'Slowing',
    backgroundColor: 'habitica.orange100',
    textColor: 'text.black',
  },
  '-2': {
    label: 'Disengaged',
    backgroundColor: 'habitica.red100',
    textColor: 'text.black',
  },
  '-3': {
    label: 'Dormant',
    backgroundColor: 'habitica.maroon100',
    textColor: 'text.white',
  },
};

export const PartyPulseMemberCard = (props) => {
  const { member } = props;

  const scoreTier = member?.scoreTier ?? 0;
  const tier = TIER_DISPLAY[scoreTier];
  const totalChecks = member?.totalChecks ?? 0;
  const displayName = member?.displayName || member?.username || '(unknown)';
  const currentScore = member?.currentScore ?? 0;
  const userUrl = member?.userUrl;
  const sleepScore = member?.sleepScore ?? 0;

  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'row',
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor: tier.backgroundColor,
        color: tier.textColor,
      }}
    >
      <Stack
        justifyContent="center"
        alignItems="center"
        sx={{
          minWidth: 52,
          backgroundColor: 'rgba(0, 0, 0, 0.20)',
        }}
      >
        <IconButton
          component="a"
          href={ userUrl || `https://habitica.com/profile/${ member.id }` }
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open profile in new tab"
          title="Open profile in new tab"
          sx={{
            color: '#ffffff',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.10)',
            },
          }}
        >
          <OpenInNewIcon />
        </IconButton>
      </Stack>

      <Stack
        spacing={ 0.5 }
        sx={{
          paddingX: { xxs: 2, md: 2.5 },
          paddingY: { xxs: 1.5, md: 2 },
          flexGrow: 1,
        }}
      >
        <Stack direction={{ xxs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="start" gap={ 2 }>
          <L.h4 sx={{ mb: { xxs: 0, sm: 1 }, wordBreak: 'break-all' }}>
            { displayName }
          </L.h4>
          <L.p sx={{ m: 0, whiteSpace: 'nowrap', color: 'inherit' }}>
            Tier: <b>{ tier.label }</b>
          </L.p>
        </Stack>

        <Stack direction={{ sm: 'column', md: 'row' }} spacing={{ sm: 0.5, md: 2 }} justifyContent="flex-start" alignItems="start">
          <Stack direction="row" spacing={{ sm: 0.5, md: 2 }} justifyContent="flex-start" alignItems="start">
            <Paper sx={{ backgroundColor: 'rgba(0, 0, 0, 0.05)', px: 1, color: 'inherit' }}>
              Score: { currentScore }
            </Paper>
            <Paper sx={{ backgroundColor: 'rgba(0, 0, 0, 0.05)', px: 1, color: 'inherit' }}>
              Total checks: { totalChecks }
            </Paper>
          </Stack>
          <Paper sx={{ backgroundColor: 'rgba(0, 0, 0, 0.05)', px: 1, color: 'inherit' }}>
            Days asleep (2 weeks): { sleepScore }
          </Paper>
        </Stack>
      </Stack>
    </Paper>
  );
};