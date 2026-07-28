import { Stack, IconButton, Paper } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { L } from 'components';
import ScoreHistoryChart from '../ScoreHistoryChart';

const TIER_DISPLAY = {
  calibrating: {
    label: 'Calibrating',
    colors: {
      text: 'text.black',
      backgroundColor: 'misc.ignoredBackground',
      graph: {
        line: '#313ca7',
        references: 'black',
      },
    },
  },
  '3': {
    label: 'Paragon',
    colors: {
      text: 'text.black',
      backgroundColor: 'habitica.blue50',
      graph: {
        line: '#313ca7',
        references: 'black',
      },
    },
  },
  '2': {
    label: 'Active',
    colors: {
      text: 'text.black',
      backgroundColor: 'habitica.teal100',
      graph: {
        line: '#313ca7',
        references: 'black',
      },
    },
  },
  '1': {
    label: 'Passive',
    colors: {
      text: 'text.black',
      backgroundColor: 'habitica.green100',
      graph: {
        line: '#313ca7',
        references: 'black',
      },
    },
  },
  '0': {
    label: 'Coasting',
    colors: {
      text: 'text.black',
      backgroundColor: 'habitica.yellow100',
      graph: {
        line: '#313ca7',
        references: 'black',
      },
    },
  },
  '-1': {
    label: 'Slowing',
    colors: {
      text: 'text.black',
      backgroundColor: 'habitica.orange100',
      graph: {
        line: '#313ca7',
        references: 'black',
      },
    },
  },
  '-2': {
    label: 'Disengaged',
    colors: {
      text: 'text.black',
      backgroundColor: 'habitica.red100',
      graph: {
        line: '#5d69c8',
        references: 'black',
      },
    },
  },
  '-3': {
    label: 'Dormant',
    colors: {
      text: 'text.white',
      backgroundColor: 'habitica.maroon100',
      graph: {
        line: '#5d69c8',
        references: 'white',
      },
    },
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
  const scoreHistory = member?.scoreHistory || [];
  // const fakeScoreHistory = [ 0, 3, 6, 4, 2, 6, 8, 5, 7, 9, 10, 16, 21 ];
  // const scoreHistory = fakeScoreHistory;
  // console.log('member.scoreHistory:', member.scoreHistory);

  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'row',
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor: tier.colors.backgroundColor,
        color: tier.colors.text,
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

        <Stack direction={{ sm: 'column', md: 'row' }} spacing={{ sm: 1, md: 2 }} justifyContent="flex-start" alignItems="start">
          <Stack direction="row" spacing={{ sm: 1, md: 2 }} justifyContent="flex-start" alignItems="start">
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

        {scoreHistory?.length >= 3 ? (
          <ScoreHistoryChart data={ scoreHistory } colors={ tier.colors.graph } />
        ) : (
          <L.div sx={{ width: '100%', maxWidth: 455, height: 60, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 1 }}>
            <L.p sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', m: 0, color: 'inherit', fontSize: 12 }}>
              Score History is not ready for this user yet. Please wait for at least 3 checks.
            </L.p>
          </L.div>
        )}
      </Stack>
    </Paper>
  );
};
