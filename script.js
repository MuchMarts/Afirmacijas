var canvas = document.getElementById('viewport');
context = canvas.getContext('2d');

console.log(canvas);


function add_img(src) {
    img = new Image();
    img.src = src;
    img.onload = function(){
        context.drawImage(img,0,0,1000,1000)
    }
}

add_img('a1.png')