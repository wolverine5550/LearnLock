# LearnLock

LearnLock is a web application that helps users implement lessons from non-fiction books into their professional lives by generating contextual "memos" before specific work events.

## Features

### 📚 Book Management
- Add and organize non-fiction books
- Tag and categorize books
- Add personal notes and insights
- Track reading progress

### 📅 Event Management
- Create and manage work events
- Link events to relevant books
- Set event goals and context
- Calendar integration

### 🤖 AI-Powered Memos
- Automatic memo generation
- Context-aware insights
- Multiple memo formats:
  - Bullet points
  - Narrative style
  - Framework-based

### 🔔 Smart Notifications
- Event reminders
- Memo generation alerts
- Email notifications
- Push notifications (browser)

### 🔗 Sharing Features
- Share memos via email
- Social media integration
- Customizable share links
- Access control options

## Getting Started

### Prerequisites
- Node.js 18 or later
- Firebase account
- Anthropic API key (for Claude)
- Resend API key (for emails)

### Environment Setup
1. Clone the repository
```bash
git clone [repository-url]
cd learnlock
```

2. Install dependencies
```bash
npm install
```

3. Create `.env.local` file with required variables:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_ANTHROPIC_API_KEY=your_claude_api_key
NEXT_PUBLIC_RESEND_API_KEY=your_resend_api_key
```

4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
learnlock/
├── src/
│   ├── app/              # Next.js app router
│   ├── components/       # React components
│   ├── contexts/         # React contexts
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   └── types/           # TypeScript types
├── public/              # Static files
└── functions/           # Firebase functions
```

## Key Technologies

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Firebase (Auth, Firestore)
- **AI**: Langchain with Claude
- **Email**: Resend API
- **Deployment**: Vercel

## Development

### Available Scripts
```bash
# Development
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Building
npm run build

# Production
npm start
```

### Firebase Functions
```bash
# Deploy functions
cd functions
npm run deploy
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Vercel for deployment platform
- Firebase for backend services
- Anthropic for Claude AI
- shadcn for UI components
