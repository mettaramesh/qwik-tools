// Test what the server is actually serving
const https = require('http');

function testUrl(url, description) {
    return new Promise((resolve, reject) => {
        console.log(`\n🔍 Testing: ${description}`);
        console.log(`URL: ${url}`);
        
        const req = https.get(url, (res) => {
            console.log(`Status: ${res.statusCode} ${res.statusMessage}`);
            console.log(`Headers:`, res.headers);
            
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log(`✅ Response length: ${data.length} chars`);
                    if (data.includes('1758164614013')) {
                        console.log('✅ NEW TIMESTAMPED FILES DETECTED!');
                    } else if (data.includes('BW8PyJVZ') || data.includes('SU3NHoYx')) {
                        console.log('❌ OLD CACHED FILES DETECTED!');
                    }
                } else {
                    console.log(`❌ Error: ${res.statusCode}`);
                }
                resolve(data);
            });
        });
        
        req.on('error', (err) => {
            console.log(`❌ Request failed: ${err.message}`);
            reject(err);
        });
        
        req.setTimeout(5000, () => {
            console.log('❌ Request timed out');
            req.destroy();
            reject(new Error('Timeout'));
        });
    });
}

async function runTests() {
    console.log('🚀 Server Response Test');
    console.log('========================');
    
    try {
        await testUrl('http://localhost:4173/', 'Main page');
        await testUrl('http://localhost:4173/textComparer.html', 'TextComparer HTML');
        await testUrl('http://localhost:4173/assets/textComparer-1758164614013-CqnBPtyR.js', 'New TextComparer JS');
        await testUrl('http://localhost:4173/assets/index-1758164614013-DBp77pRA.js', 'New Index JS');
        
        // Test for old files (should 404)
        await testUrl('http://localhost:4173/assets/textComparer-BW8PyJVZ.js', 'Old TextComparer JS (should 404)');
        await testUrl('http://localhost:4173/assets/index-SU3NHoYx.js', 'Old Index JS (should 404)');
        
    } catch (error) {
        console.log(`❌ Test failed: ${error.message}`);
    }
    
    console.log('\n✅ Server test complete');
}

runTests();