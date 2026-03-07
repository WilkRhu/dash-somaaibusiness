// Disponibiliza API_URL para o browser
if (typeof window !== 'undefined') {
  (window as any).__NEXT_PUBLIC_API_URL__ = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
}

export const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    return (window as any).__NEXT_PUBLIC_API_URL__ || 'http://localhost:3001';
  }
  return 'http://localhost:3001';
};