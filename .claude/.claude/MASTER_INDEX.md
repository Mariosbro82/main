# Master Claude Resources Index

This directory contains two comprehensive collections of Claude Code resources and utilities.

## 📚 Collections

### 1. [Awesome Claude Code](./AWESOME_CLAUDE_INDEX.md)
⭐ 15.2k stars | 847 forks

**What it offers:**
- 21 project CLAUDE.md examples from successful projects
- 20 ready-to-use slash commands
- Workflows and knowledge guides
- Best practices and coding standards

**Key resources:**
- `awesome-resources/` - Project examples (claude-code-mcp-enhanced, Basic-Memory, etc.)
- `slash-commands/` - Pre-built commands (/commit, /create-pr, /fix-github-issue)
- `workflows-knowledge-guides/` - Development workflow guides

**Best for:**
- Learning from successful projects
- Finding coding standards and patterns
- Understanding Claude Code workflows

[📖 View Awesome Claude Index →](./AWESOME_CLAUDE_INDEX.md)

---

### 2. [ClaudeKit](./CLAUDEKIT_INDEX.md)
⭐ 291 stars | 27 forks | MIT License

**What it offers:**
- 27+ specialized AI agents for different domains
- 15+ custom commands for automation
- Complete hook system for workflow automation
- Security features (file-guard, bash analysis)

**Key resources:**
- `claudekit-agents/` - Specialized agents (typescript-expert, oracle, code-review-expert)
- `claudekit-commands/` - Custom commands (code-review, checkpoint, validate-and-fix)
- `claudekit-config/` - Hook configurations
- `claudekit-docs/` - Comprehensive documentation

**Best for:**
- Invoking specialized AI experts
- Setting up automation hooks
- Implementing security controls
- Deep debugging and code review

[📖 View ClaudeKit Index →](./CLAUDEKIT_INDEX.md)

---

## 🚀 Quick Start Guide

### For Project Setup
1. **Review coding standards**: 
   ```
   cat .claude/awesome-resources/claude-code-mcp-enhanced/CLAUDE.md
   ```

2. **Check iOS/mobile patterns**:
   ```
   cat .claude/awesome-resources/DroidconKotlin/CLAUDE.md
   ```

### For Development Automation
1. **Browse available agents**:
   ```
   ls .claude/claudekit-agents/
   ```

2. **Review hook system**:
   ```
   cat .claude/claudekit-settings.json
   ```

### For Security
1. **Set up file protection**:
   ```
   cat .claude/claudekit-agents/README.md
   # Look for file-guard configuration
   ```

2. **Review security best practices**:
   ```
   cat .claude/CLAUDEKIT_INDEX.md
   # See Security Features section
   ```

---

## 💡 Common Use Cases

### Code Review
**Awesome Claude:**
- Check `/commit` slash command for smart commits
- Review code review workflows in workflows-knowledge-guides

**ClaudeKit:**
- Use `code-review-expert` agent for 6-agent parallel review
- Run `code-review.md` command for automated reviews

### TypeScript/React Development
**Awesome Claude:**
- Study `LangGraphJS/CLAUDE.md` for TypeScript patterns
- Check `Course-Builder/CLAUDE.md` for React patterns

**ClaudeKit:**
- Invoke `typescript-expert` for TypeScript issues
- Use `react-expert` for React component optimization

### Debugging
**Awesome Claude:**
- Review debugging workflows in knowledge guides
- Check project examples for debugging patterns

**ClaudeKit:**
- Use `oracle` agent for deep debugging
- Use `triage-expert` for problem diagnosis

### Testing
**Awesome Claude:**
- Check `/testing_plan_integration` slash command
- Review testing patterns in project examples

**ClaudeKit:**
- Use `testing/` agents for test strategies
- Run `test-project` hook for automated testing

---

## 📊 Resource Comparison

| Feature | Awesome Claude | ClaudeKit |
|---------|---------------|-----------|
| **Primary Focus** | Examples & Patterns | Tools & Automation |
| **Project Examples** | ✅ 21 projects | ❌ |
| **Slash Commands** | ✅ 20 commands | ✅ 15+ commands |
| **AI Agents** | ❌ | ✅ 27+ agents |
| **Hook System** | ❌ | ✅ Complete system |
| **Security Tools** | ❌ | ✅ file-guard, bash analysis |
| **Documentation** | ✅ Extensive guides | ✅ Comprehensive docs |
| **Examples** | ✅ CLAUDE.md files | ✅ Real-world examples |

---

## 🎯 Recommended Workflow

### 1. **Learn** (Awesome Claude)
- Study successful project examples
- Understand coding standards
- Learn workflow patterns

### 2. **Implement** (ClaudeKit)
- Set up hooks for automation
- Use specialized agents
- Configure security controls

### 3. **Optimize**
- Combine patterns from both
- Customize for your project
- Iterate and improve

---

## 📁 Directory Structure

```
.claude/
├── MASTER_INDEX.md                    # This file
├── AWESOME_CLAUDE_INDEX.md            # Awesome Claude guide
├── CLAUDEKIT_INDEX.md                 # ClaudeKit guide
│
├── awesome-resources/                 # 21 project examples
│   ├── claude-code-mcp-enhanced/
│   ├── Basic-Memory/
│   └── ...
│
├── slash-commands/                    # Slash commands
│   ├── commit/
│   ├── create-pr/
│   └── ...
│
├── workflows-knowledge-guides/        # Workflow guides
│
├── claudekit-agents/                  # 27+ AI agents
│   ├── typescript-expert.md
│   ├── oracle.md
│   └── ...
│
├── claudekit-commands/                # Custom commands
│   ├── code-review.md
│   ├── checkpoint/
│   └── ...
│
├── claudekit-config/                  # Configurations
├── claudekit-docs/                    # Documentation
├── claudekit-examples/                # Examples
└── claudekit-scripts/                 # Scripts
```

---

## 🔍 Finding What You Need

### By Technology
- **TypeScript/JavaScript**: ClaudeKit's `typescript-expert`, Awesome's `LangGraphJS`
- **React**: ClaudeKit's `react-expert`, Awesome's `Course-Builder`
- **iOS/Mobile**: Awesome's `DroidconKotlin`
- **Backend**: ClaudeKit's `nestjs-expert`, `database`, `kafka`
- **AI/LLM**: Awesome's `Basic-Memory`, ClaudeKit's `ai-sdk-expert`

### By Task
- **Code Review**: ClaudeKit's `code-review-expert` + Awesome's review workflows
- **Debugging**: ClaudeKit's `oracle` + `triage-expert`
- **Testing**: Both collections have testing resources
- **Git Workflows**: ClaudeKit's `git/` + Awesome's `/commit` command
- **Security**: ClaudeKit's `file-guard` and security features

### By Problem Type
- **Architecture Issues**: ClaudeKit's `code-review-expert` (architecture agent)
- **Performance**: ClaudeKit's `code-review-expert` (performance agent)
- **Type Errors**: ClaudeKit's `typescript-expert`
- **Complex Bugs**: ClaudeKit's `oracle`
- **Code Smells**: ClaudeKit's `refactoring-expert`

---

## 🌟 Top Picks

### Must-Read Files
1. `.claude/awesome-resources/claude-code-mcp-enhanced/CLAUDE.md` - Comprehensive coding standards
2. `.claude/CLAUDEKIT_AGENTS.md` - Complete agent reference
3. `.claude/claudekit-settings.json` - Hook system examples
4. `.claude/README.md` - Full awesome-claude-code list

### Most Useful Agents
1. `typescript-expert` - TypeScript/JS development
2. `code-review-expert` - 6-agent parallel review
3. `oracle` - Deep debugging
4. `react-expert` - React optimization
5. `triage-expert` - Problem diagnosis

### Most Useful Commands
1. `/commit` - Smart git commits
2. `code-review.md` - Automated reviews
3. `/create-pr` - Pull request automation
4. `checkpoint/` - Git snapshots
5. `/testing_plan_integration` - Test planning

---

## 📖 Additional Resources

- **Awesome Claude Repository**: https://github.com/hesreallyhim/awesome-claude-code
- **ClaudeKit Repository**: https://github.com/carlrannaberg/claudekit

---

*Last updated: October 10, 2024*
*Both collections downloaded and organized*
