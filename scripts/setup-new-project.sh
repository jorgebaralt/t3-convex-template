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
║        T3 Turbo + Convex Project Setup                    ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Check if this script has already been run
if [ -f ".setup-completed" ]; then
    print_warning "Setup has already been completed for this project."
    read -p "Do you want to run it again? (y/N): " confirm
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
        print_info "Setup cancelled."
        exit 0
    fi
fi

# Function to validate project name
validate_project_name() {
    if [[ ! $1 =~ ^[a-z0-9-]+$ ]]; then
        print_error "Project name must contain only lowercase letters, numbers, and hyphens"
        return 1
    fi
    return 0
}

# Function to validate package name
validate_package_name() {
    if [[ ! $1 =~ ^@[a-z0-9-]+\/[a-z0-9-]+$ ]] && [[ ! $1 =~ ^[a-z0-9-]+$ ]]; then
        print_error "Package name must be a valid npm package name (e.g., @mycompany/myapp or myapp)"
        return 1
    fi
    return 0
}

# Get project configuration
print_info "Let's configure your new project...\n"

# Project name
while true; do
    read -p "Project name (e.g., my-awesome-app): " PROJECT_NAME
    if [ -z "$PROJECT_NAME" ]; then
        print_error "Project name cannot be empty"
        continue
    fi
    if validate_project_name "$PROJECT_NAME"; then
        break
    fi
done

# Package scope
while true; do
    read -p "Package scope (e.g., @mycompany or leave empty): " PACKAGE_SCOPE
    if [ -z "$PACKAGE_SCOPE" ]; then
        PACKAGE_SCOPE="@acme"
        print_info "Using default scope: @acme"
        break
    fi
    if [[ $PACKAGE_SCOPE =~ ^@[a-z0-9-]+$ ]]; then
        break
    fi
    print_error "Package scope must start with @ and contain only lowercase letters, numbers, and hyphens"
done

# App scheme for Expo deep linking
read -p "Expo app scheme (for deep linking, e.g., myapp): " APP_SCHEME
if [ -z "$APP_SCHEME" ]; then
    APP_SCHEME="${PROJECT_NAME}"
    print_info "Using project name as app scheme: ${APP_SCHEME}"
fi

echo ""
print_info "Setting up environment variables...\n"

# Discord OAuth
read -p "Discord Client ID: " DISCORD_CLIENT_ID
read -p "Discord Client Secret: " DISCORD_CLIENT_SECRET

# Site URL (for production)
read -p "Site URL (production, e.g., https://myapp.com) [http://localhost:3000]: " SITE_URL
SITE_URL=${SITE_URL:-http://localhost:3000}

# Convex
print_info "\nConvex setup (run 'npx convex dev' to get these values)"
read -p "Convex Deployment URL: " CONVEX_DEPLOYMENT_URL
read -p "Convex Site URL: " CONVEX_SITE_URL

# Database (optional)
read -p "Database URL (optional, for Drizzle): " DATABASE_URL

echo ""
print_info "Configuration complete! Starting setup...\n"

# 1. Replace package names
print_info "Replacing package scope in all files..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    find . -type f \( -name "*.json" -o -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
        -not -path "*/node_modules/*" \
        -not -path "*/.next/*" \
        -not -path "*/dist/*" \
        -not -path "*/.turbo/*" \
        -exec sed -i '' "s/@acme/${PACKAGE_SCOPE}/g" {} +
else
    # Linux
    find . -type f \( -name "*.json" -o -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
        -not -path "*/node_modules/*" \
        -not -path "*/.next/*" \
        -not -path "*/dist/*" \
        -not -path "*/.turbo/*" \
        -exec sed -i "s/@acme/${PACKAGE_SCOPE}/g" {} +
fi
print_success "Package scope replaced"

# 2. Update root package.json name
print_info "Updating root package.json..."
if command -v jq &> /dev/null; then
    jq --arg name "$PROJECT_NAME" '.name = $name' package.json > package.json.tmp && mv package.json.tmp package.json
    print_success "Root package.json updated"
else
    print_warning "jq not installed, skipping package.json name update (install jq for automatic updates)"
fi

# 3. Update Expo app scheme
print_info "Updating Expo app scheme..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/servifai/${APP_SCHEME}/g" apps/expo/app.config.ts
else
    sed -i "s/servifai/${APP_SCHEME}/g" apps/expo/app.config.ts
fi
print_success "Expo app scheme updated"

# 4. Create .env file
print_info "Creating .env file..."
cat > .env << EOF
# Better Auth - Discord OAuth
DISCORD_CLIENT_ID=${DISCORD_CLIENT_ID}
DISCORD_CLIENT_SECRET=${DISCORD_CLIENT_SECRET}
BETTER_AUTH_SECRET=$(openssl rand -base64 32)

# Site Configuration
SITE_URL=${SITE_URL}

# Convex
CONVEX_DEPLOYMENT=${CONVEX_DEPLOYMENT_URL}
CONVEX_SITE_URL=${CONVEX_SITE_URL}

# Database (optional)
${DATABASE_URL:+DATABASE_URL=${DATABASE_URL}}

# Expo
EXPO_PUBLIC_CONVEX_URL=${CONVEX_DEPLOYMENT_URL}
EXPO_PUBLIC_NEXTJS_URL=${SITE_URL}
EOF
print_success ".env file created"

# 5. Create Convex .env.local
print_info "Creating Convex .env.local..."
mkdir -p packages/convex
cat > packages/convex/.env.local << EOF
# Site Configuration
SITE_URL=${SITE_URL}

# Better Auth - Discord OAuth
DISCORD_CLIENT_ID=${DISCORD_CLIENT_ID}
DISCORD_CLIENT_SECRET=${DISCORD_CLIENT_SECRET}
EOF
print_success "Convex .env.local created"

# 6. Install dependencies
print_info "Installing dependencies (this may take a few minutes)..."
if pnpm install; then
    print_success "Dependencies installed"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# 7. Initialize git (if not already initialized)
if [ ! -d ".git" ]; then
    print_info "Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit: ${PROJECT_NAME}"
    print_success "Git repository initialized"
else
    print_info "Git repository already exists, skipping initialization"
fi

# 8. Mark setup as complete
touch .setup-completed
echo "${PROJECT_NAME}" > .setup-completed

# Print next steps
echo ""
echo -e "${GREEN}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║                  Setup Complete! 🎉                       ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

print_info "Next steps:\n"
echo "  1. Set up Convex:"
echo "     ${BLUE}npx convex dev${NC}"
echo ""
echo "  2. Generate Better Auth schema:"
echo "     ${BLUE}pnpm --filter ${PACKAGE_SCOPE}/auth generate${NC}"
echo ""
echo "  3. Start development servers:"
echo "     ${BLUE}pnpm dev${NC}"
echo ""
echo "  4. Configure Discord OAuth:"
echo "     - Go to https://discord.com/developers/applications"
echo "     - Add redirect URL: ${SITE_URL}/api/auth/callback/discord"
echo ""

print_success "Happy coding! 🚀"
