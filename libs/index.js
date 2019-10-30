const QRCode = require('./QRCode');
const ErrorCorrectLevel = require('./ErrorCorrectLevel');
const utf16to8 = require('./utf16to8');


//main
const qrcode = function (data, opt) {
    opt = opt || {};
    const qr = new QRCode(opt.typeNumber || -1,
        opt.errorCorrectLevel || ErrorCorrectLevel.H);
    qr.addData(utf16to8(data));
    qr.make();

    return qr;
};

qrcode.ErrorCorrectLevel = ErrorCorrectLevel;


module.exports = qrcode;
