# CLAUDE.md

## Workflow

- Always commit after completing changes.

## Deployment

Deployed as Dokku app `beachvolleyball-scoreboard` at https://scoreboard.sindres.no.

Auto-deploys on push to `main` via Forgejo webhook → dokku-webhook service.

To manually redeploy:
```bash
sudo dokku git:sync beachvolleyball-scoreboard https://forgejo.sindres.no/nvbf/beachvolleyball-scoreboard.git main --build
```
