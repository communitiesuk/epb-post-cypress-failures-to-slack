const formatFailuresAsBlocks = require('../src/format-failures-as-blocks')

test('it formats failures as expected Slack Block Kit blocks', () => {
	const failures = [
		{
			fullDescription: "Check that there aren't too many notes",
			message: 'There are too many notes',
			testFile: 'salieri_spec.js'
		},
		{
			fullDescription:
				'Check again that there is the correct quantity of notes',
			message:
				'There are, still, too many notes `and here is the exact error message in backticks`',
			testFile: 'salieri_reprise_spec.js'
		}
	]
	const messageText = 'Salieri has his 👀 on u'

	expect(formatFailuresAsBlocks(failures, messageText, 1)).toEqual([
		{
			type: 'header',
			text: {
				type: 'plain_text',
				text: 'Salieri has his 👀 on u (2 failures)'
			}
		},
		{
			type: 'context',
			elements: [
				{
					type: 'mrkdwn',
					text: '📄'
				},
				{
					type: 'mrkdwn',
					text: '*File*: *salieri_spec.js*'
				}
			]
		},
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: "*failed test*: Check that there aren't too many notes"
			}
		},
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: '*message*: `There are too many notes`'
			}
		},
		{
			type: 'divider'
		},
		{
			type: 'context',
			elements: [
				{
					type: 'mrkdwn',
					text: '📄'
				},
				{
					type: 'mrkdwn',
					text: '*File*: *salieri_reprise_spec.js*'
				}
			]
		},
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: '*failed test*: Check again that there is the correct quantity of notes'
			}
		},
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: '*message*: `There are, still, too many notes and here is the exact error message in backticks`'
			}
		},
		{
			type: 'divider'
		},
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: 'One screenshot in :thread:'
			}
		}
	])
})

test('when there are no screenshots it does not mention them or reference a thread', () => {
	const failures = [
		{
			fullDescription: "Check that there aren't too many notes",
			message: 'There are too many notes',
			testFile: 'salieri_spec.js'
		},
		{
			fullDescription:
				'Check again that there is the correct quantity of notes',
			message:
				'There are, still, too many notes `and here is the exact error message`',
			testFile: 'salieri_reprise_spec.js'
		}
	]
	const messageText = 'Salieri has his 👀 on u'

	expect(formatFailuresAsBlocks(failures, messageText, 0, 0)).toEqual([
		{
			type: 'header',
			text: {
				type: 'plain_text',
				text: 'Salieri has his 👀 on u (2 failures)'
			}
		},
		{
			type: 'context',
			elements: [
				{
					type: 'mrkdwn',
					text: '📄'
				},
				{
					type: 'mrkdwn',
					text: '*File*: *salieri_spec.js*'
				}
			]
		},
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: "*failed test*: Check that there aren't too many notes"
			}
		},
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: '*message*: `There are too many notes`'
			}
		},
		{
			type: 'divider'
		},
		{
			type: 'context',
			elements: [
				{
					type: 'mrkdwn',
					text: '📄'
				},
				{
					type: 'mrkdwn',
					text: '*File*: *salieri_reprise_spec.js*'
				}
			]
		},
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: '*failed test*: Check again that there is the correct quantity of notes'
			}
		},
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: '*message*: `There are, still, too many notes and here is the exact error message`'
			}
		}
	])
})
