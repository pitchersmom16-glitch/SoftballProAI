# Dev Container Configuration

This directory contains the configuration for GitHub Codespaces and VS Code Dev Containers.

## What's Included

- **Node.js 20**: Runtime environment matching production
- **PostgreSQL 16**: Database for local development
- **Git & GitHub CLI**: Version control and GitHub integration
- **VS Code Extensions**:
  - ESLint for linting
  - Prettier for code formatting
  - Tailwind CSS IntelliSense
  - TypeScript support
  - GitHub Copilot
  - SQL Tools for database management

## Configuration Details

- **Forwarded Ports**:
  - 5000: Application server
  - 5432: PostgreSQL database
- **Post-Create Command**: Automatically runs `npm install` to set up dependencies

## Usage

### With GitHub Codespaces

1. Go to the repository on GitHub
2. Click "Code" → "Codespaces" → "Create codespace on [branch]"
3. Wait for the environment to build (first time takes a few minutes)
4. Once ready, run `npm run dev` to start the application

### With VS Code Dev Containers

1. Install the "Dev Containers" extension in VS Code
2. Open the repository in VS Code
3. Press F1 and select "Dev Containers: Reopen in Container"
4. Wait for the container to build
5. Run `npm run dev` to start the application

## Customization

You can modify `devcontainer.json` to:

- Add more VS Code extensions
- Change port forwarding settings
- Modify post-create commands
- Add environment variables
