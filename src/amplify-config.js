const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;
const userPoolClientId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID;
const identityPoolId = process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID;

export const authIsConfigured = Boolean(userPoolId && userPoolClientId);

const amplifyConfig = authIsConfigured
  ? {
      Auth: {
        Cognito: {
          userPoolId,
          userPoolClientId,
          ...(identityPoolId ? { identityPoolId } : {}),
          loginWith: {
            email: true,
          },
        },
      },
    }
  : null;

export default amplifyConfig;
