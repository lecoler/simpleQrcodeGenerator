const {createCanvas, Image} = require('canvas');
const jsbarcode = require('jsbarcode');
const qrCode = require('./libs/index.js');

// 配置文件
const config = {
    type: 'qrCode',
    icon: '',
    fgColor: 'black',
    bgColor: 'white',
    width: 250,
    height: 250,
    data: 'This is a dome!',
    fileName: '',
    fileType: 'png'
};

// 输出文件类型
let fileType = config.fileType && config.fileType.toLowerCase();


// 画板
let canvas = null;
if (fileType === 'pdf' || fileType === 'svg') {
    canvas = createCanvas(config.width, config.height, fileType);
} else {
    canvas = createCanvas(config.width, config.height);
}


// 条形码生成
if (config.type == 'barCode') {
    jsbarcode(canvas, config.data, {
        background: config.bgColor,
        lineColor: config.fgColor,
        width: config.width,
        height: config.height,
        text: undefined
    });
} else {
    const ctx = canvas.getContext('2d');
    ctx.scale(1, 1);

    // 生成二维码
    const myQrCode = qrCode(config.data);
    const cells = myQrCode.modules;
    const tileW = config.width / cells.length;
    const tileH = config.height / cells.length;
    cells.forEach((row, rdx) => {
        row.forEach((cell, cdx) => {
            ctx.fillStyle = cell ? config.fgColor : config.bgColor;
            const w = (Math.ceil((cdx + 1) * tileW) - Math.floor(cdx * tileW));
            const h = (Math.ceil((rdx + 1) * tileH) - Math.floor(rdx * tileH));
            ctx.fillRect(Math.round(cdx * tileW), Math.round(rdx * tileH), w, h);
        });
    });
    // 插入icon图片
    if (config.icon) {
        const icon = new Image();
        icon.onload = () => {
            const icon_width = Math.floor(canvas.width / 4);
            const icon_height = Math.floor(canvas.height / 4);
            const dx = canvas.width / 2 - icon_width / 2;
            const dy = canvas.height / 2 - icon_height / 2;
            ctx.drawImage(icon, dx, dy, icon_width, icon_height);
        };
        icon.src = config.icon;
    }
}

// base64
// console.log(canvas.toDataURL('image/png'));


