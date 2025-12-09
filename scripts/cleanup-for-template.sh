#!/bin/bash

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() { echo -e "${GREEN}✓${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }
print_info() { echo -e "${BLUE}ℹ${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠${NC} $1"; }

echo -e "${BLUE}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║        Clean Up for Template Repository                   ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

print_info "This script will check for sensitive files before creating the template\n"

# Check for .env files
print_info "Checking for environment files..."
ENV_FILES=$(find . -type f \( -name ".env" -o -name ".env.local" -o -name ".env.*.local" \) -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/.turbo/*")

if [ -z "$ENV_FILES" ]; then
    print_success "No environment files found (good!)"
else
    print_warning "Found environment files:"
    echo "$ENV_FILES"
    echo ""
    print_info "These files are already in .gitignore and won't be pushed"
fi

# Check if .env.example exists
if [ ! -f ".env.example" ]; then
    print_warning ".env.example not found"
    read -p "Create .env.example with placeholder values? (Y/n): " CREATE_EXAMPLE
    CREATE_EXAMPLE=${CREATE_EXAMPLE:-Y}
    
    if [[ $CREATE_EXAMPLE =~ ^[Yy]$ ]]; then
        cat > .env.example << 'EOF'
# Better Auth - Discord OAuth
# Get these from: https://discord.com/developers/applications
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret
BETTER_AUTH_SECRET=generate-with-openssl-rand-base64-32

# Site Configuration
# Production URL for your Next.js app
SITE_URL=http://localhost:3000

# Convex
# Get these by running: npx convex dev
CONVEX_DEPLOYMENT=https://your-deployment.convex.cloud
CONVEX_SITE_URL=https://your-deployment.convex.site

# Database (optional)
# For Drizzle ORM - Supabase, Neon, etc.
DATABASE_URL=postgresql://user:password@host:5432/database

# Expo
# These should match your Convex and Next.js URLs
EXPO_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
EXPO_PUBLIC_NEXTJS_URL=http://localhost:3000
EOF
        print_success ".env.example created"
    fi
else
    print_success ".env.example exists"
fi

# Check for node_modules
print_info "Checking for node_modules..."
if [ -d "node_modules" ]; then
    print_warning "node_modules directory exists (this is normal)"
    print_info "It's in .gitignore and won't be pushed"
else
    print_success "No node_modules directory"
fi

# Check for .setup-completed marker
if [ -f ".setup-completed" ]; then
    print_warning "Found .setup-completed marker file"
    read -p "Remove it? (Y/n): " REMOVE_MARKER
    REMOVE_MARKER=${REMOVE_MARKER:-Y}
    
    if [[ $REMOVE_MARKER =~ ^[Yy]$ ]]; then
        rm .setup-completed
        print_success ".setup-completed removed"
    fi
else
    print_success "No .setup-completed marker"
fi

# Check for sensitive patterns in committed files
print_info "Scanning for potential secrets in tracked files..."
SECRETS_FOUND=false

# Check for API keys, tokens, etc.
PATTERNS=(
    "DISCORD_CLIENT_SECRET=[^\"'\n][a-zA-Z0-9_-]{10,}"
    "BETTER_AUTH_SECRET=[^\"'\n][a-zA-Z0-9+/=]{20,}"
    "API_KEY=[^\"'\n][a-zA-Z0-9_-]{10,}"
    "TOKEN=[^\"'\n][a-zA-Z0-9_-]{10,}"
)

for pattern in "${PATTERNS[@]}"; do
    MATCHES=$(git grep -n "$pattern" 2>/dev/null | grep -v ".env.example" | grep -v "cleanup-for-template.sh" || true)
    if [ ! -z "$MATCHES" ]; then
        SECRETS_FOUND=true
        print_error "Found potential secret:"
        echo "$MATCHES"
        echo ""
    fi
done

if [ "$SECRETS_FOUND" = false ]; then
    print_success "No secrets found in tracked files"
fi

# Check git status
print_info "Checking git status..."
if git diff-index --quiet HEAD --; then
    print_success "Working directory is clean"
else
    print_warning "You have uncommitted changes"
    print_info "Make sure to commit or stash them before creating the template"
fi

# Summary
echo ""
echo -e "${GREEN}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║                 Cleanup Check Complete                    ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

if [ "$SECRETS_FOUND" = true ]; then
    print_error "⚠️  STOP! Found potential secrets in tracked files"
    print_info "Remove them before creating the template repository"
    exit 1
else
    print_success "✅ Repository looks safe to use as a template"
    echo ""
    print_info "Next step: Run ./scripts/create-template-repo.sh"
fi
