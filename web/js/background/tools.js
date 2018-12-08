const myIpServerUrl = ['https://ipinfo.io/ip', 'https://icanhazip.com/', 'http://ipecho.net/plain', 'https://www.trackip.net/ip'];
const doJqueryUrl = (url, CallBack) => {
    return $.ajax({
        url: url
    }).done(data => {
        return CallBack(null, data);
    }).fail(() => {
        return CallBack('may not arrived');
    });
};
const myIpServer = (CallBack) => {
    let ret = false;
    async.each(myIpServerUrl, (n, next) => {
        return doJqueryUrl(n, (err, data) => {
            if (err || !/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(data)) {
                return next();
            }
            if (!ret) {
                ret = true;
                return CallBack(null, data);
            }
        });
    }, () => {
        if (!ret) {
            return CallBack(new Error('no network'));
        }
    });
};
const checkIMAPaccount = (imapData, CallBack) => {
    let y = imapData;
    let u = CallBack;
    return CallBack();
};
