var express = require('express');
var superagent = require('superagent');
var cheerio = require('cheerio');

var app = express();

app.get('/', function (req, res, next) {
    superagent.get('https://cnodejs.org')
        .end(function (err, res) {
             if (err) {
                 return next(err);
             }

             var $ = cheerio.load(res.text);
             var items0 = [];
             var items1 = [];
             $('#topic_list .topic_title').each(function (idx, element) {
                 var $element = $(element);
                 items0.push({
                     title: $element.attr('title'),
                     href: $element.attr('href')
                 });
             });

            $('#topic_list .user_avatar img').each(function (idx, element) {
                var $element = $(element);
                items1.push({
                    author: $element.attr('title'),
                });
            });

            var items = [];

            items0.map((v, k) => {
                items.push({
                    title: v.title,
                    href: v.href,
                    author: items1[k].author
                })
            });

             res.send(items);
        })
});

app.listen(3000, function (req, res) {
    console.log('app is running at port 3000');
});