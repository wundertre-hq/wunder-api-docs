# AGENTS.md

## GitHub issues

- GitHub issues: write the minimum a human needs to take the issue over cold — nothing missing, nothing extra (no narrative, padding, or repetition). Follow `.github/ISSUE_TEMPLATE/issue.yml` (headings and rules) even when filing via `gh` or the API.
- Agent-filed issues: apply the `agent-filed` label and end the body with a footer naming the filing agent and the human to ask (e.g. `Filed by <agent> for <human>`).
- Security issues (vulnerabilities, leaked secrets, data exposure): never file them as public GitHub issues; follow SECURITY.md.

## CI runners

- When adding or changing CI, use Blacksmith runners instead of GitHub-hosted Actions runners wherever possible. This is guidance for future CI work, not a task to migrate existing workflows.
