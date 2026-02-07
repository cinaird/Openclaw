const fs = require('fs');
try {
    const content = fs.readFileSync('test_output.txt', 'utf16le'); // Try UTF-16LE first
    console.log(content);
} catch (e) {
    console.log('Error reading file:', e);
    try {
        const content = fs.readFileSync('test_output.txt', 'utf8');
        console.log(content);
    } catch (e2) {
        console.log('Error reading as utf8:', e2);
    }
}
