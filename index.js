#!/usr/bin/env node

// watch -n86400 ./index.js

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
var to = 'rankun203@gmail.com';

function sendMail(subject, body) {
    var myMsg = new Email({
        from: from,
        to: to,
        subject: subject,
        body: body
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

            switch (_url.action) {
                case actions.statusCode:
                    console.log("Check statusCode " + _url.expect + " from " + _url.url);
                    if(response.statusCode == 200) {
                        console.log('Success');
                        sendMail("Website " + _url.url + " is 200!!", body);
                    } else if(response.statusCode == 404) {
                        console.log('Not found');
                        sendMail(_url + "Not Found", body)
                    }
                    break;
                case actions.grep:
                    console.log("Grep " + _url.expect + " from " + _url.url);
                    var _tmpHtml = body.match(_url.expect);
                    if(_tmpHtml != null) sendMail(_url.url + " Found ", _tmpHtml + ": Found :\n" + _url.url);
                    else if (_tmpHtml == null) sendMail(_url.url + " Not Found ", _tmpHtml + ": Not Found :\n" + _url.url);
                    break;
            }
        });
    }
}

console.log("------------------------" + new Date());
check();
