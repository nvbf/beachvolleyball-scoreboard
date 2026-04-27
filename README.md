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

## Development Commands

### Populate Demo Tournament Data

To populate the Firebase dev database with a demo tournament containing 4 matches spread throughout the current day:

1. First, install Firebase Admin dependency:
   ```bash
   npm install firebase-admin
   ```

2. Get your Firebase service account key from [Firebase Console](https://console.firebase.google.com/):
   - Go to Project Settings → Service Accounts
   - Click "Generate New Private Key"

3. Run via Taskfile:
   ```bash
   task populate-demo SERVICE_ACCOUNT_KEY=/path/to/serviceAccountKey.json
   ```

   Or set the environment variable first:
   ```bash
   export FIREBASE_KEY_PATH=/path/to/serviceAccountKey.json
   task populate-demo SERVICE_ACCOUNT_KEY=/path/to/serviceAccountKey.json
   ```

The script is idempotent - running it again on the same day will add 4 more matches to the existing tournament. See [scripts/POPULATE_DEMO_TOURNAMENT.md](scripts/POPULATE_DEMO_TOURNAMENT.md) for more details.
