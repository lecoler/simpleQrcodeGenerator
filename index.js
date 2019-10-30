const {createCanvas, Image} = require('canvas');
const fs = require('fs');
const path = require('path');
const qrCode = require('./libs/index.js');
const config = require('./config.json');
const outDir = path.resolve(__dirname,'./dist');

//画板
const canvas = createCanvas(config.width, config.height);
const ctx = canvas.getContext('2d');
ctx.scale(1, 1);

//生成二维码
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

//插入icon图片
const icon_width = Math.floor(canvas.width / 4);
const icon_height = Math.floor(canvas.height / 4);
const icon = new Image();
icon.onload = () => {
    const dx = canvas.width / 2 - icon_width / 2;
    const dy = canvas.height / 2 - icon_height / 2;
    ctx.drawImage(icon, dx, dy, icon_width, icon_height);
};
icon.src = config.icon;

// base64
// console.log(canvas.toDataURL('image/png'));

//判断输出目录是否存在
if (!fs.existsSync(outDir)){
    fs.mkdirSync(outDir);
}

//输出
const out = fs.createWriteStream(path.resolve(outDir , `./${config.fileName || Date.now()}.png`));
const stream = canvas.createPNGStream();
stream.pipe(out);

//完成
out.on('finish', () => console.log(`The ${config.fileName || Date.now()}.png file was created.`));