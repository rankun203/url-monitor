#!/usr/bin/env node

// watch -n8640 ./index.js

var request = require('request');
var Email = require('email').Email;

var actions = {
    statusCode: 'statusCode',
    grep: 'grep'
};
var urls = [
    {
        url: 'http://wb.zk789.cn/',
        action: actions.statusCode,
        expect: 200
    },{
        url: 'http://www.51test.net/zikao/sichuan/baoming/',
        action: actions.grep,
        expect: /2015年4月四川.*报名时间/
    },{
        url: 'http://www.51test.net/zikao/sichuan/siyue/',
        action: actions.grep,
        expect: /2015年4月四川.*报名时间/
    }
];
var from = 'rankun203@gmail.com';
var to = 'rankun203@icloud.com';

function sendMail(subject, body) {
    var myMsg = new Email({
        from: from,
        to: to,
        subject: subject,
        body: body,
        bodyType: 'html'
    });
    myMsg.send(function(err) {
        console.error("ERROR: " + err);
    });
}

function check() {
    var _sub = 0;
    for(var i=0; i<urls.length; i++) {
        var _url = urls[i];

        request({
            uri:_url.url,
            timeout: 5000
        }, function (error, response, body) {
            if(error) throw error;
            var _url = urls[_sub];
            _sub++;

            var notFound = false;
            switch (_url.action) {
                case actions.statusCode:
                    console.log("Check statusCode " + _url.expect + " from " + _url.url);
                    if(response.statusCode == 200) {
                        console.log('Success');
                        sendMail("Website accessible!!", body);
                    } else if(response.statusCode == 404) {
                        console.log('Not found');
                        notFound = true;
                    } else notFound = true;
                    break;
                case actions.grep:
                    console.log("Grep " + _url.expect + " from " + _url.url);
                    var _tmpHtml = body.match(_url.expect);
                    if(_tmpHtml == null) sendMail(_url.url + "找到了", _tmpHtml + ":\n" + _url.url);
                    else notFound = true;
                    break;
            }
            if(notFound) sendMail("什么都没有找到", JSON.stringify(urls));
        });
    }
}

console.log("------------------------" + new Date());
check();
