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
║        Create Template Repository                         ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    print_error "GitHub CLI (gh) is not installed"
    print_info "Install it with: brew install gh"
    print_info "Or visit: https://cli.github.com/"
    exit 1
fi

# Check if user is logged in to gh
if ! gh auth status &> /dev/null; then
    print_error "Not logged in to GitHub CLI"
    print_info "Run: gh auth login"
    exit 1
fi

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
print_info "Current branch: ${CURRENT_BRANCH}\n"

# Get GitHub username
GH_USERNAME=$(gh api user -q .login)
print_info "GitHub username: ${GH_USERNAME}\n"

# Ask for repository details
read -p "New repository name (e.g., t3-convex-template): " REPO_NAME
if [ -z "$REPO_NAME" ]; then
    print_error "Repository name cannot be empty"
    exit 1
fi

read -p "Repository description: " REPO_DESC
if [ -z "$REPO_DESC" ]; then
    REPO_DESC="Full-stack monorepo template with Next.js, Expo, and Convex"
fi

read -p "Make repository private? (Y/n): " IS_PRIVATE
IS_PRIVATE=${IS_PRIVATE:-Y}

# Set visibility flag
if [[ $IS_PRIVATE =~ ^[Yy]$ ]]; then
    VISIBILITY="--private"
    print_info "Repository will be private"
else
    VISIBILITY="--public"
    print_info "Repository will be public"
fi

echo ""
print_info "Creating repository: ${GH_USERNAME}/${REPO_NAME}"
print_info "Branch to push: ${CURRENT_BRANCH}\n"

read -p "Continue? (Y/n): " CONFIRM
CONFIRM=${CONFIRM:-Y}
if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
    print_info "Cancelled"
    exit 0
fi

echo ""

# Create the repository
print_info "Creating GitHub repository..."
if gh repo create "${REPO_NAME}" \
    ${VISIBILITY} \
    --description "${REPO_DESC}" \
    --source=. \
    --remote=template-origin; then
    print_success "Repository created: https://github.com/${GH_USERNAME}/${REPO_NAME}"
else
    print_error "Failed to create repository"
    exit 1
fi

# Push current branch to new remote
print_info "Pushing ${CURRENT_BRANCH} to new repository..."
if git push template-origin "${CURRENT_BRANCH}:main"; then
    print_success "Branch pushed to template-origin/main"
else
    print_error "Failed to push branch"
    exit 1
fi

# Set the new repo as a template
print_info "Marking repository as template..."
if gh repo edit "${GH_USERNAME}/${REPO_NAME}" --template=true; then
    print_success "Repository marked as template"
else
    print_warning "Could not mark as template automatically"
    print_info "You can do this manually in GitHub Settings → Template repository"
fi

# Add topics
print_info "Adding topics to repository..."
gh repo edit "${GH_USERNAME}/${REPO_NAME}" \
    --add-topic typescript \
    --add-topic monorepo \
    --add-topic nextjs \
    --add-topic expo \
    --add-topic convex \
    --add-topic turborepo \
    --add-topic react-native \
    --add-topic template \
    &> /dev/null
print_success "Topics added"

# Update README
print_info "Updating README..."
if [ -f "TEMPLATE_README.md" ]; then
    # Create a backup of current README
    if [ -f "README.md" ]; then
        cp README.md README.old.md
        print_info "Original README backed up to README.old.md"
    fi
    
    # Replace with template README
    cp TEMPLATE_README.md README.md
    
    # Commit and push
    git add README.md
    if git diff --staged --quiet; then
        print_info "README already up to date"
    else
        git commit -m "docs: update README for template repository"
        git push template-origin "${CURRENT_BRANCH}:main"
        print_success "README updated in template repository"
    fi
else
    print_warning "TEMPLATE_README.md not found, skipping README update"
fi

# Print next steps
echo ""
echo -e "${GREEN}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║              Template Repository Created! 🎉              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

print_info "Repository URL: ${BLUE}https://github.com/${GH_USERNAME}/${REPO_NAME}${NC}\n"

print_info "Next steps:\n"
echo "  1. Visit your repository:"
echo "     ${BLUE}https://github.com/${GH_USERNAME}/${REPO_NAME}${NC}"
echo ""
echo "  2. Verify it's marked as a template:"
echo "     Settings → General → Template repository ✅"
echo ""
echo "  3. Create new projects from the template:"
echo "     ${BLUE}gh repo create my-new-project --template ${GH_USERNAME}/${REPO_NAME} --private${NC}"
echo ""
echo "  4. Or use the GitHub UI:"
echo "     Click 'Use this template' button on the repo page"
echo ""
echo "  5. Then run the setup script in your new project:"
echo "     ${BLUE}./scripts/setup-new-project.sh${NC}"
echo ""

print_info "Remote 'template-origin' has been added to this repository"
print_info "You can push updates to the template with:"
echo "     ${BLUE}git push template-origin ${CURRENT_BRANCH}:main${NC}"
echo ""

print_success "All done! 🚀"
