# Simple QR code generator

### Online experience
[Preview](https://lecoler.github.io/simpleQrcodeGenerator/)  

### install
```shell
npm install
```

### run 
```shell
npm run start
```

#### config
```
{
  "type": "qrCode",               //code type, defaults qrCode, support 'qrCode' 'barCode' 
  "icon": "./static/test.jpg",    //qrCode centre icon
  "fgColor": "black",             //code color
  "bgColor": "white",             //code background color
  "width": 250,                   //qrCode width / barCode line Width
  "height": 250,                  //qrCode height / barCode line height
  "data": "This is a dome!",      //Scan code information
  "fileName": "",                 //saved file name
  "fileType": "png"               //saved file type, defaults png, support 'png' 'jpeg' 'pdf' 'svg'
}
```

##### Tip: The output file defaults to the `outFiles` directory.

