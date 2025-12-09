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
║           Update Template Repository                      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Check if template-origin remote exists
if ! git remote | grep -q "^template-origin$"; then
    print_error "Remote 'template-origin' not found"
    print_info "Run ./scripts/create-template-repo.sh first to create the template repository"
    exit 1
fi

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
print_info "Current branch: ${CURRENT_BRANCH}\n"

# Get template repository URL
TEMPLATE_URL=$(git remote get-url template-origin)
print_info "Template repository: ${TEMPLATE_URL}\n"

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    print_warning "You have uncommitted changes"
    read -p "Do you want to commit them first? (Y/n): " COMMIT_CHANGES
    COMMIT_CHANGES=${COMMIT_CHANGES:-Y}
    
    if [[ $COMMIT_CHANGES =~ ^[Yy]$ ]]; then
        echo ""
        read -p "Commit message: " COMMIT_MSG
        if [ -z "$COMMIT_MSG" ]; then
            COMMIT_MSG="chore: update template"
        fi
        
        git add -A
        git commit -m "${COMMIT_MSG}"
        print_success "Changes committed"
    else
        print_info "Continuing without committing..."
    fi
fi

echo ""
print_info "Pushing ${CURRENT_BRANCH} to template repository..."

# Push to template repository
if git push template-origin "${CURRENT_BRANCH}:main"; then
    print_success "Template repository updated"
else
    print_error "Failed to push to template repository"
    exit 1
fi

# Get the repository name from the URL
REPO_NAME=$(basename -s .git "${TEMPLATE_URL}")
GH_USERNAME=$(echo "${TEMPLATE_URL}" | sed -n 's/.*github.com[:/]\([^/]*\)\/.*/\1/p')

echo ""
echo -e "${GREEN}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║            Template Updated Successfully! 🎉              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

print_info "View your template at:"
echo "     ${BLUE}https://github.com/${GH_USERNAME}/${REPO_NAME}${NC}"
echo ""
print_success "All done! 🚀"
