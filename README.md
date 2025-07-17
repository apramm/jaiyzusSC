# YouTube SuperChat Tracker

A modern web application for YouTube live streamers to track superchats and donations in real-time. Built with Next.js, TypeScript, and Tailwind CSS.

![YouTube SuperChat Tracker](https://via.placeholder.com/800x400?text=YouTube+SuperChat+Tracker)

## ✨ Features

### 📊 **Real-time Progress Tracking**
- Interactive progress bar with goal visualization
- Speedometer-style progress indicators
- Duration tracking and ETA calculations
- Milestone celebrations

### 💰 **Data Import & Management**
- CSV file import support
- Text file parsing (multiple formats)
- Manual donation entry
- Export functionality
- Real-time data synchronization

### 🏆 **Contributor Leaderboard**
- Top contributors ranking
- Donation statistics and averages
- Individual contributor profiles
- Achievement badges

### 📈 **Analytics Dashboard**
- Hourly donation charts
- Key metrics overview
- Recent activity feed
- Performance insights

### 🎨 **YouTube Integration**
- Channel information display
- Live stream status
- Subscriber and view counts
- Stream viewer tracking
- YouTube branding

### 🌙 **Modern UI/UX**
- Dark/Light mode toggle
- Responsive design
- Smooth animations
- YouTube-inspired aesthetics
- Mobile-friendly interface

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jaiyzus-sc
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 Usage

### Setting Up a Campaign
1. Click the edit button next to the campaign title
2. Set your fundraising goal amount
3. Add a description for your campaign
4. Start/pause the campaign as needed

### Importing Data
1. Navigate to the Import Data section
2. Choose from the supported formats:
   - **CSV**: `contributor, amount, currency, message, timestamp`
   - **Text**: `"Name donated $50: Message"` or `"Name: $50 - Message"`
3. Drag & drop or select your file
4. Review the import results

### YouTube Integration
1. Enter your YouTube channel ID or handle
2. Click "Connect Channel" to fetch channel information
3. View live stream status and viewer counts
4. Monitor real-time engagement

### Adding Manual Donations
1. Click "Add Donation" in the Progress section
2. Enter contributor name and amount
3. Optionally add a message
4. Submit to update progress instantly

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **File Processing**: Papa Parse
- **Components**: Radix UI primitives

## 📁 Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── Dashboard.tsx    # Main dashboard
│   ├── Header.tsx       # Application header
│   ├── ProgressSection.tsx
│   ├── LeaderboardSection.tsx
│   ├── ImportSection.tsx
│   ├── YouTubeSection.tsx
│   └── StatsSection.tsx
├── lib/                 # Utilities and helpers
│   ├── utils.ts         # General utilities
│   └── data-import.ts   # Data processing
├── types/               # TypeScript type definitions
└── styles/              # Global styles
```

## 🌐 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy with zero configuration

### Manual Deployment
```bash
npm run build
npm start
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for environment-specific settings:

```env
# YouTube API (for real integration)
YOUTUBE_API_KEY=your_youtube_api_key

# Optional: Database URL for persistent storage
DATABASE_URL=your_database_url
```

### YouTube API Setup
1. Create a project in [Google Cloud Console](https://console.cloud.google.com)
2. Enable YouTube Data API v3
3. Create API credentials
4. Add your API key to environment variables

## 🎨 Customization

### Styling
- Modify `src/app/globals.css` for global styles
- Update Tailwind configuration in `tailwind.config.js`
- Customize color schemes in component files

### Features
- Add new import formats in `src/lib/data-import.ts`
- Extend analytics in `src/components/StatsSection.tsx`
- Add integrations in `src/components/YouTubeSection.tsx`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit: `git commit -m 'Add feature-name'`
5. Push: `git push origin feature-name`
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons by [Lucide](https://lucide.dev/)
- Charts powered by [Recharts](https://recharts.org/)

## 📞 Support

- Create an [issue](https://github.com/yourusername/jaiyzus-sc/issues) for bug reports
- Join our [Discord](https://discord.gg/yourdiscord) for community support
- Email: support@yourproject.com

---

Made with ❤️ for the streaming community
