# 🚀 Quick Start Guide

## For Template Creators (You)

### 1. Create the Template Repository

Run this script to push your current branch to a new GitHub repository:

```bash
./scripts/create-template-repo.sh
```

This will:
- Create a new private GitHub repository
- Push your current branch to it
- Mark it as a template repository
- Add relevant topics/tags
- Update the README

### 2. Update the Template Later

When you want to push updates to your template:

```bash
./scripts/update-template.sh
```

## For Template Users

### Create a New Project from Template

#### Option 1: GitHub CLI (Recommended)
```bash
# Create a new private repo from the template
gh repo create my-new-project --template YOUR_USERNAME/TEMPLATE_REPO_NAME --private --clone

# Navigate to the new project
cd my-new-project

# Run the setup script
./scripts/setup-new-project.sh
```

#### Option 2: GitHub UI
1. Go to your template repository on GitHub
2. Click **"Use this template"** → **"Create a new repository"**
3. Name your new project and choose visibility
4. Clone it locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/my-new-project.git
   cd my-new-project
   ./scripts/setup-new-project.sh
   ```

### What the Setup Script Does

The `setup-new-project.sh` script will ask you for:

1. **Project name** - Your app name (e.g., `my-awesome-app`)
2. **Package scope** - npm scope (e.g., `@mycompany` or use default `@acme`)
3. **Expo app scheme** - For deep linking (e.g., `myapp://`)
4. **Discord OAuth** - Client ID and Secret from [Discord Developer Portal](https://discord.com/developers/applications)
5. **Convex config** - Run `npx convex dev` first to get these values
6. **Database URL** - (Optional) For Drizzle ORM

Then it will:
- Replace all `@acme` references with your package scope
- Update project name throughout the codebase
- Configure Expo deep linking
- Create `.env` files with your configuration
- Install all dependencies
- Initialize a fresh git repository

### After Setup

```bash
# Terminal 1: Start Convex backend
npx convex dev

# Terminal 2: Start all development servers
pnpm dev

# Or start specific apps:
pnpm dev:next    # Next.js only
pnpm android     # Expo Android
pnpm ios         # Expo iOS
```

## One-Command Setup (Advanced)

Add this to your `~/.zshrc` or `~/.bashrc`:

```bash
create-project() {
    if [ -z "$1" ]; then
        echo "Usage: create-project <project-name>"
        return 1
    fi
    
    gh repo create "$1" --template YOUR_USERNAME/TEMPLATE_REPO_NAME --private --clone
    cd "$1"
    ./scripts/setup-new-project.sh
}
```

Then:
```bash
source ~/.zshrc
create-project my-awesome-app
```

## 🎯 What You Get

- ✅ **Next.js 15** - Modern React web framework
- ✅ **Expo SDK 54** - React Native mobile app
- ✅ **Convex** - Real-time backend with Better Auth
- ✅ **TypeScript** - Full type safety
- ✅ **Tailwind CSS v4** - Utility-first styling
- ✅ **Turborepo** - Fast monorepo builds
- ✅ **shadcn/ui** - Beautiful UI components
- ✅ **Discord OAuth** - Pre-configured authentication

## 📚 Common Tasks

### Add a new UI component
```bash
pnpm ui-add
```

### Add a new package to the monorepo
```bash
pnpm turbo gen init
```

### Deploy to production
```bash
# Deploy Convex backend
npx convex deploy

# Deploy Next.js to Vercel
# (Connect your repo in Vercel dashboard)

# Build Expo app for stores
cd apps/expo
eas build --platform ios --profile production
```

## 🆘 Troubleshooting

### "state_mismatch" error during auth
Make sure your `SITE_URL` matches exactly where your Next.js app is running.

### "pnpm not found"
```bash
npm install -g pnpm@10.19.0
```

### Port 3000 already in use
The Next.js app will automatically use the next available port (3001, 3002, etc.). Update your `.env` files accordingly.

### Convex deployment URL needed
```bash
npx convex dev
# Copy the deployment URL from the output
```

---

**Need help?** Check the [full README](./README.md) or create an issue.
