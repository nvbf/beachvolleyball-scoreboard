# Beachvolleyball scoreboard

## Prerequisit

You need to have [Node](http://nodejs.org/) and npm installed.
NPM, the node package manager, is installed when you install node.

You also need to have `task` installed:
[Taskfile](https://taskfile.dev/#/installation)

## Install

`npm install`

### Run
Prerequisit: Install

`task run`

You can then reach the app on on http://localhost:4000

if port is not specified, it will open on port 3000.

## Deployment

Deployed via [Dokku](https://dokku.com/) at **https://scoreboard.sindres.no**.

- **Dokku app:** `beachvolleyball-scoreboard`
- **Nginx proxy port:** 5008
- **Build:** nodejs buildpack runs `npm run build`, nginx buildpack serves `dist/`
- **Auto-deploy:** Pushes to `main` trigger deploy via Forgejo webhook

To manually redeploy:
```bash
sudo dokku git:sync beachvolleyball-scoreboard https://forgejo.sindres.no/nvbf/beachvolleyball-scoreboard.git main --build
```

View logs:
```bash
dokku logs beachvolleyball-scoreboard -t
```
