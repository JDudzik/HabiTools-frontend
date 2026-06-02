import { Stack, IconButton, Paper } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { L } from 'components';


export const PartyPulseMemberCard = (props) => {
  const {
    member,
    tier,
    displayName,
    totalChecks,
  } = props;

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
          href={ member.userUrl || `https://habitica.com/profile/${ member.id }` }
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
          <L.h4 sx={{ m: 0, wordBreak: 'break-all' }}>
            { displayName }
          </L.h4>
          <L.p sx={{ m: 0, whiteSpace: 'nowrap' }}>
            Tier: <b>{ tier.label }</b>
          </L.p>
        </Stack>

        <Stack direction="row" spacing={ 2 }>
          <L.p2 sx={{ m: 0 }}>
            Score: { member?.currentScore || 0 }
          </L.p2>
          <L.p2 sx={{ m: 0 }}>
            Total checks: { totalChecks }
          </L.p2>
        </Stack>
      </Stack>
    </Paper>
  );
};