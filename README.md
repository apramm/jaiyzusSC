# YouTube SuperChat Tracker

web app to track superchats and donations for youtube. Built with Next.js, TypeScript, and Tailwind CSS.


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


### 🌙 **Modern UI/UX**
- Dark/Light mode toggle
- Responsive design
- Smooth animations
- YouTube-inspired aesthetics
- Mobile-friendly interface

## ✨ Future Features

### 🎨 **YouTube Integration**
- Channel information display
- Live stream status
- Subscriber and view counts
- Stream viewer tracking
- YouTube branding


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

---
