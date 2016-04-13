var app = require('koa')();
var Router = require('koa-router');
var request = require('axios');


var router = new Router();

var users = {
    'user0': {
        couchbaseId: 'user0',
        password: '123456'
    }
}

app.use(function* (next) {
    try {
        yield next;
    } catch (e) {
        console.error(e);
        console.error(e.stack);
        this.status = 500;
    }
})
app.use(require('koa-body')());


router.post('/', function* (next) {
    var body = this.request.body;
    var username = body.username.toLowerCase();
    console.log(username);
    console.log(' -- login  ', body);
    this.body = '';
    this.status = 401;
    var user = users[username];
    if (user && user.password === body.password) {
        this.status = 200;
        try {
            yield request.post('http://localhost:4985/chat/_user/', {name: username});
            yield request.post('http://localhost:4985/user/_user/', {name: username});
        } catch (e) {
            if (e.status !== 409) throw e;
        }
        var res = {};
        res.chat = yield request.post('http://localhost:4985/chat/_session', {name: username});
        res.user = yield request.post('http://localhost:4985/user/_session', {name: username});
        res.chat = res.chat.data;
        res.user = res.user.data;
        this.body = res;
    }
    yield next;
});

router.put('/', function* (next) {
    var body = this.request.body;
    console.log(' -- change password', body);
    this.body = '';
    this.status = 401;
    var user = users[body.username];
    if (user && user.password === body.password) {
        users[body.username].password = body.newPassword;
        this.status = 200;
    }
    yield next;
});

app.use(router.routes());
app.listen(3000);