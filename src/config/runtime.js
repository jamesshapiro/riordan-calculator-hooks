export const ENDPOINT = process.env.NEXT_PUBLIC_MATRIX_URL || '';
export const AUTH_ENDPOINT = process.env.NEXT_PUBLIC_MATRIX_URL_AUTH || '';
export const API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || '';

const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || '';
const userPoolClientId =
  process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID || '';
const identityPoolId = process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID || '';

export const amplifyAuthConfig =
  userPoolId && userPoolClientId
    ? {
        Auth: {
          Cognito: {
            userPoolId,
            userPoolClientId,
            ...(identityPoolId ? { identityPoolId } : {}),
            loginWith: {
              email: true,
            },
            signUpVerificationMethod: 'code',
          },
        },
      }
    : null;
