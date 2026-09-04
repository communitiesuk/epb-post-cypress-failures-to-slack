const parseFailLog = (files) => {
	return files.map(JSON.parse).map((failure) => ({
		fullDescription: failure.testName,
		message: failure.testError
			.split('\n')
			.filter(
				(line) =>
					line.length > 0 && !line.startsWith('Because this error occurred')
			)
			.join('\n'),
		testFile: failure.specName.split('%2F').slice(1).join('/')
	}))
}

module.exports = parseFailLog
