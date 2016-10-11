var Seneca = require('seneca'),
    Service = Seneca({tag: 'hex'});

Service.use('../logic/hex');

Service.use('../..', {
    pin: 'role:color,format:hex'
});

Service.ready(function (error) {
    if (error) {
        console.error(error);
        this.close();
        process.exit(1);
    }

    var seneca = this;
    console.log('hex', seneca.id)
});