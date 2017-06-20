var FileReader = require('filereader');
var fs = require('fs');

// var fr = new FileReader();
// fr.onload = function(result) {
//     console.log(result);
// };
// var file = fs.readFileSync('testblob.blob', 'hex');

// console.log(file)

// file.match(/.{2}/g).reverse().join("")
//
// var buf = Buffer.from(file.match(/.{2}/g).reverse().join(""), "hex")
//
// console.log(buf)

// fr.readAsArrayBuffer(file.data);

fs.readFile('./testblob.blob', function(err, data)
{
    if (err) throw err;
    terrainData = new Uint16Array(toArrayBuffer(data));
    console.log(terrainData.buffer)
});

function toArrayBuffer(buffer) {
    var ab = new ArrayBuffer(buffer.length - 1);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length - 1; ++i) {
        view[i] = buffer[i];
    }
    return ab;
}