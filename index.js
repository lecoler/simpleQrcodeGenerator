const {createCanvas, Image} = require('canvas');
const jsbarcode = require('jsbarcode');
const fs = require('fs');
const path = require('path');
const qrCode = require('./libs/index.js');
// 配置文件
const config = require('./config.json');
// 输出目录
const outDir = path.resolve(__dirname, './outFiles');
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

// 判断输出目录是否存在
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
}

// 输出 流/buffer
let stream = null;
let buffer = null;
switch (fileType) {
    case 'jpeg':
        stream = canvas.createJPEGStream();
        break;
    case 'pdf':
        canvas.toBuffer();
        stream = canvas.createPDFStream();
        break;
    case 'svg':
        buffer = canvas.toBuffer();
        break;
    default:
        fileType = 'png';
        stream = canvas.createPNGStream();
        break;
}

// 完成输出文件
const filePath = path.resolve(outDir, `./${config.fileName || Date.now()}.${fileType}`);
if (stream) {
    const out = fs.createWriteStream(filePath);
    stream.pipe(out);
    out.on('finish', () => console.log(`The ${config.fileName || Date.now()}.${fileType} file was created.`));
} else if (buffer) {
    fs.writeFileSync(filePath, buffer);
    console.log(`The ${config.fileName || Date.now()}.${fileType} file was created.`);
}


