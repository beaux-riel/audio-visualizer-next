# Contributing to Audio Visualizer Next

Thank you for your interest in contributing to Audio Visualizer Next! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Install dependencies: `pnpm install`
4. Create a new branch for your feature or bug fix

## Development Workflow

### Setting up your environment

```bash
# Clone the repository
git clone https://github.com/your-username/audio-visualizer-next.git
cd audio-visualizer-next

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

### Code Style

This project follows strict coding standards to maintain consistency and readability:

#### TypeScript/JavaScript Guidelines

- Use TypeScript for all new code
- Follow the existing code patterns and structure
- Use descriptive variable and function names
- Add proper type annotations
- Use modern ES6+ features
- Prefer functional components with hooks over class components

#### Formatting and Linting

- Use Prettier for code formatting: `pnpm format`
- Follow ESLint rules: `pnpm lint`
- Format code before committing: `pnpm format:check`

#### Styling

- Use Tailwind CSS for styling
- Follow utility-first approach
- Use semantic class names where appropriate
- Ensure responsive design principles

### Testing Requirements

All contributions must include comprehensive tests:

#### Unit Tests

- Write unit tests for utilities and individual functions
- Run with: `pnpm test:unit`

#### Integration Tests

- Test component interactions and behavior
- Run with: `pnpm test:integration`

#### End-to-End Tests

- Test complete user workflows
- Run with: `pnpm test:e2e`

#### Test Coverage

- Maintain high test coverage (aim for >90%)
- Run coverage reports: `pnpm test:coverage`

### Commit Message Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/) specification:

#### Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools

#### Examples

```bash
feat: add real-time frequency analysis
fix: resolve audio context initialization issue
docs: update API documentation
test: add comprehensive tests for AudioVisualizer component
refactor: extract audio processing utilities
style: format code with prettier
chore: update dependencies
```

#### Scope Guidelines

- Use lowercase
- Be specific but concise
- Examples: `audio`, `ui`, `tests`, `deps`

### Pull Request Process

1. **Create a descriptive branch name**: `feat/audio-processing` or `fix/microphone-permissions`

2. **Write a clear PR title** following conventional commit format

3. **Include a detailed description** with:
   - What changes were made
   - Why the changes were necessary
   - How to test the changes
   - Screenshots/GIFs for UI changes

4. **Ensure all tests pass**:

   ```bash
   pnpm test:all
   ```

5. **Verify linting and formatting**:

   ```bash
   pnpm lint
   pnpm format:check
   ```

6. **Request review** from maintainers

### Code Review Guidelines

- Be respectful and constructive
- Focus on the code, not the person
- Explain the reasoning behind suggestions
- Be open to feedback and discussion

### Issue Reporting

When reporting issues:

1. Use the issue templates provided
2. Include steps to reproduce
3. Provide error messages and logs
4. Include browser/environment information
5. Add labels appropriately

### Feature Requests

For new features:

1. Check existing issues and discussions
2. Provide detailed use cases
3. Consider the impact on existing functionality
4. Be open to alternative solutions

## Git Hooks

This project uses Husky for Git hooks:

- **pre-commit**: Runs linting and formatting checks
- **commit-msg**: Validates commit message format

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)

## Questions?

If you have questions, feel free to:

- Open an issue for discussion
- Check existing documentation
- Reach out to the maintainers

Thank you for contributing! 🎉
