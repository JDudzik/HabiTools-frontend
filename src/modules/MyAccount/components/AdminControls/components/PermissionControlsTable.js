import React, { useMemo, useState } from 'react';
import {
  Stack,
  Alert,
  TextField,
  Autocomplete,
  Box,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import LabelImportantOutlineIcon from '@mui/icons-material/LabelImportantOutline';
import { L, VirtualizedTableSimple, PopoutMenuButton, SimpleDisplay } from 'components';
import {
  useApiGetGroups,
  useApiGetPermissions,
  useMutateAssignPermissionControls,
  useMutateCreatePermissionControls,
  useMutateDeletePermissionControls,
} from 'lib/api/methods/adminPermissionControlsApi';
import { UserEmailSearchField } from './UserEmailSearchField';
import { TitleControls } from './TitleControls';
import { SubtitleControls } from './SubtitleControls';
import { useConfirmationFormModal } from '../hooks/useConfirmationFormModal';


const GROUPS_TAB = 'groups';
const PERMISSIONS_TAB = 'permissions';

const FULL_ACCESS_PERMISSIONS = [
  'super_admin_permission_control',
  'admin_permission_composition',
];

const FULL_ASSIGNMENT_PERMISSIONS = [
  ...FULL_ACCESS_PERMISSIONS,
  'admin_permission_assignment',
];

const VIEW_ACCESS_PERMISSIONS = [
  ...FULL_ASSIGNMENT_PERMISSIONS,
  'access_permissions_view',
];

const ASSIGNMENT_CONFIG = {
  assign_group_to_user: {
    title: 'Assign Group to User',
    primaryButtonText: 'Assign Group',
    requiresUser: true,
    requiresGroup: true,
  },
  unassign_group_from_user: {
    title: 'Unassign Group from User',
    primaryButtonText: 'Unassign Group',
    requiresUser: true,
    requiresGroup: true,
  },
  assign_permission_to_user: {
    title: 'Assign Permission to User',
    primaryButtonText: 'Assign Permission',
    requiresUser: true,
    requiresPermission: true,
  },
  unassign_permission_from_user: {
    title: 'Unassign Permission from User',
    primaryButtonText: 'Unassign Permission',
    requiresUser: true,
    requiresPermission: true,
  },
  assign_permission_to_group: {
    title: 'Assign Permission to Group',
    primaryButtonText: 'Assign Permission',
    requiresGroup: true,
    requiresPermission: true,
  },
  unassign_permission_from_group: {
    title: 'Unassign Permission from Group',
    primaryButtonText: 'Unassign Permission',
    requiresGroup: true,
    requiresPermission: true,
  },
};

const handledErrors = [
  'NO_GROUP_NAME', 'GROUP_ALREADY_ASSIGNED_TO_USER', 'NO_PERMISSION_NAME',
  'PERMISSION_ALREADY_ASSIGNED_TO_GROUP', 'PERMISSION_ALREADY_ASSIGNED_TO_USER', 'GROUP_NOT_ASSIGNED_TO_USER',
  'PERMISSION_NOT_ASSIGNED_TO_GROUP', 'PERMISSION_NOT_ASSIGNED_TO_USER',
  'GROUP_ALREADY_EXISTS', 'PERMISSION_ALREADY_EXISTS', 'GROUP_NOT_DELETABLE', 'PERMISSION_NOT_DELETABLE',
];


export const PermissionControlsTable = (props) => {
  const { handleApiError, openConfirmation, updateConfirmation, userState } = props;
  const permissionsCheck = userState?.permissionsCheck;

  const [ activeTab, setActiveTab ] = useState(GROUPS_TAB);

  const hasViewAccess = permissionsCheck?.oneOf?.(VIEW_ACCESS_PERMISSIONS);
  const hasFullAccess = permissionsCheck?.oneOf?.(FULL_ACCESS_PERMISSIONS);
  const hasFullAssignmentAccess = permissionsCheck?.oneOf?.(FULL_ASSIGNMENT_PERMISSIONS);

  const canManageByRequirement = (permissionRequiredForAssignment) => {
    if (hasFullAssignmentAccess || !permissionRequiredForAssignment) { return true; }
    return permissionsCheck?.has?.(permissionRequiredForAssignment) || false;
  };

  const { data: groupData, isLoading: groupsLoading, isError: groupsError } = useApiGetGroups();
  const { data: permissionData, isLoading: permissionsLoading, isError: permissionsError } = useApiGetPermissions();

  const groups = useMemo(() => (Array.isArray(groupData) ? groupData : []), [ groupData ]);
  const permissions = useMemo(() => (Array.isArray(permissionData) ? permissionData : []), [ permissionData ]);

  const groupNames = useMemo(() => groups.map(group => group?.name).filter(Boolean), [ groups ]);
  const permissionNames = useMemo(() => permissions.map(permission => permission?.name).filter(Boolean), [ permissions ]);

  const { mutate: mutateCreatePermissionControl, isLoading: isCreating } = useMutateCreatePermissionControls();
  const { mutate: mutateDeletePermissionControl, isLoading: isDeleting } = useMutateDeletePermissionControls();
  const { mutate: mutateAssignPermissionControl, isLoading: isAssigning } = useMutateAssignPermissionControls();

  const isMutating = isCreating || isDeleting || isAssigning;
  const { openFormModal } = useConfirmationFormModal({ openConfirmation, updateConfirmation });

  const openSuccessModal = (title, message) => {
    openConfirmation({
      title,
      content: <L.p>{ message }</L.p>,
      primaryButtonText: 'Okay',
      removeSecondaryAction: true,
    });
  };

  const openCreateControlModal = () => {
    if (!hasFullAccess) {
      openSuccessModal('Insufficient Permissions', 'You do not have permission to create groups or permissions.');
      return;
    }

    openFormModal({
      title: activeTab === GROUPS_TAB ? 'Create Group' : 'Create Permission',
      secondaryButtonText: 'Cancel',
      initialState: {
        resource_name: '',
        description: '',
        is_deletable: true,
        permission_required_for_assignment: '',
      },
      getPrimaryButtonText: () => (activeTab === GROUPS_TAB ? 'Create Group' : 'Create Permission'),
      onSubmit: (currentState) => {
        const actionType = activeTab === GROUPS_TAB ? 'create_group' : 'create_permission';
        const normalizedName = currentState?.resource_name?.trim();

        if (!normalizedName) {
          openSuccessModal('Missing Information', 'Please provide all required fields before submitting.');
          return;
        }

        const payload = {
          action_type: actionType,
          ...(actionType === 'create_group' && { group_name: normalizedName }),
          ...(actionType === 'create_permission' && { permission_name: normalizedName }),
          is_deletable: Boolean(currentState?.is_deletable),
          ...(currentState?.description?.trim() && { description: currentState.description.trim() }),
          ...(currentState?.permission_required_for_assignment?.trim() && {
            permission_required_for_assignment: currentState.permission_required_for_assignment.trim(),
          }),
        };

        mutateCreatePermissionControl(payload, {
          onSuccess: () => {
            openSuccessModal(
              actionType === 'create_group' ? 'Group Created' : 'Permission Created',
              actionType === 'create_group'
                ? `Group "${ normalizedName }" was created successfully.`
                : `Permission "${ normalizedName }" was created successfully.`,
            );
          },
          onError: (error) => {
            handleApiError({ error, handledErrors });
          },
        });
      },
      renderContent: (modalState, handleChange) => (
        <Stack spacing={ 2 } mt={ 1 }>
          <TextField
            size="small"
            label={ activeTab === GROUPS_TAB ? 'Group Name' : 'Permission Name' }
            value={ modalState?.resource_name || '' }
            onChange={ event => handleChange({ resource_name: event.target.value }) }
          />

          <TextField
            multiline
            size="small"
            minRows={ 2 }
            label="Description (Optional)"
            value={ modalState?.description || '' }
            onChange={ event => handleChange({ description: event.target.value }) }
          />

          <Autocomplete
            freeSolo
            size="small"
            value={ modalState?.permission_required_for_assignment || '' }
            options={ permissionNames }
            renderInput={ params => (
              <TextField
                { ...params }
                label="Permission Required for Assignment (Optional)"
                placeholder="Select or enter permission"
              />
            ) }
            onChange={ (_event, nextValue) => handleChange({ permission_required_for_assignment: nextValue || '' }) }
            onInputChange={ (_event, nextValue) => handleChange({ permission_required_for_assignment: nextValue || '' }) }
          />

          <FormControlLabel
            label="Allow resource deletion"
            control={ (
              <Checkbox
                checked={ Boolean(modalState?.is_deletable) }
                onChange={ event => handleChange({ is_deletable: event.target.checked }) }
              />
            ) }
          />
        </Stack>
      ),
    });
  };

  const openDeleteControlModal = ({ resource }) => {
    if (!hasFullAccess) {
      openSuccessModal('Insufficient Permissions', 'You do not have permission to delete groups or permissions.');
      return;
    }

    if (resource?.is_deletable === false) {
      openSuccessModal('Not Deletable', 'This resource cannot be deleted.');
      return;
    }

    const isGroup = activeTab === GROUPS_TAB;
    const actionType = isGroup ? 'delete_group' : 'delete_permission';
    const resourceName = isGroup ? resource?.name : resource?.name;

    openFormModal({
      color: 'error',
      title: isGroup ? 'Delete Group' : 'Delete Permission',
      secondaryButtonText: 'Cancel',
      initialState: {
        group_name: isGroup ? resourceName || '' : '',
        permission_name: !isGroup ? resourceName || '' : '',
      },
      getPrimaryButtonText: () => (isGroup ? 'Delete Group' : 'Delete Permission'),
      onSubmit: (currentState) => {
        const selectedName = isGroup ? currentState?.group_name : currentState?.permission_name;

        if (!selectedName) {
          openSuccessModal('Missing Information', 'Please choose a valid resource before deleting.');
          return;
        }

        const payload = {
          action_type: actionType,
          ...(isGroup && { group_name: selectedName }),
          ...(!isGroup && { permission_name: selectedName }),
        };

        mutateDeletePermissionControl(payload, {
          onSuccess: () => {
            openSuccessModal(
              isGroup ? 'Group Deleted' : 'Permission Deleted',
              isGroup
                ? `Group "${ selectedName }" was deleted successfully.`
                : `Permission "${ selectedName }" was deleted successfully.`,
            );
          },
          onError: (error) => {
            handleApiError({ error, handledErrors });
          },
        });
      },
      renderContent: (modalState, handleChange) => (
        <Stack spacing={ 2 } mt={ 1 }>
          { isGroup && (
            <Autocomplete
              size="small"
              value={ modalState?.group_name || null }
              options={ groupNames }
              renderInput={ params => (
                <TextField
                  { ...params }
                  label="Group Name"
                  placeholder="Select group"
                />
              ) }
              onChange={ (_event, nextValue) => handleChange({ group_name: nextValue || '' }) }
            />
          ) }

          { !isGroup && (
            <Autocomplete
              size="small"
              value={ modalState?.permission_name || null }
              options={ permissionNames }
              renderInput={ params => (
                <TextField
                  { ...params }
                  label="Permission Name"
                  placeholder="Select permission"
                />
              ) }
              onChange={ (_event, nextValue) => handleChange({ permission_name: nextValue || '' }) }
            />
          ) }
        </Stack>
      ),
    });
  };

  const openAssignmentModal = ({
    actionType,
    defaultGroupName,
    defaultPermissionName,
    lockGroupName,
    lockPermissionName,
  }) => {
    if (!hasViewAccess) {
      openSuccessModal('Insufficient Permissions', 'You do not have permission to update assignments.');
      return;
    }

    const actionConfig = ASSIGNMENT_CONFIG[actionType];
    if (!actionConfig) { return; }

    openFormModal({
      title: actionConfig.title,
      secondaryButtonText: 'Cancel',
      initialState: {
        action_type: actionType,
        selected_user: null,
        group_name: defaultGroupName || '',
        permission_name: defaultPermissionName || '',
      },
      getPrimaryButtonText: () => actionConfig.primaryButtonText,
      onSubmit: (currentState) => {
        const submitActionType = currentState?.action_type;
        const selectedUser = currentState?.selected_user;
        const groupName = currentState?.group_name;
        const permissionName = currentState?.permission_name;

        if (!submitActionType) {
          openSuccessModal('Missing Information', 'Please choose an assignment action before submitting.');
          return;
        }

        if (actionConfig.requiresUser && !selectedUser?.id) {
          openSuccessModal('Missing User', 'Please search for and select a user before submitting.');
          return;
        }

        if (actionConfig.requiresGroup && !groupName) {
          openSuccessModal('Missing Group', 'Please select a group before submitting.');
          return;
        }

        if (actionConfig.requiresPermission && !permissionName) {
          openSuccessModal('Missing Permission', 'Please select a permission before submitting.');
          return;
        }

        const payload = {
          action_type: submitActionType,
          ...(selectedUser?.id && { id: selectedUser.id }),
          ...(groupName && { group_name: groupName }),
          ...(permissionName && { permission_name: permissionName }),
        };

        mutateAssignPermissionControl(payload, {
          onSuccess: () => {
            openSuccessModal('Assignment Updated', 'Permission controls were updated successfully.');
          },
          onError: (error) => {
            handleApiError({ error, handledErrors });
          },
        });
      },
      renderContent: (modalState, handleChange) => {
        return (
          <Stack spacing={ 2 } mt={ 1 }>
            { actionConfig.requiresUser && (
              <UserEmailSearchField
                selectedUser={ modalState?.selected_user }
                onSelectUser={ selectedUser => handleChange({ selected_user: selectedUser }) }
              />
            ) }

            { actionConfig.requiresGroup && (
              lockGroupName ? (
                <TextField
                  disabled
                  size="small"
                  label="Group Name"
                  value={ modalState?.group_name || '' }
                />
              ) : (
                <Autocomplete
                  size="small"
                  value={ modalState?.group_name || null }
                  options={ groupNames }
                  renderInput={ params => (
                    <TextField
                      { ...params }
                      label="Group Name"
                      placeholder="Select group"
                    />
                  ) }
                  onChange={ (_event, nextValue) => handleChange({ group_name: nextValue || '' }) }
                />
              )
            ) }

            { actionConfig.requiresPermission && (
              lockPermissionName ? (
                <TextField
                  disabled
                  size="small"
                  label="Permission Name"
                  value={ modalState?.permission_name || '' }
                />
              ) : (
                <Autocomplete
                  size="small"
                  value={ modalState?.permission_name || null }
                  options={ permissionNames }
                  renderInput={ params => (
                    <TextField
                      { ...params }
                      label="Permission Name"
                      placeholder="Select permission"
                    />
                  ) }
                  onChange={ (_event, nextValue) => handleChange({ permission_name: nextValue || '' }) }
                />
              )
            ) }
          </Stack>
        );
      },
    });
  };

  const openResourceDetailsModal = ({ resource }) => {
    const isGroup = activeTab === GROUPS_TAB;
    const relatedItems = isGroup ? resource?.permissions : resource?.groups;
    const relatedLabel = isGroup ? 'Permissions' : 'Groups';
    const relatedItemLabels = (relatedItems || []).map((item, index) => {
      if (typeof item === 'string') {
        return { key: item, label: item };
      }

      const label = item?.name || item?.permission_name || item?.group_name || `Item ${ index + 1 }`;
      const key = item?.id || `${ label }-${ index }`;
      return { key, label };
    });

    openConfirmation({
      // title: isGroup ? 'Group Details' : 'Permission Details',
      content: (
        <Stack spacing={ 1.5 } mt={ 1 } alignItems="stretch">
          <L.h2 color="primary" textAlign="left">{ resource?.name || '-' }</L.h2>
          <L.p color="text.light" textAlign="left">{ resource?.description || 'No description' }</L.p>

          <SimpleDisplay title={ relatedLabel } color="secondary.main">
            {relatedItemLabels.length ? (
              <L.div pl={ 2 }>
                {relatedItemLabels.map(item => (
                  <L.li key={ `${ resource?.name }-${ item.key }` }>{ item.label }</L.li>
                ))}
              </L.div>
            ) : (
              <L.p color="text.secondary">No { relatedLabel.toLowerCase() } assigned.</L.p>
            )}
          </SimpleDisplay>
        </Stack>
      ),
      primaryButtonText: 'Close',
      removeSecondaryAction: true,
    });
  };

  const openRowActionModal = ({ actionType, resource }) => {
    if (actionType === 'delete') {
      openDeleteControlModal({ resource });
      return;
    }

    if (actionType === 'assign_permission_to_group') {
      openAssignmentModal({
        actionType,
        defaultGroupName: activeTab === GROUPS_TAB ? resource?.name : '',
        defaultPermissionName: activeTab === PERMISSIONS_TAB ? resource?.name : '',
        lockGroupName: activeTab === GROUPS_TAB,
        lockPermissionName: activeTab === PERMISSIONS_TAB,
      });
      return;
    }

    if (actionType === 'unassign_permission_from_group') {
      openAssignmentModal({
        actionType,
        defaultGroupName: activeTab === GROUPS_TAB ? resource?.name : '',
        defaultPermissionName: activeTab === PERMISSIONS_TAB ? resource?.name : '',
        lockGroupName: activeTab === GROUPS_TAB,
        lockPermissionName: activeTab === PERMISSIONS_TAB,
      });
      return;
    }

    if (actionType === 'assign_group_to_user' || actionType === 'unassign_group_from_user') {
      openAssignmentModal({
        actionType,
        defaultGroupName: activeTab === GROUPS_TAB ? resource?.name : '',
        lockGroupName: activeTab === GROUPS_TAB,
      });
      return;
    }

    if (actionType === 'assign_permission_to_user' || actionType === 'unassign_permission_from_user') {
      openAssignmentModal({
        actionType,
        defaultPermissionName: activeTab === PERMISSIONS_TAB ? resource?.name : '',
        lockPermissionName: activeTab === PERMISSIONS_TAB,
      });
    }
  };

  const getRowMenuItems = (resource) => {
    const canManageResourceAssignments = canManageByRequirement(resource?.permission_required_for_assignment);

    if (activeTab === GROUPS_TAB) {
      const assignmentItems = hasViewAccess ? [{
        key: `${ resource?.name }-assign-perm-group`,
        text: 'Assign Permission to Group',
        iconEl: <AssignmentTurnedInIcon fontSize="small" />,
        onClick: () => openRowActionModal({ actionType: 'assign_permission_to_group', resource }),
      }, {
        key: `${ resource?.name }-unassign-perm-group`,
        text: 'Unassign Permission from Group',
        iconEl: <PlaylistRemoveIcon fontSize="small" />,
        onClick: () => openRowActionModal({ actionType: 'unassign_permission_from_group', resource }),
      }, {
        key: `${ resource?.name }-assign-group-user`,
        text: 'Assign Group to User',
        iconEl: <GroupAddIcon fontSize="small" />,
        onClick: () => openRowActionModal({ actionType: 'assign_group_to_user', resource }),
      }, {
        key: `${ resource?.name }-unassign-group-user`,
        text: 'Unassign Group from User',
        iconEl: <PersonRemoveIcon fontSize="small" />,
        onClick: () => openRowActionModal({ actionType: 'unassign_group_from_user', resource }),
      }] : [];

      const filteredAssignmentItems = canManageResourceAssignments ? assignmentItems : [];
      const canDeleteResource = hasFullAccess && resource?.is_deletable !== false;

      if (!filteredAssignmentItems.length && !canDeleteResource) {
        return [];
      }

      return [
        ...filteredAssignmentItems,
        ...(filteredAssignmentItems.length && canDeleteResource ? [{ isDivider: true }] : []),
        ...(canDeleteResource ? [{
          key: `${ resource?.name }-delete`,
          text: 'Delete Group',
          iconEl: <DeleteOutlineIcon fontSize="small" />,
          onClick: () => openRowActionModal({ actionType: 'delete', resource }),
        }] : []),
      ];
    }

    const assignmentItems = hasViewAccess && canManageResourceAssignments ? [{
      key: `${ resource?.name }-assign-perm-group`,
      text: 'Assign Permission to Group',
      iconEl: <AssignmentTurnedInIcon fontSize="small" />,
      onClick: () => openRowActionModal({ actionType: 'assign_permission_to_group', resource }),
    }, {
      key: `${ resource?.name }-unassign-perm-group`,
      text: 'Unassign Permission from Group',
      iconEl: <PlaylistRemoveIcon fontSize="small" />,
      onClick: () => openRowActionModal({ actionType: 'unassign_permission_from_group', resource }),
    }, {
      key: `${ resource?.name }-assign-perm-user`,
      text: 'Assign Permission to User',
      iconEl: <GroupAddIcon fontSize="small" />,
      onClick: () => openRowActionModal({ actionType: 'assign_permission_to_user', resource }),
    }, {
      key: `${ resource?.name }-unassign-perm-user`,
      text: 'Unassign Permission from User',
      iconEl: <PersonRemoveIcon fontSize="small" />,
      onClick: () => openRowActionModal({ actionType: 'unassign_permission_from_user', resource }),
    }] : [];

    const canDeleteResource = hasFullAccess && resource?.is_deletable !== false;

    if (!assignmentItems.length && !canDeleteResource) {
      return [];
    }

    return [
      ...assignmentItems,
      ...(assignmentItems.length && canDeleteResource ? [{ isDivider: true }] : []),
      ...(canDeleteResource ? [{
        key: `${ resource?.name }-delete`,
        text: 'Delete Permission',
        iconEl: <DeleteOutlineIcon fontSize="small" />,
        onClick: () => openRowActionModal({ actionType: 'delete', resource }),
      }] : []),
    ];
  };

  const headers = [{
    label: activeTab === GROUPS_TAB ? 'Group Name' : 'Permission Name',
    key: 'name',
    width: '14rem',
  }, {
    label: 'Description',
    key: 'description',
    width: '20rem',
  }, {
    label: activeTab === GROUPS_TAB ? 'Permissions' : 'Groups',
    key: 'count',
    width: '7rem',
    align: 'right',
  }, {
    label: 'Actions',
    key: 'actions',
    width: '6rem',
    align: 'right',
  }];

  const resources = activeTab === GROUPS_TAB ? groups : permissions;

  const rows = resources.map((resource) => {
    const rowMenuItems = getRowMenuItems(resource);

    return {
      onClick: () => openResourceDetailsModal({ resource }),
      columns: [{
        key: `${ resource?.name }-name`,
        element: (
          <Box color="primary.main">{ resource?.name || '-' }</Box>
        ),
      }, {
        key: `${ resource?.name }-description`,
        element: resource?.description || '-',
      }, {
        key: `${ resource?.name }-count`,
        element: activeTab === GROUPS_TAB ? (resource?.permissions?.length || 0) : (resource?.groups?.length || 0),
        align: 'right',
      }, {
        key: `${ resource?.name }-actions`,
        align: 'right',
        element: (
          <Box onClick={ event => event.stopPropagation() }>
            {rowMenuItems.length ? (
              <PopoutMenuButton
                buttonProps={{
                  startIcon: <MoreVertIcon />,
                  variant: 'outlined',
                  color: 'primary',
                  size: 'small',
                }}
                buttonChild={ null }
                menuItems={ rowMenuItems }
              />
            ) : '-'}
          </Box>
        ),
      }],
    };
  });

  return (
    <>
      {(groupsError || permissionsError) && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load some admin permission control data.
        </Alert>
      )}

      <Stack spacing={ 3 } width="100%">
        {!hasViewAccess && (
          <Alert severity="warning">
            You have view access to this section, but you do not currently have permission to manage any admin controls.
          </Alert>
        )}

        <VirtualizedTableSimple
          size="small"
          height={{ xxs: '50vh', sm: '60vh', md: '65vh' }}
          isLoading={ groupsLoading || permissionsLoading || isMutating }
          title={ (
            <TitleControls
              activeTab={ activeTab }
              disabled={ isMutating }
              showCreateButton={ hasFullAccess }
              onCreate={ openCreateControlModal }
            />
          ) }
          subtitle={ (
            <SubtitleControls
              activeTab={ activeTab }
              setActiveTab={ setActiveTab }
            />
          ) }
          noDataMessage={ activeTab === GROUPS_TAB ? 'No groups available' : 'No permissions available' }
          noDataIcon={ LabelImportantOutlineIcon }
          headers={ headers }
          rows={ rows }
        />
      </Stack>
    </>
  );
};