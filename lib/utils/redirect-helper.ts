/**
 * Determina para onde redirecionar o usuário após login baseado em seu tipo
 */
export function getRedirectPathAfterLogin(user: any): string {
  const establishments = user?.establishments || [];
  
  if (establishments.length > 0) {
    const firstEstablishment = establishments[0];
    const roles = firstEstablishment.roles || [];
    
    const isKitchenEmployee = roles.some((role: string) =>
      role === 'kitchen_cook' ||
      role === 'kitchen_manager' ||
      role === 'kitchen_chef' ||
      role === 'kitchen_assistant'
    );
    
    if (isKitchenEmployee) {
      return '/kitchen/display';
    }
  }
  
  return '/home';
}
