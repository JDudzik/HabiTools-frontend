import { useEffect, useMemo } from 'react';
import { Stack } from '@mui/material';
import { L } from 'components';
import { useApiSearchUsers } from 'lib/api/methods/adminControlsApi';

const ACTIVE_HABITICA_TOOLS_PERMISSION = 'user_retrieval';

export const useActiveHabiticaToolsMenuAction = ({
  userState,
  openConfirmation,
  handleApiError,
}) => {
  const hasAccess = userState?.permissionsCheck?.has?.(ACTIVE_HABITICA_TOOLS_PERMISSION);

  const {
    data: usersData,
    isLoading,
    isError,
    error,
  } = useApiSearchUsers();

  useEffect(() => {
    if (isError && handleApiError) {
      handleApiError({ error, handledErrors: []});
    }
  }, [ isError, error, handleApiError ]);

  const toolCounts = useMemo(() => {
    if (!Array.isArray(usersData)) {
      return [];
    }

    const countMap = {};

    for (const user of usersData) {
      const habiticaTools = user?.habitica_user?.habitica_tools;
      if (!Array.isArray(habiticaTools)) {
        continue;
      }

      for (const tool of habiticaTools) {
        const toolSlug = tool?.tool_slug;
        if (!toolSlug) {
          continue;
        }

        countMap[toolSlug] = (countMap[toolSlug] || 0) + 1;
      }
    }

    return Object.entries(countMap)
      .sort(([ slugA, countA ], [ slugB, countB ]) => {
        if (countB !== countA) {
          return countB - countA;
        }

        return slugA.localeCompare(slugB);
      });
  }, [ usersData ]);

  const openToolCountsModal = () => {
    openConfirmation({
      title: 'Active Habitica Tools',
      content: (
        <Stack spacing={ 1 } mt={ 1 } alignItems="stretch">
          {isLoading ? (
            <L.p>Loading active tool counts...</L.p>
          ) : toolCounts.length ? (
            <Stack component="ul" sx={{ m: 0, pl: 3 }}>
              { toolCounts.map(([ slug, count ]) => (
                <li key={ slug }>
                  { slug }: { count }
                </li>
              )) }
            </Stack>
          ) : (
            <L.p>No active Habitica tools found.</L.p>
          )}
        </Stack>
      ),
      primaryButtonText: 'Close',
      removeSecondaryAction: true,
    });
  };

  if (!hasAccess) {
    return null;
  }

  return {
    key: 'view-active-habitica-tools',
    text: 'View Active Habitica Tools',
    onClick: () => openToolCountsModal(),
    props: { dense: true },
  };
};
