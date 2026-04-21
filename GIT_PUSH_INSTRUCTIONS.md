# GitHub Push Instructions for Cine Kandy Project

## ⚠️ IMPORTANT: Large Files Issue

### Large Files Detected:
- **CHAMARA & SHANIKA.mp4** (714.1 MB) ❌ TOO LARGE
- **menu.mp4** (436.24 MB) ❌ TOO LARGE
- **frontend/node_modules** (700.43 MB) ✅ Will be ignored by .gitignore
- **backend/node_modules** (14.98 MB) ✅ Will be ignored by .gitignore

### GitHub Limits:
- ❌ **Hard limit:** 2GB per repository
- ⚠️ **Soft limit:** 100MB per file (warnings)
- GitHub LFS (Large File Storage) for files > 100MB

### Solution: Remove or Move Video Files

**Option A: Remove Video Files (Recommended)**
```bash
# Navigate to the project
cd E:\Project\cinekandy-website\Cine_Kandy

# Remove large MP4 files
Remove-Item -Path "frontend/src/CHAMARA & SHANIKA.mp4" -Force
Remove-Item -Path "frontend/src/menu.mp4" -Force
```

**Option B: Use GitHub LFS (if you want to keep videos)**
```bash
# Install GitHub LFS
# Download from: https://git-lfs.github.com/

# Track large files
git lfs install
git lfs track "*.mp4"
git add .gitattributes
```

---

## Step-by-Step Git Commands

### Step 1: Initialize Git Repository
```bash
cd E:\Project\cinekandy-website\Cine_Kandy

# Initialize git (only if not already initialized)
git init

# Check git status
git status
```

### Step 2: Add Remote Repository
```bash
# Add GitHub repository as remote origin
git remote add origin https://github.com/Ashansen-Corder/Cine-Kandy-Production.git

# Verify remote was added
git remote -v
```

### Step 3: Configure Git (First time only)
```bash
# Set your GitHub username
git config --global user.name "Ashansen-Corder"

# Set your GitHub email
git config --global user.email "your-email@example.com"

# Verify configuration
git config --list
```

### Step 4: Add All Files (respecting .gitignore)
```bash
# Add all files except those in .gitignore
git add .

# Check what will be committed
git status
```

### Step 5: Commit Changes
```bash
# Commit with descriptive message
git commit -m "Initial commit: Cine Kandy MERN project with Gallery, Admin Dashboard, Blog, and Contact features"

# Alternative messages:
# git commit -m "Add Gallery Management, Admin Dashboard, Authentication"
# git commit -m "Implement Blog, Contact Forms, Video Integration"
```

### Step 6: Set Default Branch (if needed)
```bash
# Rename master to main (if on master)
git branch -M main

# Or check current branch
git branch
```

### Step 7: Push to GitHub
```bash
# First push to set upstream
git push -u origin main

# Subsequent pushes (simpler)
# git push origin main
```

---

## Full Command Sequence (Copy & Paste)

### PowerShell Commands:
```powershell
cd E:\Project\cinekandy-website\Cine_Kandy

# Remove large video files
Remove-Item -Path "frontend/src/CHAMARA & SHANIKA.mp4" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "frontend/src/menu.mp4" -Force -ErrorAction SilentlyContinue

# Initialize and configure git
git init
git config --global user.name "Ashansen-Corder"
git config --global user.email "your-github-email@example.com"

# Add remote
git remote add origin https://github.com/Ashansen-Corder/Cine-Kandy-Production.git

# Verify files to be committed
git add .
git status

# Commit
git commit -m "Initial commit: Cine Kandy MERN project with Gallery, Admin Dashboard, Blog, and Contact features"

# Push to main branch
git branch -M main
git push -u origin main
```

---

## Common Issues & Solutions

### Issue 1: "remote already exists"
```bash
# Remove existing remote
git remote remove origin

# Add again
git remote add origin https://github.com/Ashansen-Corder/Cine-Kandy-Production.git
```

### Issue 2: "fatal: pathspec did not match any files"
```bash
# Verify files exist
git status

# Make sure you're in the correct directory
pwd
```

### Issue 3: "permission denied" (Authentication)
```bash
# Use GitHub Personal Access Token (PAT)
# Generate at: https://github.com/settings/tokens
# Use token as password when prompted

# Or setup SSH:
# https://docs.github.com/en/authentication/connecting-to-github-with-ssh
```

### Issue 4: "File too large" Error
```bash
# This means a file > 100MB is being pushed
# Solution: Remove the file or use Git LFS
git rm --cached <large-file>
git commit --amend -m "Remove large file"
```

---

## After Push: Verify on GitHub

1. Go to: https://github.com/Ashansen-Corder/Cine-Kandy-Production
2. Verify all files are uploaded
3. Check that `node_modules` folders are **NOT** present
4. Verify `.env` files are **NOT** present

---

## Files Included in Push

✅ **Will be pushed:**
- `frontend/src/**/*.js` (React components)
- `frontend/src/**/*.css` (Styles)
- `backend/server.js` (Express server)
- `backend/routes/**` (API routes)
- `backend/models/**` (Database models)
- `.gitignore` (Properly configured)
- `README.md` & other docs
- `package.json` (dependencies list)

❌ **Will NOT be pushed:**
- `node_modules/` (both frontend & backend)
- `.env` files
- `frontend/build/`
- `backend/dist/`
- `uploads/`
- `logs/`
- `.vscode/`, `.idea/` (IDE files)

---

## Next Steps for Collaboration

After successful push:

1. **Clone on another machine:**
```bash
git clone https://github.com/Ashansen-Corder/Cine-Kandy-Production.git
cd Cine-Kandy-Production/Cine_Kandy
```

2. **Install dependencies:**
```bash
cd frontend && npm install
cd ../backend && npm install
```

3. **Create .env files:**
```bash
# In backend/.env
MONGODB_URI=mongodb://localhost:27017/cinekandy
JWT_SECRET=your_secret_key_here
PORT=5000
```

4. **Run the project:**
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm start
```

---

## Git Workflow for Future Updates

```bash
# Make changes to your files

# Check what changed
git status

# Add specific file or all
git add .
# or
git add path/to/file

# Commit
git commit -m "Description of changes"

# Push
git push origin main

# Pull latest from GitHub
git pull origin main
```

---

## Useful Git Commands

```bash
# View commit history
git log --oneline

# View branches
git branch -a

# Create new branch
git checkout -b feature/new-feature

# Switch branch
git checkout main

# Merge branch
git merge feature/new-feature

# See what will be pushed
git diff origin/main

# Undo last commit (before push)
git reset --soft HEAD~1
```

---

**Generated:** April 21, 2026  
**Project:** Cine Kandy Films - MERN Stack  
**Repository:** https://github.com/Ashansen-Corder/Cine-Kandy-Production.git
