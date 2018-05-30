const express = require('express');
const request = require('request');
const querystring = require('query-string');
const bodyParser = require('body-parser');
const urllib = require('url'); 
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());


app.post('/', function (req, res) {
    var uri = req.body.link;
  
    var q = urllib.parse(uri);
  
    var id = querystring.parse(q.query)['id'];
    var hl = querystring.parse(q.query)['hl'];
    var lpg = 'PP1';
    var dq = querystring.parse(q.query)['dq'];
    var pg = 'PP1';
    var jscmd = 'click3';
    var options = {
        uri: 'https://books.google.it/books?id=' + id + '&lpg=' + lpg + '&dq=' + dq + '&pg=' + pg + '&jscmd=' + jscmd + '&vq=' + dq + '',
        json: true,
        referer: 'https://books.google.it/books?id=' + id + '&printsec=frontcover&dq=' + dq.replace(' ', '+') + '&hl=' + hl + '',
        headers: {'Cookie': 'NID=131=uKwfWAAqgbgUmcXBJvNSUKKPwF4rYEPnNRpPxI0qyOHZauXdL6kj7T3ur_x2Ad5pL0w-H8WK3IVDsprxr0X-m3omOnlphqjimZJeGWZOYADzC0Jkc2RmPw6xfxbo2HkXEFZO2DDQh_Fqxd2Z-cxlAVJav8d6IbVy6WQMcflWl9-EWmCbw8Ak7cWKX4dDyeQ4X5BRvDpI2kSJ5rUR-D1p8NwUJ9eLSQk0G7ew1kCAdnMp1X56niY'}
    };


    var pid = [];
    var url = [];
    var undo = 0;

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          
            //console.log(body);

            // Estae la lista di pid
            for (var i = 0; i < body['page'].length - 1; i++) 
                pid = pid.concat(body['page'][i]['pid']);
            
            get_pidn(pid);

        }

    });


    function get_pidn(a) {

        var pidn = '' + a.length;

        for (var y = 0; y < pidn; y++) {
            console.log(id + ' ' + lpg + ' ' + dq + ' ' + pid[y] + ' ' + jscmd + ' ' + dq)
            // crea una nuova richiesta
            var options2 = {
                uri: 'https://books.google.it/books?id=' + id + '&lpg=' + lpg + '&dq=' + dq + '&pg=' + pid[y] + '&jscmd=' + jscmd + '&vq=' + dq + '',
                json: true,
                referer: 'https://books.google.it/books?id=' + id + '&printsec=frontcover&dq=' + dq.replace(' ', '+') + '&hl=' + hl + '',
                headers: {'Cookie': 'NID=131=uKwfWAAqgbgUmcXBJvNSUKKPwF4rYEPnNRpPxI0qyOHZauXdL6kj7T3ur_x2Ad5pL0w-H8WK3IVDsprxr0X-m3omOnlphqjimZJeGWZOYADzC0Jkc2RmPw6xfxbo2HkXEFZO2DDQh_Fqxd2Z-cxlAVJav8d6IbVy6WQMcflWl9-EWmCbw8Ak7cWKX4dDyeQ4X5BRvDpI2kSJ5rUR-D1p8NwUJ9eLSQk0G7ew1kCAdnMp1X56niY'}
            };

            request(options2, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    get_url(body['page'][0]['src'], y);

                }

            });
        }

    }


    function get_url(a, b) {

        if (a != undefined)
            url = url.concat('"'+a+'"' );
        else
            undo = undo + 1

        print_json(url, b - undo);

    }

    function print_json(c, d) {
        if (c.length == d)
            res.send('{ "list": [{ "title" : [ "' + dq + '" ] , "pages": [' + c + '] }]}');

    }
});

exports = module.exports = app;
const server = app.listen(process.env.PORT || 3000, function () {})
