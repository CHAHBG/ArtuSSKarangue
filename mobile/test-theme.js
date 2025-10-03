// Test file to verify theme exports
import * as theme from './src/theme';

console.log('=== THEME EXPORTS TEST ===');
console.log('colors:', typeof theme.colors);
console.log('typography:', typeof theme.typography);
console.log('spacing:', typeof theme.spacing);
console.log('borderRadius:', typeof theme.borderRadius);
console.log('shadows:', typeof theme.shadows);
console.log('getEmergencyColor:', typeof theme.getEmergencyColor);
console.log('emergencyLabels:', typeof theme.emergencyLabels);
console.log('wolofMessages:', typeof theme.wolofMessages);
console.log('default:', typeof theme.default);

console.log('\n=== SHADOWS CONTENT ===');
console.log(JSON.stringify(theme.shadows, null, 2));
