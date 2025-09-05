const fs = require('fs');
const path = require('path');

// Zodiac sign calculation function
function getZodiacSign(month, day) {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries ♈';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus ♉';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini ♊';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer ♋';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo ♌';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo ♍';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra ♎';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio ♏';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius ♐';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn ♑';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius ♒';
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces ♓';
  return 'Unknown';
}

// Read the celebrities file
const celebritiesPath = path.join(__dirname, '../src/data/celebrities.ts');
let content = fs.readFileSync(celebritiesPath, 'utf8');

// Find all birthDate entries and add zodiac signs
let updatedCount = 0;
const birthDateRegex = /birthDate:\s*'([^']+)'/g;
let match;

while ((match = birthDateRegex.exec(content)) !== null) {
  const birthDate = match[1];
  const date = new Date(birthDate);
  const month = date.getMonth() + 1; // getMonth() returns 0-11
  const day = date.getDate();
  const zodiacSign = getZodiacSign(month, day);
  
  // Find the position to insert zodiacSign
  const celebrityStart = content.lastIndexOf('{', match.index);
  const celebrityEnd = content.indexOf('},', match.index);
  
  if (celebrityStart !== -1 && celebrityEnd !== -1) {
    const celebrityBlock = content.substring(celebrityStart, celebrityEnd);
    
    // Check if zodiacSign already exists
    if (!celebrityBlock.includes('zodiacSign:')) {
      // Find the last property before the closing brace
      const lastPropertyMatch = celebrityBlock.match(/(\s+)(\w+):\s*[^,}]+(?:,|$)/g);
      
      if (lastPropertyMatch && lastPropertyMatch.length > 0) {
        const lastProperty = lastPropertyMatch[lastPropertyMatch.length - 1];
        const insertPosition = celebrityStart + celebrityBlock.lastIndexOf(lastProperty) + lastProperty.length;
        
        // Insert zodiacSign after the last property
        const insertText = `,\n    zodiacSign: '${zodiacSign}'`;
        content = content.substring(0, insertPosition) + insertText + content.substring(insertPosition);
        updatedCount++;
      }
    }
  }
}

// Write the updated content back to the file
fs.writeFileSync(celebritiesPath, content, 'utf8');

console.log(`✅ Added zodiac signs to ${updatedCount} celebrities!`);
console.log('🎉 All celebrities now have zodiac signs based on their birth dates!');
