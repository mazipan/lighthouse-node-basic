const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

const TEST_URL = 'https://m.tokopedia.com/';

function launchChromeAndRunLighthouse(url, opts, config = null) {
	return chromeLauncher.launch({ chromeFlags: opts.chromeFlags }).then(chrome => {
		opts.port = chrome.port;
		return lighthouse(url, opts, config).then(results => {
			const date = new Date().toISOString();
			const p = path.resolve(`./reports/report-${date}.json`);
			console.log('Report created on', p);
			fs.writeFile(p, results.report, () => { });
			// use results.lhr for the JS-consumable output
			// https://github.com/GoogleChrome/lighthouse/blob/master/types/lhr.d.ts
			// use results.report for the HTML/JSON/CSV output as a string
			// use results.artifacts for the trace/screenshots/other specific case you need (rarer)
			return chrome.kill().then(() => results.lhr)
		});
	});
}

const opts = {
	quiet: true,
	headless: true,
	disableStorageReset: true,
	emulatedFormFactor: 'mobile',
	onlyCategories: ['performance'],
	blockedUrlPatterns: '*.googletagmanager',
	chromeFlags: ['--show-paint-rects', '--headless']
};

// Usage:
launchChromeAndRunLighthouse(TEST_URL, opts).then(results => {
	// Use results!
});
