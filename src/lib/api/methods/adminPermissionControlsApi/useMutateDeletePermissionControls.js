import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAxios } from 'lib/hooks/useAxios';
import { sanitizeProperties } from 'lib/utils/validations';


const ACTION_MAP = {
  delete_group: {
    path: '/v1/auth/users/admin/delete_group',
    requiredKeys: [ 'group_name' ],
  },
  delete_permission: {
    path: '/v1/auth/users/admin/delete_permission',
    requiredKeys: [ 'permission_name' ],
  },
};

export const useMutateDeletePermissionControls = (mutateOptions) => {
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
          source: 'useMutateDeletePermissionControls',
          message: `Unsupported delete action type: ${ actionPayload.properties.action_type }`,
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
      .delete(actionConfig.path, {
        data: sanitizedPayload.properties,
      })
      .then(res => res.data)
      .catch((err) => {
        throw { ...err, errorPayload: {
          source: 'useMutateDeletePermissionControls',
          message: 'Failed to delete admin permission control resource',
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
