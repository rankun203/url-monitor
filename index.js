#!/usr/bin/env node

var request = require('request');
var Email = require('email').Email;

var actions = {
    statusCode: 'statusCode',
    grep: 'grep',
    copy: 'copy'
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

for(var _url in urls) {
    request(_url.url, function (error, response, body) {
        if(error) throw error;

        var notFound = false;
        switch (_url.action) {
            case actions.statusCode:
                if(response.statusCode == 200) {
                    console.log('Success');
                    sendMail("Website accessible!!", body);
                } else if(response.statusCode == 404) {
                    console.log('Not found');
                    notFound = true;
                } else notFound = true;
                break;
            case actions.grep:
                var _tmpHtml = body.match(_url.expect);
                if(_tmpHtml == null) sendMail(_url.url + "找到了", _tmpHtml + ":\n" + _url.url);
                else notFound = true;
                break;
        }
        if(notFound) sendMail("什么都没有找到", JSON.stringify(urls));
    });
}

