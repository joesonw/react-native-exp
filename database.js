import {manager, ReactCBLite} from 'react-native-couchbase-lite';
ReactCBLite.init(5984, 'admin', 'pass', e => {
    console.log('done')
});
const database = new manager('http://admin:pass@localhost:5984/', 'chat');
export default database;