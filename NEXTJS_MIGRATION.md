# Next.js Migration Guide

This guide will help you complete the migration from React + Vite to Next.js.

## 🚀 Quick Start

### 1. Install Dependencies

First, remove the old lock files and install Next.js dependencies:

```bash
# Remove old lock files
rm package-lock.json pnpm-lock.yaml

# Install dependencies
npm install
# or
pnpm install
```

### 2. Remove Old Files

Delete these Vite-specific files:

```bash
rm vite.config.ts
rm tsconfig.app.json
rm tsconfig.node.json
rm index.html
rm eslint.config.js
rm -rf dist/
```

### 3. Environment Variables

Create a `.env.local` file in your root directory:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api

# Firebase Configuration (update with your values)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Update Firebase Configuration

Update `src/lib/firebase.ts` to use Next.js environment variables:

```typescript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: "G-SML9W6B8FW"
};
```

### 5. Run the Development Server

```bash
npm run dev
# or
pnpm dev
```

Your app should now be running on [http://localhost:3000](http://localhost:3000)

## 📁 New Project Structure

```
nextjs-crm/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage (Articles)
│   │   ├── globals.css        # Global styles
│   │   ├── login/
│   │   │   └── page.tsx       # Login page
│   │   ├── register/
│   │   │   └── page.tsx       # Register page
│   │   ├── dashboard/
│   │   │   ├── page.tsx       # Dashboard
│   │   │   ├── posts/
│   │   │   ├── users/
│   │   │   └── balance/
│   │   ├── posts/
│   │   │   └── [slug]/
│   │   │       └── page.tsx   # Dynamic post pages
│   │   └── [categorySlug]/
│   │       └── page.tsx       # Dynamic category pages
│   ├── components/            # Same as before
│   ├── lib/                   # Same as before
│   ├── pages/                 # Page components (reused)
│   └── types/                 # Same as before
├── public/                    # Static assets
├── next.config.js            # Next.js configuration
└── package.json              # Updated dependencies
```

## 🔄 Key Changes Made

### 1. Routing System
- **Before**: React Router DOM with `<BrowserRouter>`, `<Routes>`, `<Route>`
- **After**: Next.js App Router with file-based routing

### 2. Navigation
- **Before**: `import { Link, useNavigate } from 'react-router-dom'`
- **After**: `import Link from 'next/link'` and `import { useRouter } from 'next/navigation'`

### 3. Environment Variables
- **Before**: `import.meta.env.VITE_API_BASE_URL`
- **After**: `process.env.NEXT_PUBLIC_API_BASE_URL`

### 4. Client Components
- All interactive components now have `'use client'` directive at the top

### 5. Protected Routes
- **Before**: Route-level protection with `<ProtectedRoute>` wrapper
- **After**: Component-level protection with `<ProtectedRoute>` component

## 🛠 Additional Updates Needed

### Update Remaining Components

You may need to update other components that use React Router. Look for:

1. **Import statements**: Replace `react-router-dom` imports
2. **useNavigate**: Replace with `useRouter` from `next/navigation`
3. **useLocation**: Replace with `usePathname` from `next/navigation`
4. **Link components**: Replace with Next.js `Link`

### Example Component Update:

**Before (React Router):**
```tsx
import { Link, useNavigate, useLocation } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <div>
      <Link to="/dashboard">Dashboard</Link>
      <button onClick={() => navigate('/posts')}>Go to Posts</button>
    </div>
  );
}
```

**After (Next.js):**
```tsx
'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

function MyComponent() {
  const router = useRouter();
  const pathname = usePathname();
  
  return (
    <div>
      <Link href="/dashboard">Dashboard</Link>
      <button onClick={() => router.push('/posts')}>Go to Posts</button>
    </div>
  );
}
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
- **Netlify**: Use `npm run build && npm run export` for static export
- **Traditional hosting**: Use `npm run build` and deploy the `.next` folder

## ✅ Features Preserved

All your original features are preserved:
- ✅ Authentication system with role-based access
- ✅ Dashboard with analytics
- ✅ Posts management (CRUD)
- ✅ User management
- ✅ Categories and tags
- ✅ Media management with Firebase
- ✅ Import/export functionality
- ✅ Settings management
- ✅ Responsive design
- ✅ Dark mode support
- ✅ All UI components (shadcn/ui)

## 🐛 Troubleshooting

### Common Issues:

1. **Module not found errors**: Make sure you've installed all dependencies
2. **Environment variables not working**: Ensure they start with `NEXT_PUBLIC_`
3. **Hydration errors**: Add `'use client'` to components using browser APIs
4. **Routing issues**: Check that your file structure matches the new App Router pattern

### Need Help?

If you encounter any issues during migration, check:
1. Next.js documentation: https://nextjs.org/docs
2. App Router migration guide: https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration
3. The console for specific error messages

## 🎉 You're Done!

Your React + Vite CRM is now a Next.js application with all the same functionality plus the benefits of:
- Server-side rendering (SSR)
- Better SEO
- Improved performance
- Built-in optimization
- Better developer experience 