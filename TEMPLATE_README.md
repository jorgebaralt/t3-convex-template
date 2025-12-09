# 🚀 T3 Turbo + Convex Template

A production-ready monorepo template for building full-stack applications with React Native (Expo), Next.js, and Convex.

## ⚡ Quick Start

### Prerequisites

- Node.js 22.21.0+
- pnpm 10.19.0+
- Git

### Create a New Project

1. **Use this template** on GitHub (click "Use this template" button)
   - Or clone it: `git clone <your-repo-url> my-new-project`

2. **Run the setup script**:
   ```bash
   cd my-new-project
   chmod +x scripts/setup-new-project.sh
   ./scripts/setup-new-project.sh
   ```

3. **Follow the prompts** to configure:
   - Project name
   - Package scope (e.g., `@mycompany`)
   - Expo app scheme
   - Discord OAuth credentials
   - Convex configuration
   - Database URL (optional)

4. **Start developing**:
   ```bash
   # Terminal 1: Start Convex
   npx convex dev

   # Terminal 2: Start all apps
   pnpm dev
   ```

That's it! Your project is ready. 🎉

## 📦 What's Included

### Apps
- **Next.js** - Web application (React 19, Tailwind CSS v4)
- **Expo** - Mobile app (React Native 0.81, Expo SDK 54)
- **TanStack Start** (optional) - Alternative web framework

### Packages
- **`@<scope>/convex`** - Convex backend with Better Auth integration
- **`@<scope>/ui`** - Shared UI components (shadcn/ui)

### Tooling
- **ESLint** - Linting configuration
- **Prettier** - Code formatting
- **TypeScript** - Type checking
- **Tailwind CSS** - Utility-first CSS
- **Turborepo** - Build system and monorepo management

## 🏗️ Project Structure

```
.
├── apps/
│   ├── expo/          # React Native mobile app
│   └── nextjs/        # Next.js web app
├── packages/
│   ├── convex/        # Convex backend + auth
│   └── ui/            # Shared UI components
├── tooling/
│   ├── eslint/        # Shared ESLint config
│   ├── prettier/      # Shared Prettier config
│   ├── tailwind/      # Shared Tailwind config
│   └── typescript/    # Shared TypeScript config
└── scripts/
    └── setup-new-project.sh  # Setup script

```

## 🔑 Environment Variables

The setup script creates `.env` files with these variables:

### Root `.env`
```bash
DISCORD_CLIENT_ID=your-client-id
DISCORD_CLIENT_SECRET=your-secret
BETTER_AUTH_SECRET=auto-generated
SITE_URL=http://localhost:3000
CONVEX_DEPLOYMENT=https://your-deployment.convex.cloud
CONVEX_SITE_URL=https://your-deployment.convex.site
DATABASE_URL=your-database-url # optional
EXPO_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
EXPO_PUBLIC_NEXTJS_URL=http://localhost:3000
```

### `packages/convex/.env.local`
```bash
SITE_URL=http://localhost:3000
DISCORD_CLIENT_ID=your-client-id
DISCORD_CLIENT_SECRET=your-secret
```

## 🔐 Authentication Flow

This template uses **Better Auth** with **Convex** for authentication:

```
Expo App → Next.js Auth API → Convex Auth Config → Discord OAuth → Next.js Callback → Expo Deep Link
```

### Key Points
- ✅ Expo calls Next.js for authentication (not Convex directly)
- ✅ Discord redirects to Next.js callback URL
- ✅ Next.js redirects back to Expo via deep link
- ✅ Convex stores auth state and provides the auth configuration

## 📱 Development

### Start All Services
```bash
pnpm dev
```

### Start Individual Apps
```bash
pnpm dev:next    # Next.js only
pnpm android     # Expo Android
pnpm ios         # Expo iOS
```

### Add UI Components
```bash
pnpm ui-add
```

### Add New Packages
```bash
pnpm turbo gen init
```

### Linting & Formatting
```bash
pnpm lint
pnpm format
pnpm typecheck
```

## 🚢 Deployment

### Next.js → Vercel

1. Connect your repo to Vercel
2. Set root directory to `apps/nextjs`
3. Add environment variables
4. Deploy!

### Expo → App Stores

```bash
# Install EAS CLI
pnpm add -g eas-cli

# Login
eas login

# Configure
cd apps/expo
eas build:configure

# Build for production
eas build --platform ios --profile production

# Submit to stores
eas submit --platform ios --latest
```

### Convex

```bash
# Deploy to production
npx convex deploy
```

## 🛠️ Customization

### Change Package Scope

The setup script handles this automatically. If you need to change it later:

```bash
# Find and replace @acme with your scope
find . -type f \( -name "*.json" -o -name "*.ts" -o -name "*.tsx" \) \
  -not -path "*/node_modules/*" \
  -exec sed -i '' 's/@acme/@yourscope/g' {} +
```

### Remove Unnecessary Apps

If you only need Next.js or Expo:

```bash
# Remove Expo
rm -rf apps/expo

# Remove Next.js
rm -rf apps/nextjs

# Remove TanStack Start
rm -rf apps/tanstack-start

# Update pnpm-workspace.yaml accordingly
```

## 📚 Documentation

- [Turborepo](https://turbo.build/repo/docs)
- [Convex](https://docs.convex.dev)
- [Better Auth](https://www.better-auth.com)
- [Next.js](https://nextjs.org/docs)
- [Expo](https://docs.expo.dev)
- [shadcn/ui](https://ui.shadcn.com)

## 🤝 Contributing

This is a template repository. Feel free to customize it for your needs!

## 📄 License

See [LICENSE](./LICENSE) for more information.

---

**Built with ❤️ using the T3 Stack + Convex**
