var quotemeta = require('quotemeta');

module.exports = function(client) {
    var is_for_me,
        my_nick;

    function create_is_for_me() {
        my_nick = client.nick;
        is_for_me = new RegExp('^'+quotemeta(client.nick)+'[ :]\s?(.*)$');
        console.log('updated is_for_me', is_for_me);
    }

    client.on('registered', function() {
        create_is_for_me();
    });

    client.on('nick', function(oldnick, newnick) {
        if( oldnick == my_nick ) {
            create_is_for_me();
        }
    });

    client.on('message#', function(from, to, message) {
        var m = is_for_me.exec(message);
        if( m ) {
            client.emit('raw_command', from, to, m[1].trim());
        }
    });

    client.on('pm', function(from, text, message) {
        client.emit('raw_command', from, text.trim());
    });
};
