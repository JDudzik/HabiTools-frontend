import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';
import { sanitizeProperties } from 'lib/utils/validations';


const ACTION_MAP = {
  assign_group_to_user: {
    path: '/v1/auth/users/admin/assign_group_to_user',
    requiredKeys: [ 'id', 'group_name' ],
  },
  unassign_group_from_user: {
    path: '/v1/auth/users/admin/unassign_group_from_user',
    requiredKeys: [ 'id', 'group_name' ],
  },
  assign_permission_to_user: {
    path: '/v1/auth/users/admin/assign_permission_to_user',
    requiredKeys: [ 'id', 'permission_name' ],
  },
  unassign_permission_from_user: {
    path: '/v1/auth/users/admin/unassign_permission_from_user',
    requiredKeys: [ 'id', 'permission_name' ],
  },
  assign_permission_to_group: {
    path: '/v1/auth/users/admin/assign_permission_to_group',
    requiredKeys: [ 'group_name', 'permission_name' ],
  },
  unassign_permission_from_group: {
    path: '/v1/auth/users/admin/unassign_permission_from_group',
    requiredKeys: [ 'group_name', 'permission_name' ],
  },
};

export const useMutateAssignPermissionControls = (mutateOptions) => {
  const queryClient = useQueryClient();
  const axios = useAxios();

  const mutationFn = (payload) => {
    const actionPayload = sanitizeProperties(payload, {
      requiredKeys: [ 'action_type' ],
      trimPayload: true,
      removeDisallowedKeys: true,
    });

    const actionConfig = ACTION_MAP[actionPayload.properties.action_type];
    if (!actionConfig) {
      throw {
        errorPayload: {
          source: 'useMutateAssignPermissionControls',
          message: `Unsupported assign/unassign action type: ${ actionPayload.properties.action_type }`,
          message_json: payload,
        },
      };
    }

    const sanitizedPayload = sanitizeProperties(payload, {
      requiredKeys: actionConfig.requiredKeys,
      trimPayload: true,
      removeDisallowedKeys: true,
    });

    return axios
      .put(actionConfig.path, sanitizedPayload.properties)
      .then(res => res.data)
      .catch((err) => {
        throw { ...err, errorPayload: {
          source: 'useMutateAssignPermissionControls',
          message: 'Failed to assign or unassign admin permission control',
          message_json: err,
        }};
      });
  };

  const onSuccess = () => {
    queryClient.invalidateQueries([ 'useApiGetGroups' ]);
    queryClient.invalidateQueries([ 'useApiGetPermissions' ]);
    queryClient.invalidateQueries([ 'useApiSearchUsers' ]);
  };

  return useMutation({ mutationFn, onSuccess, ...mutateOptions });
};
