export const config = {
  API_URL: process.env.NODE_ENV === 'development' 
    ? '/api'
    : '/api'
};