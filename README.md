# Beachvolleyball scoreboard

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/nvbf/beachvolleyball-scoreboard?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Build Status](https://travis-ci.org/nvbf/beachvolleyball-scoreboard.svg?branch=master)](https://travis-ci.org/nvbf/beachvolleyball-scoreboard)
[![Coverage Status](https://img.shields.io/coveralls/nvbf/beachvolleyball-scoreboard.svg)](https://coveralls.io/r/nvbf/beachvolleyball-scoreboard)
[![Dependencies Status](https://david-dm.org/nvbf/beachvolleyball-scoreboard.svg?style=flat)](https://david-dm.org/nvbf/beachvolleyball-scoreboard)
[![DevDependencies Status](https://david-dm.org/nvbf/beachvolleyball-scoreboard/dev-status.svg?style=flat)](https://david-dm.org/nvbf/beachvolleyball-scoreboard#info=devDependencies)

## Prerequisit

You need to have [Node](http://nodejs.org/) and npm installed.
NPM, the node package manager, is installed when you install node.

## Install

`npm install`

### Run
Prerequisit: Install

`NODE_ENV=development DEBUG="*,-babel" API="http://localhost:3000/api/matches/" PORT=4000 npm start`

You can then reach the app on on http://localhost:4000

if port is not specified, it will open on port 3000.

### Test
Prerequisit: Install
To run the test, run `npm test`

It will run checkstyle before it run test.


## Development

when developing it's recommended to run `next` to monitor the files for changes so that they are auto updated
to the public folder.

For developing UI components you can use storybook. `npm run storybook`

# Prod script

```
export NODE_ENV="production"
export DEBUG="*,-babel"
export PORT=4044
next build
npm start
```
