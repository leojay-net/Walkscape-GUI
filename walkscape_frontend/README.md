# WalkScape GUI

A modern, interactive blockchain-powered location-based exploration game. This Next.js application provides a beautiful, responsive web interface for players to manage their WalkScape adventures, connect wallets, and interact with the game's smart contracts.

## About WalkScape GUI

This is the **complete application** for WalkScape, providing:
- **Modern Web Interface**: Beautiful, responsive design with Tailwind CSS and modern animations
- **Wallet Integration**: Seamless connection to Aptos wallets with full wallet support
- **Interactive Dashboard**: Real-time player stats, XP tracking, and progress visualization
- **AI-Powered Scanner**: Environment detection and artifact discovery interface
- **Social Features**: Colony management, player communities, and leaderboards
- **Pet Management**: Digital pet care, evolution, and interaction systems
- **Staking Interface**: Token staking for pet growth and reward harvesting

## GUI Features

### Modern UI Components
- **Landing Page**: Animated hero section with smooth scroll reveals and feature highlights
- **Dashboard**: Real-time stats display with XP tracking, token balance, and player progress
- **Artifact Scanner**: AI-powered camera interface with environment detection and artifact claiming
- **Colony Hub**: Social interface for joining communities, viewing leaderboards, and managing colonies
- **Garden**: Digital pet management with feeding, evolution, and care systems
- **Staking Platform**: Token staking interface with growth rewards and legendary pet traits

### Design & User Experience
- **Responsive Design**: Mobile-first approach optimized for all screen sizes
- **Modern Animations**: Smooth scroll animations, hover effects, and micro-interactions
- **Glass Morphism**: Backdrop blur effects and translucent elements for modern aesthetics
- **Color-Coded Shadows**: Dynamic shadow system with contextual colors for visual hierarchy
- **Professional Theme**: Clean slate-based design with purple, emerald, and blue accents

## 💻 Development Setup

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd walkscape_frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
```

### Environment Configuration
```bash
# Required environment variables
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...  # Deployed WalkScape contract
NEXT_PUBLIC_RPC_URL=https://...     # Aptos RPC endpoint
NEXT_PUBLIC_GEMINI_API_KEY=...      # Google Gemini API key for AI features
```

### Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript validation
```

## 🎯 Technical Architecture

### Application Stack
- **Next.js 15**: React framework with App Router and Turbopack
- **TypeScript**: Type-safe development with full blockchain integration
- **Tailwind CSS**: Responsive, mobile-first design system
- **Scroll Animations**: Custom hooks for smooth scroll-triggered animations
- **Modern UI**: Glass morphism, backdrop blur, and dynamic shadows

### Blockchain Integration
- **Aptos Integration**: Full smart contract interaction
- **Wallet Support**: Multiple wallet compatibility with seamless connection
- **Transaction Management**: Reliable confirmation and error handling
- **Smart Services**: Production-ready blockchain interactions

### AI Integration
- **Google Gemini Vision API**: Environment detection and analysis
- **Camera Integration**: Real-time environment scanning
- **Intelligent Systems**: Smart analysis for enhanced gameplay

## 📱 Component Architecture

### Core Components
- **AppLayout**: Main application wrapper with navigation
- **WalletConnection**: Wallet integration and connection management
- **GuiDashboard**: Player statistics and progress display
- **ArtifactScanner**: AI-powered environment detection
- **Colony**: Social features and community management
- **Garden**: Pet management and care interface
- **Staking**: Token staking and reward systems

### Animation System
- **useScrollAnimation**: Custom hook for scroll-triggered animations
- **useStaggeredScrollAnimation**: Delayed reveals for lists and grids
- **Intersection Observer**: Performance-optimized visibility detection

## 🚀 What is Dead Cannot Die

Built with the resilience and community spirit of the GUI token ecosystem on Aptos. This application represents the commitment to building innovative, user-friendly interfaces that bring blockchain gaming to life.

**STUDY GUI - THE POWER OF COMMUNITY**

## 🌍 Deployment Guide

### Vercel Deployment (Recommended)
```bash
# Build and deploy
npm run build
vercel deploy

# Environment variables in Vercel dashboard:
# NEXT_PUBLIC_CONTRACT_ADDRESS
# NEXT_PUBLIC_RPC_URL  
# NEXT_PUBLIC_GEMINI_API_KEY
```

### Self-Hosted Deployment
```bash
# Build production bundle
npm run build

# Start production server
npm start

# Or use PM2 for process management
pm2 start npm --name "walkscape-gui" -- start
```

## 🤝 Contributing

We welcome contributions to make the WalkScape GUI even better:

1. **Fork the Repository**: Create your own copy for development
2. **Create Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Follow Standards**: Use TypeScript, ESLint, and existing patterns
4. **Test Thoroughly**: Ensure all features work across devices
5. **Submit Pull Request**: Detailed description of changes and testing

### Development Guidelines
- **Code Style**: Follow existing TypeScript and React patterns
- **Mobile First**: Always test on mobile devices
- **Animation Performance**: Optimize scroll animations for all devices
- **Accessibility**: Ensure features work with screen readers

## 📄 License

This project is part of the WalkScape ecosystem. See individual license files for specific terms.

## 🔗 Resources

- **Next.js Guide**: [nextjs.org/docs](https://nextjs.org/docs)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)
- **Aptos Documentation**: [aptos.dev](https://aptos.dev)
- **Google Gemini API**: [ai.google.dev](https://ai.google.dev/)

---

**WalkScape GUI** - Where modern blockchain gaming meets innovation. What is dead cannot die! 🚀
