import { useMemo } from 'react';
import axios from 'axios';
import { getCredentialHeaders } from './helpers/getCredentialHeaders';


export const useAxios = () => {
  const credentialHeaders = getCredentialHeaders();

  return useMemo(() => axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_HOST,
    headers: {
      ...credentialHeaders,
    },
  }), [ credentialHeaders ]);
};

