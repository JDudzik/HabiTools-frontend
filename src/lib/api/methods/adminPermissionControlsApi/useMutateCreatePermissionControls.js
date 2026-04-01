import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';
import { sanitizeProperties } from 'lib/utils/validations';


const ACTION_MAP = {
  create_group: {
    path: '/v1/auth/users/admin/create_group',
    requiredKeys: [ 'group_name' ],
    optionalKeys: [ 'description', 'is_deletable', 'permission_required_for_assignment' ],
  },
  create_permission: {
    path: '/v1/auth/users/admin/create_permission',
    requiredKeys: [ 'permission_name' ],
    optionalKeys: [ 'description', 'is_deletable', 'permission_required_for_assignment' ],
  },
};

export const useMutateCreatePermissionControls = (mutateOptions) => {
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
          source: 'useMutateCreatePermissionControls',
          message: `Unsupported create action type: ${ actionPayload.properties.action_type }`,
          message_json: payload,
        },
      };
    }

    const sanitizedPayload = sanitizeProperties(payload, {
      requiredKeys: actionConfig.requiredKeys,
      optionalKeys: actionConfig.optionalKeys,
      trimPayload: true,
      removeDisallowedKeys: true,
    });

    return axios
      .post(actionConfig.path, sanitizedPayload.properties)
      .then(res => res.data)
      .catch((err) => {
        throw { ...err, errorPayload: {
          source: 'useMutateCreatePermissionControls',
          message: 'Failed to create admin permission control resource',
          message_json: err,
        }};
      });
  };

  const onSuccess = () => {
    queryClient.invalidateQueries([ 'useApiGetGroups' ]);
    queryClient.invalidateQueries([ 'useApiGetPermissions' ]);
  };

  return useMutation({ mutationFn, onSuccess, ...mutateOptions });
};
