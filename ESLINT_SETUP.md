# ESLint Configuration - Complete Setup ✅

## Status: Ready to Deploy
All ESLint configuration files have been created and package.json files have been updated with dependencies and lint scripts.

---

## What Was Done

### 1. Created Frontend ESLint Configuration
**File:** `eslint.config.js` (root directory)

Supports:
- React 18+ with JSX syntax
- React Hooks with exhaustive-deps warnings
- JSX accessibility rules (a11y)
- Vite build tool ignores (dist, build, .vite)
- Backend folder excluded from frontend linting

### 2. Created Backend ESLint Configuration
**File:** `backend/eslint.config.js`

Supports:
- Node.js/Express environment
- ES2021 syntax
- Database ignores (data, uploads folders)
- Server logging rules (console.warn, console.error, console.info allowed)
- Production-ready configuration

### 3. Updated Package.json Files

**Frontend Root (`package.json`):**
- Added lint script: `"lint": "npm --prefix backend run lint && eslint ."`
- Added ESLint dependencies:
  - @eslint/js@9.0.0
  - eslint@9.0.0
  - eslint-plugin-react@7.34.1
  - eslint-plugin-react-hooks@4.6.0
  - eslint-plugin-jsx-a11y@6.8.0
  - globals@14.0.0

**Backend (`backend/package.json`):**
- Added lint script: `"lint": "eslint ."`
- Added ESLint dependencies:
  - @eslint/js@9.0.0
  - eslint@9.0.0
  - globals@14.0.0

### 4. Fixed Known Issues
- Removed duplicate `const fs = require()` statement in `gen.js`

---

## How to Use

### Initial Setup
```bash
# Install frontend dependencies (from root directory)
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Run Linting

**Lint entire project (backend + frontend):**
```bash
npm run lint
```

**Lint backend only:**
```bash
cd backend
npm run lint
```

**Lint frontend only:**
```bash
eslint .
```

**Auto-fix issues (where possible):**
```bash
npm run lint -- --fix
```

---

## Expected Lint Results

### ✅ Will Pass
- No undefined variables
- Proper React Hook usage
- Valid JavaScript syntax
- Consistent code style

### ⚠️ Warnings (Won't Fail Lint)
- `console.log()` statements in backend (use warn/error for production)
- Some React accessibility patterns
- Unused function parameters prefixed with `_`

### ❌ Errors (Will Fail Lint)
- Truly unused variables/imports (not prefixed with `_`)
- Missing React Hook dependencies
- Undefined variables or globals
- Syntax errors

---

## Configuration Files Reference

### Frontend (eslint.config.js)
```javascript
// Ignores: node_modules, dist, build, coverage, .vite, backend
// Supports: JSX, React Hooks, accessibility
// Files: src/**/*.{js,jsx}, *.js
```

### Backend (backend/eslint.config.js)
```javascript
// Ignores: node_modules, dist, build, coverage, uploads, data
// Environment: Node.js
// Format: ES2021 modules
// Files: **/*.js
```

---

## Rule Severity Levels

| Level | Symbol | Meaning |
|-------|--------|---------|
| error | 🔴 | Fails lint, must fix |
| warn | 🟡 | Shows warning, lint passes |
| off | ⚪ | Rule disabled |

---

## Common Fixes

### Unused Variable Error
```javascript
// ❌ Wrong
const unusedVar = getValue();

// ✅ Right (prefix with _)
const _unusedVar = getValue();
```

### React Hook Dependency Warning
```javascript
// ⚠️ Warning: exhaustive-deps
useEffect(() => {
  doSomething(value);  // value is a dependency
}, []); // Missing value in dependencies array

// ✅ Fixed
useEffect(() => {
  doSomething(value);
}, [value]); // Added value
```

### Console Warning (Backend)
```javascript
// ⚠️ Warning (but acceptable in logging)
console.log("Debug info");

// ✅ Better for production
console.warn("Warning message");
console.error("Error message");
```

---

## Integration with IDEs

### VS Code Setup
1. Install ESLint extension: `dbaeumer.vscode-eslint`
2. Create `.vscode/settings.json`:
```json
{
  "eslint.enable": true,
  "eslint.format.enable": true,
  "[javascript]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "dbaeumer.vscode-eslint"
  }
}
```

---

## CI/CD Integration

Add to your GitHub Actions workflow:
```yaml
- name: Run ESLint
  run: npm run lint
```

Or pre-commit hook:
```bash
npm install husky --save-dev
npx husky install
npx husky add .husky/pre-commit "npm run lint"
```

---

## Troubleshooting

### Problem: "Cannot find module 'globals'"
**Solution:** Run `npm install` in project root and backend directories

### Problem: "React is not defined"
**Solution:** ESLint config doesn't require React import (React 17+). This is intentional.

### Problem: "No files matching pattern"
**Solution:** Ensure eslint.config.js is in correct directory and paths are correct

### Problem: Lint takes too long
**Solution:** Check if large node_modules are being scanned. Verify `ignores` pattern in config.

---

## Verify Installation

After running `npm install`, verify everything works:
```bash
# Show ESLint version
npx eslint --version

# Show which config file is being used
npx eslint --print-config index.html

# Run lint with verbose output
npm run lint -- --debug
```

---

## Next Steps

1. **Run the linter:** `npm run lint`
2. **Review warnings:** Check output for actionable issues
3. **Fix errors:** Address any red errors before committing
4. **Configure IDE:** Set up VS Code for real-time linting
5. **Add to CI/CD:** Ensure lint runs on every commit/PR

---

## ESLint Flat Config vs Legacy Config

This project uses **flat config** (ESLint 9+):
- Simpler JavaScript configuration
- No JSON syntax needed
- Better plugin support
- Easier to extend and maintain

**Files:**
- Frontend: `eslint.config.js` (replaces .eslintrc.json)
- Backend: `backend/eslint.config.js`

**Documentation:** https://eslint.org/docs/latest/use/configure/configuration-files

---

**Setup Date:** August 14, 2026  
**ESLint Version:** 9.0.0  
**Configuration Format:** Flat Config  
**Status:** ✅ Ready for use
