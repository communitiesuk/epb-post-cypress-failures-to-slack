const attachAssetsToSlackThread = require('../src/attach-assets-to-slack-thread')

test('it uploads videos and screenshots to Slack', async () => {
  const videos = ['video1.mp4', 'video2.mp4']
  const screenshots = ['image1.png', 'image2.png', 'image3.png']
  const streamAsset = stream => `${stream} as stream`
  const threadOpts = {
    threadId: '34abcd',
    channelId: 'channel_zero'
  }

  const uploadFn = jest.fn()
  const slack = {
    files: {
      uploadV2: uploadFn
    }
  }

  await attachAssetsToSlackThread(videos, screenshots, slack, streamAsset, threadOpts)

  expect(uploadFn.mock.calls).toEqual([
    [{
      filename: 'video1.mp4',
      file: 'video1.mp4 as stream',
      thread_ts: '34abcd',
      channel_id: 'channel_zero'
    }],
    [{
      filename: 'video2.mp4',
      file: 'video2.mp4 as stream',
      thread_ts: '34abcd',
      channel_id: 'channel_zero'
    }],
    [{
      filename: 'image1.png',
      file: 'image1.png as stream',
      thread_ts: '34abcd',
      channel_id: 'channel_zero'
    }],
    [{
      filename: 'image2.png',
      file: 'image2.png as stream',
      thread_ts: '34abcd',
      channel_id: 'channel_zero'
    }],
    [{
      filename: 'image3.png',
      file: 'image3.png as stream',
      thread_ts: '34abcd',
      channel_id: 'channel_zero'
    }]
  ])
})
