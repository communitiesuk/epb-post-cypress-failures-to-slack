const attachAssetsToSlackThread = async (
	screenshots,
	slack,
	streamAsset,
	threadOpts,
	debugLog = () => {}
) => {
	if (screenshots.length > 0) {
		console.log('Uploading screenshots...')

		await Promise.all(
			screenshots.map(async (screenshot) => {
				debugLog(`Uploading ${screenshot}`)

				await slack.files.uploadV2({
					filename: screenshot,
					file: streamAsset(screenshot),
					thread_ts: threadOpts.threadId,
					channel_id: threadOpts.channelId
				})
			})
		).catch((e) => console.log(e))

		console.log('...done!')
	}
}

module.exports = attachAssetsToSlackThread
