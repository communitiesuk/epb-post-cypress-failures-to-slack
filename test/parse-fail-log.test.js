const walkSync = require('walk-sync')
const { readFileSync } = require('node:fs')
const path = require('node:path')
const parseFailLog = require('../src/parse-fail-log')

test('it successfully parses fail log files into failure objects', () => {
	expect(
		parseFailLog(
			walkSync(__dirname, { globs: ['**/fixtures/failures/*.json'] }).map(
				(filePath) => readFileSync(path.resolve(__dirname, filePath))
			)
		)
	).toEqual([
		{
			fullDescription:
				'Find EPC by postcode in Welsh with a postcode for which certificates exist shows existence of those certificates on the search results page',
			message:
				"Timed out retrying after 4000ms: Expected to find content: 'Dechreuwch nawr' but never did.",
			testFile: 'find_domestic_certificate_by_postcode_spec.js'
		},
		{
			fullDescription:
				'Find domestic certificate by RRN in Welsh when search for a domestic certificate in Welsh shows the certificate with the expected header',
			message:
				"Timed out retrying after 4000ms: Expected to find content: 'Dechreuwch nawr' but never did.",
			testFile: 'find_domestic_certificate_by_rrn_spec.js'
		},
		{
			fullDescription:
				'Find non-domestic EPC by postcode (Welsh) shows the certificate with the expected header',
			message:
				"Timed out retrying after 4000ms: Expected to find content: 'Dechreuwch nawr' but never did.",
			testFile: 'find_non_domestic_certificate_by_postcode_spec.js'
		},
		{
			fullDescription:
				'Find non-domestic certificate by postcode (Welsh) shows the certificate with the expected header',
			message:
				"Timed out retrying after 4000ms: Expected to find content: 'Dechreuwch nawr' but never did.",
			testFile: 'find_non_domestic_certificate_by_rrn_spec.js'
		}
	])
})
