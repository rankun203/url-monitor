#!/usr/bin/env node

var request = require('request');
var Email = require('email').Email;

//var url = 'http://wb.zk789.cn/';
var url = 'http://www.baidu.com';
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
    },{
        url: 'http://www.233.com/zikao/baoming/',
        action: actions.copy,
        search: /.*/
    }
];
//'http://wb.zk789.cn/',
//    'http://www.51test.net/zikao/sichuan/baoming/',
//    'http://www.51test.net/zikao/sichuan/siyue/',
//    'http://www.233.com/zikao/baoming/'
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

request(url, function (error, response, body) {
    if(error) throw error;
    if(response.statusCode == 200) {
        console.log('Success');
        sendMail("Website accessible!!", body);
    } else if(response.statusCode == 404) {
        console.log('Not found');
    }
});
