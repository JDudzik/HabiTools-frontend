import { useAxios } from 'lib/hooks/useAxios';


export const useAxiosCreateCheckoutSession = () => {
  const axios = useAxios();
  
  const createCheckoutSession = async (payload) => {
    const result = await axios
      .post('/v1/auth/commerce/create-checkout-session', {
        return_url: `${ window.location.origin }/checkout/return`,
        ...payload,
      })
      .then(res => res.data)
      .catch((err) => {
        throw { ...err, errorPayload: {
          source: 'useAxiosCreateCheckoutSession',
          message: 'Failed to create checkout session',
          message_json: err,
        }};
      });
    return result?.clientSecret;
  };

  return { createCheckoutSession };
};
