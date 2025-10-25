# Claude Code Resources - Quick Start Guide

**Project:** Vista Pension Calculator
**Date:** 2025-10-25

---

## 🚀 Quick Access

### Your Project Documentation
```bash
# View all project fixes and documentation
cat .claude/.claude/project-docs/PROJECT_DOCS_INDEX.md

# Quick reference to fixes
cat .claude/.claude/project-docs/FIXES_IMPLEMENTED.md

# GitHub Pages troubleshooting
cat .claude/.claude/project-docs/GITHUB_PAGES_CONFIGURATION_FIX.md
```

### Available Slash Commands (21 total)
All commands are now accessible in `.claude/commands/`:

```bash
# List all available commands
ls -1 .claude/commands/

# View a specific command
cat .claude/commands/commit.md
```

**Most Useful Commands:**
1. `/commit` - Smart git commits with conventional format
2. `/create-pr` - Create pull requests
3. `/pr-review` - Review pull requests
4. `/fix-github-issue` - Fix GitHub issues
5. `/testing_plan_integration` - Test planning
6. `/todo` - Task management
7. `/release` - Create releases
8. `/clean` - Clean up codebase

### Available AI Agents (150+ total)
All agents are now accessible in `.claude/agents/`:

```bash
# List all available agents
ls -1 .claude/agents/

# View a specific agent
cat .claude/agents/oracle.md
```

**Most Useful Agents:**
1. `oracle` - Advanced debugging & deep analysis (GPT-5)
2. `code-review-expert` - 6-agent parallel code review
3. `triage-expert` - Problem diagnosis
4. `typescript-expert` - TypeScript/JavaScript help
5. `react-expert` - React optimization
6. `nestjs-expert` - NestJS backend help
7. `refactoring-expert` - Code refactoring
8. `research-expert` - Deep research
9. `ai-sdk-expert` - AI SDK integration
10. `cli-expert` - CLI development

---

## 📖 How to Use

### Using Slash Commands

In Claude Code, you can now use any command like this:

```
/commit
/create-pr
/pr-review
```

Each command file contains:
- Usage instructions
- What the command does
- Best practices
- Examples

### Using AI Agents

Agents are specialized prompts that give Claude specific expertise. To use:

1. **Read the agent file** to understand its capabilities:
   ```bash
   cat .claude/agents/oracle.md
   ```

2. **Invoke the agent** by asking Claude to use it:
   ```
   "Can you use the oracle agent to help debug this complex issue?"
   ```

3. **Let Claude reference** the agent's specialized knowledge automatically

### Agent Categories

**Debugging & Analysis:**
- `oracle` - Deep debugging, GPT-5 powered
- `triage-expert` - Problem diagnosis
- `debugger` - General debugging
- `error-detective` - Error analysis

**Code Review & Quality:**
- `code-review-expert` - Comprehensive 6-agent review
- `refactoring-expert` - Code improvements
- `architecture-modernizer` - Architecture review
- `compliance-specialist` - Standards compliance

**Development:**
- `typescript-expert` - TypeScript/JavaScript
- `react-expert` - React development
- `nestjs-expert` - NestJS backend
- `frontend-developer` - Frontend work
- `database-architect` - Database design

**DevOps & Deployment:**
- `devops-troubleshooter` - DevOps issues
- `cloud-architect` - Cloud infrastructure
- `deployment-engineer` - Deployment help

**Research & Planning:**
- `research-expert` - Deep research
- `comprehensive-researcher` - Thorough research
- `business-analyst` - Business analysis

---

## 🎯 Common Use Cases

### 1. Creating a Commit

**Quick Way:**
```
/commit
```

**What it does:**
- Checks staged files
- Analyzes changes
- Creates conventional commit message
- Uses appropriate emoji
- Runs pre-commit checks

### 2. Debugging Complex Issues

**Ask Claude:**
```
"Can you use the oracle agent to help me debug why my pension
calculations are off by €12,000? I think it's related to the
compound interest formula."
```

**What happens:**
- Claude reads the oracle agent configuration
- Uses advanced debugging techniques
- Provides deep analysis
- Suggests solutions

### 3. Code Review

**Quick Way:**
```
/pr-review
```

**Or with agent:**
```
"Use the code-review-expert agent to review my latest changes"
```

**What it does:**
- Reviews code for bugs
- Checks architecture
- Analyzes performance
- Verifies security
- Suggests improvements

### 4. Creating Pull Request

**Quick Way:**
```
/create-pr
```

**What it does:**
- Analyzes all commits since branch diverged
- Creates comprehensive PR description
- Adds test plan
- Links related issues

---

## 📚 Complete Resource Index

### Project Documentation
Located in `.claude/.claude/project-docs/`:
- `PROJECT_DOCS_INDEX.md` - Complete index
- `FIXES_IMPLEMENTED.md` - All fixes (€12k error, calculators)
- `QA_FIXES_SUMMARY.md` - QA deliverables
- `DEPLOYMENT_STATUS.md` - Deployment guide
- `WHITE_SCREEN_ROOT_CAUSE.md` - Troubleshooting
- `GITHUB_PAGES_FIX.md` - Router fix
- `GITHUB_PAGES_CONFIGURATION_FIX.md` - Settings fix

### Slash Commands
Located in `.claude/commands/`:
- 21 ready-to-use commands
- Each with usage instructions
- Examples and best practices

### AI Agents
Located in `.claude/agents/`:
- 150+ specialized agents
- Organized by category
- Detailed expertise descriptions

### Reference Collections
Located in `.claude/.claude/`:
- `MASTER_INDEX.md` - Complete resource guide
- `AWESOME_CLAUDE_INDEX.md` - Awesome Claude collection
- `CLAUDEKIT_INDEX.md` - ClaudeKit collection
- `awesome-resources/` - 21 project examples
- `claudekit-agents/` - Original agent files
- `claudekit-commands/` - Original command files

---

## 🔧 Configuration

### Current Setup

**Commands Available:** 21
```bash
ls .claude/commands/
```

**Agents Available:** 150+
```bash
ls .claude/agents/
```

**Permissions:** Auto-approved common operations
- Git operations (commit, push, pull)
- Build operations (npm, build, test)
- Deployment checks (curl, status)
- File operations (read, edit, write)

### Customization

To add your own commands or agents:

1. **Create a new command:**
   ```bash
   cat > .claude/commands/my-command.md << 'EOF'
   # My Custom Command

   Description of what this command does...
   EOF
   ```

2. **Create a new agent:**
   ```bash
   cat > .claude/agents/my-expert.md << 'EOF'
   ---
   name: my-expert
   description: My specialized expert agent
   tools: Bash, Read, Edit
   ---

   # My Expert Agent

   Specialized knowledge and instructions...
   EOF
   ```

---

## 💡 Pro Tips

### 1. Combine Commands and Agents

```
"Use the typescript-expert agent to help me fix these errors,
then use /commit to create a proper commit"
```

### 2. Chain Operations

```
/commit
/create-pr
/pr-review
```

### 3. Use Agents Proactively

Claude can automatically use agents when appropriate. The agents are configured to be invoked when:
- Encountering complex bugs → `oracle`
- Code review needed → `code-review-expert`
- TypeScript errors → `typescript-expert`
- Performance issues → `refactoring-expert`

### 4. Reference Documentation

All agents and commands have detailed documentation:
```bash
# Before using, read the docs
cat .claude/commands/commit.md
cat .claude/agents/oracle.md
```

---

## 📦 What's Included

### Statistics
- **Commands:** 21 slash commands
- **Agents:** 150+ specialized AI agents
- **Project Docs:** 7 comprehensive guides
- **Examples:** 21 project examples
- **Total Files:** 500+ documentation files
- **Total Lines:** 88,000+ lines of guidance

### Quality
- ✅ Production-ready commands
- ✅ Battle-tested agents
- ✅ Comprehensive documentation
- ✅ Real-world examples
- ✅ Best practices included

---

## 🎓 Learning Path

### Beginner
1. Start with `/commit` for better commits
2. Use `/todo` for task management
3. Try `/create-pr` for pull requests

### Intermediate
4. Use `oracle` for debugging
5. Try `code-review-expert` for reviews
6. Explore `typescript-expert` for type issues

### Advanced
7. Create custom commands
8. Combine multiple agents
9. Build workflows with chains

---

## 🆘 Quick Help

### Where is everything?
- **Commands:** `.claude/commands/`
- **Agents:** `.claude/agents/`
- **Project Docs:** `.claude/.claude/project-docs/`
- **Examples:** `.claude/.claude/awesome-resources/`

### How do I use a command?
```
/command-name
```

### How do I use an agent?
```
"Use the [agent-name] agent to help with [task]"
```

### Where can I learn more?
```bash
cat .claude/.claude/MASTER_INDEX.md
```

---

## ✨ Next Steps

1. **Browse available commands:**
   ```bash
   ls .claude/commands/
   ```

2. **Explore agents:**
   ```bash
   ls .claude/agents/
   ```

3. **Read project documentation:**
   ```bash
   cat .claude/.claude/project-docs/PROJECT_DOCS_INDEX.md
   ```

4. **Try a command:**
   ```
   /commit
   ```

5. **Use an agent:**
   ```
   "Use the oracle agent to review my code"
   ```

---

**Prepared by:** Claude Code AI Assistant
**Setup Date:** 2025-10-25
**Status:** ✅ Fully Configured and Ready to Use

**Need help?** Just ask Claude to use any command or agent!
