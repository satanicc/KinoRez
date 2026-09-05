# Contributing to KinoRez

We appreciate your interest in contributing to KinoRez! This document outlines the process and guidelines for contributing.

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read and adhere to our Code of Conduct in all interactions.

## Getting Started

1. **Fork the repository**
2. **Clone your fork**: `git clone https://github.com/yourusername/KinoRez.git`
3. **Create a feature branch**: `git checkout -b feature/your-feature-name`
4. **Follow the setup guide**: See [SETUP.md](SETUP.md)

## Development Guidelines

### Code Style

- **TypeScript**: Use strict mode, proper typing
- **React**: Use functional components and hooks
- **CSS**: Use Tailwind CSS classes, avoid inline styles
- **Naming**: Use clear, descriptive names in English

### File Structure

```
server/src/
├── index.ts              # Entry point
├── config.ts             # Configuration
├── services/             # Business logic
├── routes/               # API endpoints
└── utils/                # Helper functions

client/src/
├── main.tsx              # Entry point
├── App.tsx               # Root component
├── pages/                # Page components
├── components/           # Reusable components
└── utils/                # Helper functions
```

### Commit Messages

Follow conventional commits:
```
type(scope): description

feat(search): add advanced search filters
fix(player): resolve video buffering issue
docs(readme): update installation steps
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Pull Requests

1. **Create a descriptive title**
2. **Write a clear description**:
   - What problem does it solve?
   - How does it solve it?
   - Any breaking changes?
3. **Link related issues**: `Fixes #123`
4. **Add screenshots** for UI changes
5. **Ensure tests pass** (if applicable)

### Testing

Currently no automated tests. To add:

1. **Backend**: Add Jest tests in `server/src/__tests__/`
2. **Frontend**: Add Vitest tests in `client/src/__tests__/`

Example:
```typescript
describe('Search API', () => {
  it('should return movies', async () => {
    const response = await axios.get('/api/search?q=test');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });
});
```

## Feature Ideas

Looking for ways to contribute? Here are some ideas:

### High Priority
- [ ] User authentication/accounts
- [ ] Watch history tracking
- [ ] Favorites/bookmarks
- [ ] Advanced filtering
- [ ] Suggestions/recommendations

### Medium Priority
- [ ] Database implementation (MongoDB/PostgreSQL)
- [ ] API response caching
- [ ] Subtitle support
- [ ] Dark/Light theme toggle
- [ ] Multi-language support

### Low Priority
- [ ] Comments system
- [ ] Social sharing
- [ ] User reviews/ratings
- [ ] Trailer playback
- [ ] Cast/crew information

## Bug Reports

Found a bug? Please:

1. **Check if it's already reported**: Search existing issues
2. **Create detailed report**:
   - What were you doing?
   - What happened?
   - What should happen?
   - Steps to reproduce
   - Browser/OS info
   - Screenshots

Example:
```
Title: Video won't play in 4K quality

When selecting 4K quality and clicking play, video doesn't load.
Error in console: "404 Not Found"

Steps:
1. Search for any movie
2. Click to view details
3. Select 4K quality
4. Click Play
5. Video fails to load

Environment:
- OS: Windows 11
- Browser: Chrome 120
```

## Documentation

Help improve documentation:

- [ ] Add API endpoint examples
- [ ] Add troubleshooting guides
- [ ] Improve setup instructions
- [ ] Add video tutorials
- [ ] Document database schema
- [ ] Add architecture diagrams

## Code Review Checklist

Before submitting a PR, ensure:

- [ ] Code follows style guidelines
- [ ] No unnecessary dependencies added
- [ ] TypeScript passes without errors
- [ ] No console.log debugging left in code
- [ ] Changes are well-tested (manual testing counts)
- [ ] Documentation updated
- [ ] Commit messages are clear
- [ ] No breaking changes (or documented)

## Development Workflow

### 1. Pick an Issue or Feature
- Comment on issue to claim it
- Create discussion for new ideas

### 2. Create Feature Branch
```bash
git checkout -b feature/description
git checkout -b fix/description
```

### 3. Develop
```bash
npm run dev
# Make changes, test locally
```

### 4. Commit Changes
```bash
git add .
git commit -m "type(scope): description"
```

### 5. Push and Create PR
```bash
git push origin feature/description
# Go to GitHub and create PR
```

### 6. Respond to Review
- Address feedback
- Push additional commits
- Don't force push to PR branch

## Review Process

1. **Automated checks**: TypeScript, linting
2. **Manual review**: Code quality, architecture
3. **Feedback**: Requested changes or approval
4. **Merge**: Once approved

## Release Process

Current maintainer responsibilities:

1. Collect merged PRs
2. Update version in package.json
3. Update CHANGELOG.md
4. Create GitHub release
5. Deploy to production

## Setting Up Development Environment

### IDE Setup

**VS Code** (Recommended)
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### Useful Extensions
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **Thunder Client** (API testing)
- **Better Comments**

## Performance Tips

- Use React DevTools to find unnecessary re-renders
- Use Lighthouse for performance audits
- Test with slow network (DevTools)
- Monitor bundle size with `npm run build`

## Questions?

- Open an issue with `[QUESTION]` tag
- Check existing discussions
- Create a new discussion

## Recognition

Contributors will be:
- Listed in README
- Mentioned in releases
- Added to GitHub contributors

---

**Thank you for contributing to KinoRez! 🎉**
