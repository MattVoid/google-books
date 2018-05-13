const express = require('express');
const app = express();
const request = require('request');

var id = "hOsBuh2OXLQC";
var lpg = "PP1";
var dq = "cardiovascular system";
var pg = "PR3";
var jscmd = "click3";

app.get('/', function (req, res) {

    var options = {
        uri: 'https://books.google.it/books?id=' + id + '&lpg=' + lpg + '&dq=' + dq + '&pg=' + pg + '&jscmd=' + jscmd + '&vq=' + dq + '',
        json: true,
        referer: 'https://books.google.it/books?id=' + id + '&printsec=frontcover&dq=' + dq.replace(' ', '+') + 'hl=it&sa=X&ved=0ahUKEwj0z-n-iN3aAhXBWhQKHfXDCVEQ6AEIKDAA'
    };


    var pid = [];
    var url = [];
    var undo = 0;

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            // Estae la lista di pid
            for (var i = 0; i < body['page'].length - 1; i++)
                pid = pid.concat(body['page'][i]['pid']);

            get_pidn(pid);

        }

    });


    function get_pidn(a) {

        var pidn = '' + a.length;

        for (var y = 0; y < pidn; y++) {

            // crea una nuova richiesta
            var options = {
                uri: 'https://books.google.it/books?id=' + id + '&lpg=' + lpg + '&dq=' + dq + '&pg=' + pid[y] + '&jscmd=' + jscmd + '&vq=' + dq + '',
                json: true,
                referer: 'https://books.google.it/books?id=' + id + '&printsec=frontcover&dq=' + dq.replace(' ', '+') + 'hl=it&sa=X&ved=0ahUKEwj0z-n-iN3aAhXBWhQKHfXDCVEQ6AEIKDAA'
            };

            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    get_url(body['page'][0]['src'], y);

                }

            });
        }

    }


    function get_url(a, b) {

        if (a != undefined)
            url = url.concat('"' + a + '"');
        else
            undo = undo + 1

        print_json(url, b - undo);

    }

    function print_json(c, d) {
        if (c.length == d)
            res.send('{ "list": [{ "pages": [' + c + ']}]}');

    }
});


exports = module.exports = app;
const server = app.listen(process.env.PORT || 3000, function () {})