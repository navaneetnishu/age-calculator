# 🎂 Modern Age Calculator

A stunning, modern age calculator built with Next.js, TypeScript, and Tailwind CSS. Calculate your exact age in years, months, days, hours, and minutes with a beautiful, animated interface. **Now featuring a comprehensive celebrity birthday database!**

![Age Calculator Preview](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=Modern+Age+Calculator)

## ✨ Features

### 🧮 **Age Calculator**
- **Accurate Age Calculation**: Calculate age in years, months, days, hours, and minutes
- **Modern Design**: Beautiful gradient backgrounds and smooth animations
- **Real-time Validation**: Instant feedback on form inputs
- **Responsive Layout**: Mobile-first design that works on all devices

### ⭐ **Celebrity Birthday Database**
- **Comprehensive Database**: 20+ celebrities across multiple categories
- **Category Filtering**: Browse by Actor, Singer, Sportsman, YouTuber, and more
- **Search Functionality**: Find celebrities by name, profession, or nationality
- **Birthday Highlights**: See who's celebrating today and upcoming birthdays
- **Age Comparisons**: Discover oldest and youngest celebrities
- **Profile Details**: View achievements, social media links, and biographical information

### 🎨 **Modern Design**
- **Gradient Backgrounds**: Beautiful blue-to-purple gradients throughout the interface
- **Glassmorphism Effects**: Modern card designs with subtle shadows and transparency
- **Responsive Layout**: Mobile-first design that looks great on all devices
- **Interactive Animations**: Smooth hover effects and transitions

### 🎭 **Interactive Features**
- **Loading States**: Custom animated loading spinners
- **Success Feedback**: Green checkmark animation when calculation completes
- **Hover Effects**: Smooth scale and shadow transitions on all interactive elements
- **Error Animations**: Shake animation for error messages
- **Fade-in Effects**: Smooth entrance animations for results

### 📊 **Comprehensive Results**
- **Main Age Display**: Large, prominent display of exact age
- **Detailed Breakdown**: Color-coded cards for years, months, days, and hours
- **Life Statistics**: Total days, hours, and minutes lived
- **Visual Hierarchy**: Clear information architecture with proper spacing

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Icons**: Heroicons (SVG)
- **Fonts**: Inter (Google Fonts)
- **Deployment**: Ready for Vercel, Netlify, or any static hosting

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd age-calculator
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 🎮 Usage

### Age Calculator
1. **Enter Birth Date**: Select your date of birth from the modern date picker
2. **Optional Target Date**: Choose a specific date to calculate age as of that date
3. **Calculate**: Click the animated "Calculate Age" button
4. **View Results**: See your exact age with beautiful animations and detailed breakdown

### Celebrity Section
1. **Browse Categories**: Use the category filter to explore different celebrity types
2. **Search**: Find specific celebrities by name, profession, or nationality
3. **View Profiles**: Click on celebrity cards to see detailed information
4. **Birthday Highlights**: Check who's celebrating today and upcoming birthdays
5. **Age Comparisons**: Discover the oldest and youngest celebrities in the database

## 📱 Design Features

### Color Scheme
- **Primary**: Blue (#3B82F6) to Purple (#8B5CF6) gradients
- **Secondary**: Green (#10B981) and Orange (#F59E0B) for variety
- **Background**: Subtle blue-to-purple gradient background
- **Cards**: Clean white cards with subtle shadows

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800
- **Hierarchy**: Clear size and weight progression

### Animations
- **Duration**: 200-300ms for most transitions
- **Easing**: Smooth ease-out curves
- **Triggers**: Hover, focus, and state changes

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles and animations
│   ├── layout.tsx       # Root layout with metadata
│   └── page.tsx         # Main page with navigation
├── components/
│   ├── AgeCalculator.tsx    # Main age calculator component
│   ├── CelebrityCard.tsx    # Celebrity profile card
│   ├── CelebritySection.tsx # Celebrity database section
│   └── Navigation.tsx       # Tab navigation
├── data/
│   └── celebrities.ts   # Celebrity database
├── types/
│   └── celebrity.ts      # TypeScript types
└── utils/
    ├── ageCalculator.ts     # Age calculation utilities
    └── celebrityUtils.ts     # Celebrity data utilities
```

## 🎨 Design System

### Components
- **AgeCalculator**: Main age calculation interface
- **CelebrityCard**: Individual celebrity profile display
- **CelebritySection**: Complete celebrity database interface
- **Navigation**: Tab-based navigation between sections
- **LoadingSpinner**: Custom dual-ring animated spinner
- **SuccessCheckmark**: Animated success feedback

### Animations
- **fade-in**: Smooth entrance animation
- **shake**: Error feedback animation
- **bounce**: Header icon animation
- **pulse**: Loading state animation
- **scale**: Hover effects

## 🌟 Performance

- **Bundle Size**: ~104 kB total
- **Loading**: Optimized with dynamic imports
- **Animations**: Hardware-accelerated CSS transforms
- **Images**: SVG icons for crisp scaling
- **Fonts**: Optimized Google Fonts loading

## 📈 SEO & Accessibility

- **Semantic HTML**: Proper heading hierarchy and landmarks
- **ARIA Labels**: Screen reader friendly
- **Keyboard Navigation**: Full keyboard support
- **Meta Tags**: Comprehensive SEO metadata
- **Open Graph**: Social media sharing optimization

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload the .next folder to Netlify
```

### Static Export
```bash
npm run build
npm run export
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

If you have any questions or issues, please open an issue on GitHub.

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
