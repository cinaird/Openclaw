const fs = require('fs');
try {
    const content = fs.readFileSync('test_output.json', 'utf8');
    const json = JSON.parse(content);

    function printTest(test) {
        test.results.forEach(result => {
            if (result.stdout && result.stdout.length) {
                console.log('--- STDOUT ---');
                result.stdout.forEach(log => process.stdout.write(log.text || log));
            }
            if (result.stderr && result.stderr.length) {
                console.log('--- STDERR ---');
                result.stderr.forEach(log => process.stdout.write(log.text || log));
            }
            if (result.errors && result.errors.length) {
                console.log('--- ERRORS ---');
                result.errors.forEach(err => console.log(err.message));
            }
        });
    }

    json.suites.forEach(suite => {
        suite.specs.forEach(spec => {
            spec.tests.forEach(test => printTest(test));
        });
        if (suite.suites) {
            suite.suites.forEach(sub => {
                sub.specs.forEach(spec => {
                    spec.tests.forEach(test => printTest(test));
                });
            });
        }
    });

} catch (e) {
    console.log('Error reading/parsing JSON:', e);
}
