const apiUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

export const validateToken = async (googleToken: string) => {
  
  if (!googleToken) {
    throw new Error('Google token is undefined or null');
  }

  const requestBody = { token: googleToken };

  try {
    const response = await fetch(`${apiUrl}/api/auth/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${googleToken}`, 
      },
      body: JSON.stringify(requestBody),
    });

    
    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(`Validation failed: ${response.status} - ${responseText}`);
    }

    return JSON.parse(responseText);
  } catch (error) {
    console.error('Validation error:', error);
    throw error;
  }
};