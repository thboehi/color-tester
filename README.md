# Color Tools - OLED Energy Efficiency Analyzer

<div align="center">

**🇺🇸 English** | **[🇫🇷 Français](README_fr.md)**

</div>

![Color Tools](./public/og.png)

## 🎯 Overview

**Color Tools** is an innovative web toolkit designed to analyze and optimize energy efficiency of web interfaces on OLED displays. This project, developed as part of my bachelor thesis at SAE Institute, explores the significant impact that color choices can have on energy consumption of modern mobile devices.

### Why this project?

With the widespread adoption of OLED screens in smartphones, tablets, and laptops, the relationship between displayed colors and energy consumption becomes crucial. Unlike LCD screens, OLED black pixels consume virtually no energy, creating an opportunity for energy optimization through design.

### What does it do?

- **🔍 Website Analyzer**: Real-time analysis of dark/light color ratios on any website
- **⚡ Color Stresser**: Test different colors and patterns to measure their energy impact
- **🔬 Algorithm Documentation**: Complete documentation of color analysis algorithms
- **🏆 Badge Generator**: Generate dynamic badges to display energy efficiency scores

## 🛠️ Technologies & Libraries

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library with latest features
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[React Toastify](https://github.com/fkhadra/react-toastify)** - Elegant toast notifications

### Backend & Analysis
- **[Puppeteer](https://pptr.dev/)** - Browser automation for screenshots
- **[@sparticuz/chromium](https://github.com/Sparticuz/chromium)** - Chromium optimized for serverless deployments
- **[Sharp](https://sharp.pixelplumbing.com/)** - High-performance image processing

### Development
- **[ESLint](https://eslint.org/)** - JavaScript/React linting
- **[Next/font](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)** - Automatic font optimization (Geist)

## 🚀 Installation & Local Hosting

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm or bun

### 1. Clone the project
```bash
git clone https://github.com/thboehi/color-tester.git
cd color-tester
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment configuration
Create a `.env.local` file at the root:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 4. Start development server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The project will be accessible at [http://localhost:3000](http://localhost:3000)

### 5. Backend (Important!)

⚠️ **Important note**: For website analysis to work, you must also start the backend separately.

👉 **[Link to Color Tools API backend](https://github.com/thboehi/color-tools-backend)**

The backend handles website analysis via Puppeteer and must be running on port 3001 for the frontend application to work properly.

### Available scripts
```bash
npm run dev      # Start development mode with Turbopack
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint check
```

## 🎨 Main Features

### Website Analyzer
- Automatic dark/light color ratio analysis
- Real-time screenshots
- OLED energy efficiency score calculation
- Analysis history
- Results export

### Color Stresser
- Test different patterns and colors
- Energy cost calculator
- Real-time consumption simulation
- Comparison mode
- Built-in usage guide

### Badge Generator
- Dynamic SVG badge generation
- Multiple formats (HTML, Markdown, direct URL)
- Easy integration on websites and README
- Optimized cache for performance

### Algorithm Documentation
- Detailed explanation of luminance calculations
- W3C and sRGB standards
- Scientific references
- Access to research thesis (integrated PDF)

## 🙏 Acknowledgments

- **SAE Institute** for academic guidance and resources
- **Open source community** for the exceptional libraries used
- **W3C** for luminance and accessibility standards
- **Vercel team** for Next.js and deployment ecosystem
- **Puppeteer & Sharp contributors** for image analysis tools
- **All testers** who helped improve the user experience

Special thanks to the developer community interested in energy optimization and sustainable web development.

## 🎓 Conclusion

Color Tools represents an innovative approach to raising awareness and equipping web developers in creating more environmentally friendly interfaces. By combining rigorous technical analysis with intuitive user interface, this project demonstrates that it's possible to reconcile performance, aesthetics, and energy efficiency.

With the environmental impact of digital technology becoming increasingly concerning, tools like Color Tools help democratize good eco-design practices for the web. Every pixel counts, and together, we can make a significant difference.

---

**🌱 For a greener web, one pixel at a time.**

[![OLED Energy Efficiency](https://ct.thbo.ch/api/badge?website=https://ct.thbo.ch&score=85)](https://ct.thbo.ch)

---

📧 **Contact**: [thomas@thbo.ch](mailto:thoma@thbo.ch)  
🌐 **Portfolio**: [thbo.ch](https://thbo.ch)  
🎓 **Institution**: SAE Institute Geneva