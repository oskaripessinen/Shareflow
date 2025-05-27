const apiUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

export const validateToken = async (googleToken: string) => {
    console.log('Validating token with Google token:', googleToken, apiUrl);
  const response = await fetch(`${apiUrl}/api/auth/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${googleToken}`, 
    },
    body: JSON.stringify({ token: googleToken }),
  });
  console.log('Validating token with response:', response);
  if (!response.ok) {
    console.log(response)
    throw new Error(`Validation failed: ${response.statusText}`);
    
  }

  return response.json();
};