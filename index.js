import * as core from '@actions/core'
import { readFileSync, createReadStream } from 'fs'
import walkSync from 'walk-sync'
import { WebClient } from '@slack/web-api'
import attachAssetsToSlackThread from './src/attach-assets-to-slack-thread'
import formatFailuresAsBlocks from './src/format-failures-as-blocks'
import parseFailLog from './src/parse-fail-log'

// most @actions toolkit packages have async methods
async function run () {
  try {
    const token = core.getInput('token')
    const channel = core.getInput('channel')
    const workdir = core.getInput('workdir') || 'cypress'
    const messageText =
      core.getInput('message-text') ||
      'A Cypress test just finished. Errors follow. Any videos or screenshots are in this thread'

    core.debug(`Token: ${token}`)
    core.debug(`Channel: ${channel}`)
    core.debug(`Message text: ${messageText}`)

    core.debug('Initializing slack SDK')
    const slack = new WebClient(core.getInput('token'))
    core.debug('Slack SDK initialized successfully')

    core.debug('Checking for videos and/or screenshots from cypress')
    // const videos = walkSync(workdir, { globs: ['**/videos/**/*.mp4'] })
    // const screenshots = walkSync(workdir, { globs: ['**/screenshots/**/*.png'] })
    const logs = walkSync(workdir, { globs: ['**/logs/*.json'] })

    core.info(`There were ${logs.length} errors based on the files present.`)
    // if (logs.length > 0) {
    //   core.info(`The log files found were: ${logs.join(', ')}`)
    // } else {
    //   core.debug('No failures found!')
    //   core.setOutput('result', 'No failures logged found so no action taken!')
    //   return
    // }

    // const failures = parseFailLog(logs.map(path => readFileSync(`${workdir}/${path}`)))
    //
    // const failedSpecs = failures.map(failure => failure.testFile.split('/').slice(-1)[0])
    //
    // const failureVideos = videos.filter(video => failedSpecs.some(spec => video.includes(spec)))
    //
    // const failureBlocks = formatFailuresAsBlocks(failures, messageText, failureVideos.length, screenshots.length)

    await slack.chat.postMessage({
      text: "Eleanor's test version",
      channel
    })
    //
    // const { ts: threadId, channel: channelId } = result

    // await attachAssetsToSlackThread(
    //   failureVideos,
    //   screenshots,
    //   slack,
    //   asset => createReadStream(`${workdir}/${asset}`),
    //   { threadId, channelId },
    //   core.debug
    // )

    core.info(`Failure messages and any videos and screenshots have now been sent to your \`${channel}\` channel in Slack!`)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
