// Script para resetar o modal de trial
// Cole este código no console do navegador (F12) e execute

console.log('🔄 Resetando modal de trial...');

// Remover flag de modal dispensado
localStorage.removeItem('trial_modal_dismissed');

console.log('✅ Modal resetado! Recarregue a página para ver o modal.');
console.log('');
console.log('📊 Estado atual do localStorage:');
console.log('- trial_modal_dismissed:', localStorage.getItem('trial_modal_dismissed'));
console.log('');
console.log('🔍 Para debug, verifique os logs que começam com 🔍, ❌, ✅ ou 🎉');
