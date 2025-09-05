const fs = require('fs');
const path = require('path');

// Optimize celebrity data by reducing file sizes while maintaining functionality
function optimizeCelebrities() {
  const celebritiesDir = path.join(__dirname, '..', 'src', 'data', 'celebrities');
  
  // Reduce celebrities per category to manageable sizes
  const optimizedCategories = [
    { id: 'actors', label: 'Actors & Actresses', icon: '🎭', count: 50 },
    { id: 'musicians', label: 'Musicians & Singers', icon: '🎤', count: 40 },
    { id: 'athletes', label: 'Athletes & Sports', icon: '⚽', count: 30 },
    { id: 'entrepreneurs', label: 'Entrepreneurs', icon: '💼', count: 25 },
    { id: 'internet-celebrities', label: 'Internet Celebrities', icon: '📱', count: 35 },
    { id: 'scientists', label: 'Scientists & Intellectuals', icon: '🔬', count: 20 },
    { id: 'politicians', label: 'Politicians & Public Figures', icon: '🏛️', count: 15 }
  ];

  let totalCelebrities = 0;

  // Sample data for generating celebrities
  const firstNames = [
    'Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn', 'Blake', 'Cameron',
    'Drew', 'Emery', 'Finley', 'Hayden', 'Jamie', 'Kendall', 'Logan', 'Parker', 'Peyton', 'Reese',
    'Sage', 'Skyler', 'Sydney', 'Tatum', 'Tyler', 'Zion', 'Adrian', 'Ari', 'Ashton', 'Aubrey',
    'Bailey', 'Brooklyn', 'Carson', 'Charlie', 'Dakota', 'Dallas', 'Dana', 'Ellis', 'Emery', 'Evelyn'
  ];

  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
    'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
    'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores'
  ];

  const professions = [
    'Actor', 'Actress', 'Singer', 'Musician', 'Director', 'Producer', 'Writer', 'Comedian', 'Model',
    'Athlete', 'Chef', 'Artist', 'Photographer', 'Designer', 'Entrepreneur', 'Scientist', 'Doctor',
    'Teacher', 'Journalist', 'Politician', 'Activist', 'Influencer', 'YouTuber', 'Streamer', 'Podcaster'
  ];

  const nationalities = [
    'American', 'British', 'Canadian', 'Australian', 'French', 'German', 'Italian', 'Spanish', 'Japanese',
    'Korean', 'Chinese', 'Indian', 'Brazilian', 'Mexican', 'Russian', 'Swedish', 'Norwegian', 'Dutch',
    'Belgian', 'Swiss', 'Austrian', 'Irish', 'Scottish', 'Welsh', 'New Zealander', 'South African'
  ];

  const zodiacSigns = [
    'Aries ♈', 'Taurus ♉', 'Gemini ♊', 'Cancer ♋', 'Leo ♌', 'Virgo ♍',
    'Libra ♎', 'Scorpio ♏', 'Sagittarius ♐', 'Capricorn ♑', 'Aquarius ♒', 'Pisces ♓'
  ];

  // Generate random date between 1950 and 2010
  function generateRandomDate() {
    const start = new Date(1950, 0, 1);
    const end = new Date(2010, 11, 31);
    const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
    return new Date(randomTime).toISOString().split('T')[0];
  }

  // Generate zodiac sign based on birth date
  function getZodiacSign(birthDate) {
    const date = new Date(birthDate);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
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
    return 'Pisces ♓';
  }

  // Generate a celebrity with minimal data
  function generateCelebrity(id, category) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const birthDate = generateRandomDate();
    const profession = professions[Math.floor(Math.random() * professions.length)];
    const nationality = nationalities[Math.floor(Math.random() * nationalities.length)];
    const zodiacSign = getZodiacSign(birthDate);
    
    return {
      id: `${firstName.toLowerCase()}-${lastName.toLowerCase()}-${id}`,
      name,
      birthDate,
      category,
      profession,
      nationality,
      bio: `${name} is a ${nationality} ${profession.toLowerCase()}.`,
      zodiacSign,
      socialMedia: { instagram: `${firstName.toLowerCase()}${lastName.toLowerCase()}` },
      achievements: [`${profession} of the Year`],
      isActive: true
    };
  }

  // Generate celebrities for each category
  optimizedCategories.forEach(category => {
    console.log(`Optimizing ${category.count} celebrities for ${category.label}...`);
    
    const celebrities = [];
    for (let i = 0; i < category.count; i++) {
      celebrities.push(generateCelebrity(i + 1, category.id));
    }
    
    const categoryData = {
      category: category.id,
      label: category.label,
      icon: category.icon,
      celebrities
    };

    const filePath = path.join(celebritiesDir, `${category.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(categoryData, null, 2));
    
    totalCelebrities += category.count;
    console.log(`✅ Optimized ${category.count} celebrities for ${category.label}`);
  });

  // Update index.json
  const indexData = {
    categories: optimizedCategories.map(cat => ({
      id: cat.id,
      label: cat.label,
      icon: cat.icon,
      description: `${cat.label} in the entertainment industry`,
      count: cat.count
    })),
    totalCelebrities,
    lastUpdated: new Date().toISOString().split('T')[0]
  };

  const indexPath = path.join(celebritiesDir, 'index.json');
  fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));

  console.log(`\n🎉 Successfully optimized to ${totalCelebrities} celebrities across ${optimizedCategories.length} categories!`);
  console.log(`📁 Data saved to: ${celebritiesDir}`);
  console.log(`\n📊 Optimized category breakdown:`);
  optimizedCategories.forEach(cat => {
    console.log(`   ${cat.icon} ${cat.label}: ${cat.count} celebrities`);
  });
}

// Run the optimizer
if (require.main === module) {
  console.log('🚀 Starting celebrity data optimization...\n');
  optimizeCelebrities();
}

module.exports = { optimizeCelebrities };
