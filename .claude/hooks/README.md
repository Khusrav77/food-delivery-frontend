# Hooks

Скрипты для Claude Code hooks. Хуки конфигурируются в `.claude/settings.local.json` под ключом `hooks`.

## Планируемые хуки

- `pre-commit-typecheck.sh` — запускать `vue-tsc --noEmit` перед коммитом
- `post-tool-edit.sh` — уведомление после редактирования файлов

## Подключение хука (пример)

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [{ "type": "command", "command": ".claude/hooks/pre-commit-typecheck.sh" }]
      }
    ]
  }
}
```

Документация: https://docs.anthropic.com/claude-code/hooks