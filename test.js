const {createCanvas} = require('canvas');
const jsbarcode = require('jsbarcode');
const qrCode = require('./libs/index.js');

le.createCode = function le_createCode(config){
    // 输出文件类型
    let fileType = config.fileType && config.fileType.toLowerCase();
    config.fileName || (config.fileName = Date.now());

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
        const myQrCode = qrCode(config.data,{
            typeNumber:  config.mode ? 6 : -1
        })
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

    const code = document.getElementById('code');
    const item = document.createElement('div');
    item.setAttribute('class','item');
    const title = document.createElement('div');
    const fileName = `${config.fileName}.${config.fileType}`
    title.innerText = fileName;
    item.appendChild(canvas);
    item.appendChild(title);
    code.appendChild(item);
// base64
    let base64 = '';
    switch (fileType) {
        case 'jpeg':
            base64 = canvas.toDataURL('image/jpeg');
            break;
        case 'pdf':
            // canvas.toBuffer();
            // stream = canvas.createPDFStream();
            break;
        case 'svg':
            // buffer = canvas.toBuffer();
            break;
        default:
            fileType = 'png';
            base64 = canvas.toDataURL('image/png');
            break;
    }
    return {base64,fileName};
}
