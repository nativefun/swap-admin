# Native Swap Frame Admin

This is the admin interface for managing notifications and announcements for the [Native Swap Frame](https://github.com/nativefun/swap). Built with Next.js, it provides a dashboard to manage Farcaster Frame notifications and announcements for the Native Swap platform.

## Features

- 📢 Announcement Management
  - Create, edit announcements

- 🔔 Notification Controls
  - Send notifications to all users
  - Track notification delivery status


## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/nativefun/swap-admin.git
cd swap-admin
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Configure the following variables in your `.env` file:
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
APP_URL=your_app_url
```

4. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the admin dashboard.

## Database Schema

The admin interface uses Supabase with the following tables:

### Announcements Table


- [Native Swap Frame](https://github.com/nativefun/swap) - Main Frame application
- [Farcaster Frames Documentation](https://docs.farcaster.xyz/reference/frames/spec)
