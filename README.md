# Post Cypress failures to Slack as a GitHub Action

<p align="center">
  <a href="https://github.com/communitiesuk/epb-post-cypress-failures-to-slack/actions"><img alt="test status for communitiesuk/epb-post-cypress-failures-to-slack" src="https://github.com/communitiesuk/epb-post-cypress-failures-to-slack/actions/workflows/test.yml/badge.svg"></a>
</p>

This Github action uses the log files generated by the [`cypress-failed-log`](https://github.com/bahmutov/cypress-failed-log) Cypress plugin and enables you to create a Slack app that sends failure information from a test run (using e.g. [cypress-io/github-action](https://github.com/cypress-io/github-action)) to a Slack channel in one rich message. If you are generating screenshots from Cypress, the action will upload screenshots associated with the failed Cypress specs to a thread from the main message.

Credit to [trymbill/cypress-slack-video-upload-action](https://github.com/trymbill/cypress-slack-video-upload-action) which this action uses as a jumping-off point - the intent of this action is to only send information about failures, so it was considered significantly different enough in intent to warrant its own project.

This project is maintained by the Energy Performance of Buildings Register team within the UK Government's Department for Levelling Up, Housing and Communities (DLUHC). The `epb-` prefix in the repository's name reflects the ownership by this team, but the action is generic enough to be used by anyone.

## Inputs

### `token`

**Required** Slack app token. See [Internal app tokens](https://slack.com/intl/en-ru/help/articles/215770388-Create-and-regenerate-API-tokens#internal-app-tokens)

- Create an app
- Under **Bot Token Scopes**, add `files:write` and `chat:write` permissions
- Install the app into your workspace
- Invite the bot to whichever channels you want to send the creenshots to `/invite <botname>`
- Grab the `Bot User OAuth Token` from the `OAuth & Permissions` page
- Add that token as a secret to your Github repo's `Actions Secrets` found under `Settings -> Secrets` (in the examples below we call it `SLACK_TOKEN`)

### `channel`

**Required** The Slack channel to upload to

### `workdir`

**Optional** The folder where Cypress stores screenshots on the build machine.

Default: `cypress`

(this relative path resolves to `/home/runner/work/<REPO_NAME>/<REPO_NAME>/cypress`)

If your project uses Cypress from the project root folder, the default value will work for you.
But if your project uses Cypress in a subfolder (like most monorepos), you'll need to provide the relative path to that folder
(i.e. `e2e/cypress`).
(Don't include a trailing slash on your path!)

### `message-text`

**Optional** Custom Slack message text.

Default: `A Cypress test just finished. Errors follow. Any screenshots are in this thread`

## Usage

Cypress does not write log files on failure by default, and this action will not do anything if the [`cypress-failed-log`](https://github.com/bahmutov/cypress-failed-log) plugin has not been installed correctly within your Cypress tests. Make sure to follow [the instructions](https://github.com/bahmutov/cypress-failed-log#install) for installing this plugin within your tests, and ensure that log files are being written out into e.g. a cypress/logs directory on failed test runs (no log files are written on successful runs) before continuing to use this action.

### Example: run Cypress tests on push, and send failures to Slack

```yml
on: [push]

jobs:
  test-and-upload-results:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: 'Run tests'
        uses: cypress-io/github-action@v3

      - name: 'Post Cypress failures to Slack'
        uses: communitiesuk/post-cypress-failures-to-slack@v1
        if: failure()
        with:
          token: ${{ secrets.SLACK_TOKEN }}
          channel: 'engineering-ops'
          message-text: 'The Cypress tests run within GitHub Actions failed!'
```

NB. This action uses Node 16 as a runtime, so should be used with at least v3 of [cypress-io/github-action](https://github.com/cypress-io/github-action).

## Development notes

Development on the `v1` branch should take place within that branch, with changes merged back into `main`. Tagged releases for the v1.x releases should likewise be made from `v1`. This branching convention is specific to development of a GitHub action and ensures that the action can be consumed with least surprise.

Code is formatted according to [JavaScript Standard Style](https://standardjs.com) - make sure you [install extensions/plugins](https://standardjs.com/#are-there-text-editor-plugins) to your editor. `npm run lint` lints the code, and `npm run fmt` auto-fixes it.

To check out dependencies for the project, run `npm ci`.

Unit tests can be run using `npm run test`.

Target Node version is v20 - make sure to be running this in your development environment.

### Important note re compilation

The action is consumed as a compiled file (dist/index.js), which is compiled using [`@vercel/ncc`](https://github.com/vercel/ncc). After all changes, and before committing, **make sure to run `npm ci`**. This ensures that you have the correct dependencies within your `node_modules` directory (strictly according to the package-lock.json file), and compiles a new version of dist/index.js, which should then be committed with your changes.