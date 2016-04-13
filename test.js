var request = require('axios');

request({
    method: 'get',
    url: 'http://localhost:4984/chat/333919b545796599581908f282f57b24',
    headers: {
        'Cookie': 'SyncGatewaySession=d94ece911651e0d3bac738b171bcc047ac3bade6' 
    },
}).then(res => {
    console.log(res.data)
}).catch(e => {
    console.log(e);
})