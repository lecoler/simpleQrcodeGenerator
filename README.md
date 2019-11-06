# Simple QR code generator

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
  "icon": "./static/test.jpg",    //centre icon
  "fgColor": "black",             //qr code color
  "bgColor": "white",             //qr code background color
  "width": 250,                   //qr code width
  "height": 250,                  //qr code height
  "data": "This is a dome!",      //Scan code information
  "fileName": "",                 //saved file name
  "fileType": "png"               //saved file type, defaults png, support 'png' 'jpeg' 'pdf' 'svg'
}
```

##### Tip: The output file defaults to the `outFiles` directory.

