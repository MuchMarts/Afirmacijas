
var canvas = document.getElementById('viewport');
context = canvas.getContext('2d');

console.log(canvas);


function add_img(src) {
    img = new Image();
    img.src = src;
    img.onload = function(){
    img.crossOrigin = false;
    context.drawImage(img,0,0,1000,1000);
    }
}
function save_canvas() {

    ReImg.fromCanvas(document.querySelector('canvas')).downloadPng();
}

add_img('a69.png')
