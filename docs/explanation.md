# LearnLock Project Explanation

## Overview
LearnLock is a web application that helps users implement lessons from non-fiction books into their professional lives. The app generates contextual "memos" before specific work events, helping users apply book insights in real-world situations.

## Project Structure

### Core Technologies
- Frontend: Next.js 14, React, TypeScript, Tailwind CSS
- Backend: Firebase (Authentication, Firestore)
- AI: Langchain with Claude API
- Email: Resend API
- UI Components: shadcn/ui

## File-by-File Explanation

### Authentication
`src/contexts/AuthContext.tsx`
- Manages user authentication state
- Provides auth context to the entire app
- Handles login/logout functionality
- Uses Firebase Authentication

### Book Management
`src/types/book.ts`
- Defines book interface with title, author, notes
- Includes timestamps for tracking
- Manages book tags

`src/lib/books.ts`
- CRUD operations for books
- Firestore integration
- Error handling

`src/components/books/BookForm.tsx`
- Form for adding/editing books
- Tag management
- Validation
- File uploads

### Event Management
`src/types/event.ts`
- Defines event structure
- Includes context for memos
- Manages event timing

`src/lib/events.ts`
- Event CRUD operations
- Calendar integration
- Event scheduling

`src/components/events/EventList.tsx`
- Displays upcoming events
- Filtering and sorting
- Calendar view

### Memo Generation
`src/types/memo.ts`
- Defines memo interface
- Status tracking
- Format options

`src/lib/aiService.ts`
- Claude API integration
- Prompt engineering
- Response formatting

`src/components/memos/MemoPreview.tsx`
- Displays generated memos
- Loading states
- Format switching

### Notification System
`src/types/notifications.ts`
- Notification preferences
- Channel settings
- Timing options

`src/lib/notifications.ts`
- Email notifications (Resend)
- Push notifications
- Scheduling

`functions/src/notifications.ts`
- Firebase Cloud Functions
- Scheduled checks
- Notification dispatch

### Sharing Features
`src/types/share.ts`
- Share interface
- Permission settings
- Expiration handling

`src/lib/share.ts`
- Share link generation
- Access control
- Analytics tracking

`src/lib/shareService.ts`
- Email sharing
- Social media integration
- Link management

`src/components/memos/ShareMemoDialog.tsx`
- Share UI dialog
- Method selection
- Options configuration

`src/components/memos/SharedMemoView.tsx`
- Shared memo display
- Expiration handling
- Access tracking

`src/app/shared/[shareId]/page.tsx`
- Dynamic route handling
- Data fetching
- Access validation

`src/app/shared/[shareId]/not-found.tsx`
- 404 handling
- Expired share handling
- User feedback

### Firebase Setup
`src/lib/firebase.ts`
- Firebase initialization
- Authentication setup
- Firestore config

### Environment & Configuration
`.env.local`
- API keys
- Environment variables
- Configuration settings

`.gitignore`
- Excludes sensitive files
- Ignores build artifacts
- Manages dependencies

### Functions
`functions/src/index.ts`
- Cloud Functions entry
- Export management
- Function registration

`functions/src/types.ts`
- Shared type definitions
- Interface declarations
- Type exports

`functions/src/emailTemplates.ts`
- Email HTML templates
- Dynamic content
- Styling

### UI Components
`src/components/ui/*`
- Reusable components
- shadcn/ui integration
- Consistent styling

## Key Features Explained

### Authentication Flow
1. User clicks Google Sign-In
2. Firebase handles OAuth
3. User data stored in Firestore
4. Auth state managed in context

### Memo Generation Process
1. Event triggers generation
2. Book notes processed
3. AI generates memo
4. Result stored and formatted

### Notification System
1. Cloud Functions check events
2. Notifications generated
3. Multiple channels used
4. User preferences respected

### Sharing System
1. User initiates share
2. Link/method selected
3. Permissions applied
4. Analytics tracked

## Database Structure

### Firestore Collections
- users: User profiles and preferences
- books: Book library entries
- events: Upcoming events
- memos: Generated memos
- sharedMemos: Share records
- notifications: Notification logs

## Security
- Environment variables protect keys
- Firebase Rules control access
- Route protection
- Input validation
- Share link expiration

## Future Improvements
1. Enhanced memo customization
2. Advanced book organization
3. More sharing options
4. Calendar sync
5. Mobile app version

## Detailed File Explanations

### Types and Interfaces

`src/types/memo.ts`
