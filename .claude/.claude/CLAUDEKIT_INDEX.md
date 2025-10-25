# ClaudeKit Resources

This directory contains resources from the [ClaudeKit](https://github.com/carlrannaberg/claudekit) toolkit - a comprehensive collection of custom commands, hooks, and utilities for Claude Code.

## 📚 What's Included

### 1. **Agents** (`claudekit-agents/`)
Specialized AI assistants for different domains (27+ agents):

**Code Quality & Review**
- `code-review-expert.md` - 6-agent parallel code review (architecture, security, performance, testing, quality, docs)
- `refactoring-expert.md` - Code smell detection and comprehensive refactoring guidance
- `code-search.md` - Advanced code search and pattern matching

**Language & Framework Experts**
- `typescript-expert.md` - TypeScript/JavaScript development and type system
- `react-expert.md` - React components, hooks, and performance
- `nestjs-expert.md` - Nest.js architecture and dependency injection
- `ai-sdk-expert.md` - Vercel AI SDK v5 streaming and model integration
- `loopback-expert.md` - LoopBack 4 framework development

**Infrastructure & DevOps**
- `database/` - Query optimization and schema design
- `devops/` - Deployment and operations
- `infrastructure/` - Cloud and infrastructure patterns
- `kafka/` - Apache Kafka configuration and performance tuning

**Development Tools**
- `testing/` - Test strategy, coverage, and best practices
- `cli-expert.md` - CLI tool development
- `build-tools/` - Build system optimization
- `git/` - Git workflows and best practices

**Analysis & Debugging**
- `oracle.md` - Deep debugging and complex problem analysis
- `triage-expert.md` - Context gathering and problem diagnosis
- `research-expert.md` - Research and investigation patterns

### 2. **Commands** (`claudekit-commands/`)
Custom commands for common workflows:

**Development**
- `dev/` - Development workflow commands
- `create-command.md` - Command creation guide
- `create-subagent.md` - Subagent creation guide

**Code Review & Quality**
- `code-review.md` - Automated code review
- `validate-and-fix.md` - Validation and auto-fix

**Git & GitHub**
- `git/` - Git commands and workflows
- `gh/` - GitHub CLI integration
- `checkpoint/` - Git auto-checkpointing

**Configuration & Hooks**
- `config/` - Configuration management
- `hook/` - Hook system
- `agents-md/` - Agent management
- `spec/` - Specification commands

**Research**
- `research.md` - Research and analysis commands

### 3. **Configuration** (`claudekit-config/`)
- `config.json` - Hook configuration
- `config.json.example` - Configuration examples

### 4. **Settings**
- `claudekit-settings.json` - Claude Code settings with hooks configuration

### 5. **Documentation** (`claudekit-docs/`)
Comprehensive guides and references:
- Configuration guides
- Hook system documentation
- Command references
- Best practices

### 6. **Examples** (`claudekit-examples/`)
Real-world examples and templates:
- Hook configurations
- Command implementations
- Workflow patterns

### 7. **Scripts** (`claudekit-scripts/`)
Utility scripts for automation and tooling

### 8. **Main Documentation**
- `CLAUDEKIT_AGENTS.md` - Complete agent reference
- `CLAUDEKIT_README.md` - Full ClaudeKit documentation

## 🎯 Key Features

### Hook System
ClaudeKit provides a powerful hook system for automation:

**Hook Events:**
- `PreToolUse` - Before file access (Read, Write, Edit, MultiEdit)
- `PostToolUse` - After file modifications
- `Stop` - When Claude Code stops
- `SubagentStop` - When subagents complete
- `UserPromptSubmit` - When users submit prompts

**Popular Hooks:**
- `file-guard` - Protect sensitive files from AI access
- `typecheck-changed` - Type checking on modified files
- `lint-project` - Project-wide linting
- `test-project` - Run test suite
- `create-checkpoint` - Git auto-checkpoint
- `check-todos` - Validate todo completions
- `self-review` - Enhanced targeted self-review

### Security Features
- **File Guard**: Protects sensitive files (.env, .key, etc.)
- **Advanced Bash Analysis**: Detects risky shell commands
- **Pipeline Security**: Blocks dangerous command constructs
- **Upload Protection**: Prevents unauthorized file uploads

### Subagent System
Specialized AI assistants that can be invoked:
```
"Use the oracle agent to debug this issue"
"Have the typescript-expert review this type definition"
```

## 📖 How to Use

### Browse Agents
```bash
ls .claude/claudekit-agents/
cat .claude/claudekit-agents/typescript-expert.md
```

### Check Commands
```bash
ls .claude/claudekit-commands/
cat .claude/claudekit-commands/code-review.md
```

### Review Configuration
```bash
cat .claude/claudekit-settings.json
cat .claude/claudekit-config/config.json.example
```

### Explore Documentation
```bash
ls .claude/claudekit-docs/
cat .claude/CLAUDEKIT_README.md
```

## 💡 Best Practices from ClaudeKit

### 1. Hook Configuration
- Use PreToolUse for access control (file-guard)
- Use PostToolUse for validation (typecheck, lint)
- Use Stop for cleanup (create-checkpoint)
- Use UserPromptSubmit for context loading

### 2. Agent Usage
- Invoke specific experts for domain problems
- Use triage-expert for problem diagnosis
- Use oracle for deep debugging
- Use code-review-expert for comprehensive reviews

### 3. Security
- Always protect sensitive files with file-guard
- Use .agentignore for AI access control
- Configure upload protection
- Monitor bash command execution

### 4. Development Workflow
- Enable type checking on file changes
- Run tests automatically
- Create git checkpoints on stop
- Use self-review for code quality

## 🚀 Applying to Your Project

### Example Hook Configuration
```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Read|Edit|MultiEdit|Write",
      "hooks": [{"type": "command", "command": "claudekit-hooks run file-guard"}]
    }],
    "PostToolUse": [{
      "matcher": "Write|Edit|MultiEdit",
      "hooks": [{"type": "command", "command": "claudekit-hooks run typecheck-changed"}]
    }],
    "Stop": [{
      "matcher": "*",
      "hooks": [{"type": "command", "command": "claudekit-hooks run create-checkpoint"}]
    }]
  }
}
```

### Example Agent Usage
Reference agents in your prompts:
```markdown
Use the typescript-expert agent to review this code
Have the react-expert optimize this component
Ask the oracle to debug this complex issue
```

## 🔗 Original Repository

All content sourced from: https://github.com/carlrannaberg/claudekit

⭐ 291 stars | 27 forks | MIT License

## 📊 Agent Categories

### By Domain
- **Frontend**: React, TypeScript, E2E testing
- **Backend**: NestJS, Node.js, Database, Kafka, LoopBack
- **DevOps**: Infrastructure, Build tools, Git
- **Quality**: Code review, Refactoring, Testing
- **Tools**: CLI, Documentation, Research

### By Task
- **Review**: code-review-expert
- **Debug**: oracle, triage-expert
- **Refactor**: refactoring-expert
- **Test**: testing experts
- **Research**: research-expert, code-search

## 📝 Quick Reference

**Most Used Agents:**
1. `typescript-expert.md` - TypeScript/JS development
2. `code-review-expert.md` - Comprehensive code review
3. `react-expert.md` - React development
4. `oracle.md` - Deep debugging
5. `triage-expert.md` - Problem diagnosis

**Most Used Commands:**
1. `code-review.md` - Automated reviews
2. `validate-and-fix.md` - Auto-fix issues
3. `checkpoint/` - Git snapshots
4. `research.md` - Investigation

**Essential Hooks:**
1. `file-guard` - Security (PreToolUse)
2. `typecheck-changed` - Validation (PostToolUse)
3. `create-checkpoint` - Backup (Stop)

---

*Last updated: October 10, 2024*
*Downloaded from ClaudeKit repository*
