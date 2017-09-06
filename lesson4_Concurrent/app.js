var express = require('express');
var superagent = require('superagent');
var cheerio = require('cheerio');
var eventproxy = require('eventproxy');

var url = require('url');

var cnodeUrl = 'https://cnodejs.org/';

superagent.get(cnodeUrl)
    .end(function (err, res) {
        if (err) {
            return console.error(err);
        }
        var topicUrls = [];
        var $ = cheerio.load(res.text);

        $('#topic_list .topic_title').each(function (idx, element) {
            var $element = $(element);

            var href = url.resolve(cnodeUrl, $element.attr('href'));
            topicUrls.push(href);
        });

        var ep = new eventproxy();

        ep.after('topic_html', topicUrls.length, function (topics) {

            topics = topics.map(function (topicPair) {
                var topicUrl = topicPair[0];
                var topicHtml = topicPair[1];
                var $ = cheerio.load(topicHtml);
                var commenterTailUrl =  $('.user_info .reply_author').eq(0).attr('href');
                // var commenterTailUrl =  undefined;
                // console.log('commenterTailUrl', commenterTailUrl)
                var commenterUrl = '';
                if ( commenterTailUrl ) {
                    commenterUrl = url.resolve(cnodeUrl, commenterTailUrl);
                    superagent.get(commenterUrl)
                        .end(function (err, res) {
                            if (err) {
                                return console.error(err);
                            }
                            var commenter = cheerio.load(res.text);

                            return ({
                                title: $('.topic_full_title').text().trim(),
                                href: topicUrl,
                                comment1: $('.reply_content').eq(0).text().trim(),
                                author: $('.author_content .reply_author').eq(0).text().trim(),
                                score: commenter('.user_profile span').eq(0).text().trim()
                            });
                        })
                } else {
                    return ({
                        title: $('.topic_full_title').text().trim(),
                        href: topicUrl,
                        comment1: $('.reply_content').eq(0).text().trim(),
                        author: $('.author_content .reply_author').eq(0).text().trim(),
                        score: ''
                    })
                }
            });
            // console.log('final:');
            console.log(topics);
        });

        topicUrls.forEach(function (topicUrl) {
            superagent.get(topicUrl)
                .end(function (err, res) {
                    // console.log('fetch' + topicUrl + 'successful');
                    ep.emit('topic_html', [topicUrl, res.text]);
                });
        });
    });