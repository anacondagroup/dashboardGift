import { base64StringDecode } from '@alycecom/utils';

export const parseConfirmationToken = (
  idToken: string,
): { isValid: boolean; token: string; userEmail: string; userName: string } => {
  const [token, userInfoEncoded] = idToken.split('.');
  try {
    const { userEmail, userName } = JSON.parse(base64StringDecode(decodeURIComponent(userInfoEncoded)));
    return {
      isValid: true,
      token,
      userEmail,
      userName,
    };
  } catch {
    return {
      isValid: false,
      token: '',
      userEmail: '',
      userName: '',
    };
  }
};
