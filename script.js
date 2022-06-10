
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

function showYourself(a){
    document.getElementsByClassName("banana")[a-1].classList.toggle("hidden");
}

function changeType(a){
    document.getElementById(a).classList.toggle("bigBoi");
}

const randomColor = "#"+((1<<24)*Math.random()|0).toString(16); 
document.documentElement.style.setProperty('--main-bg-color', randomColor);

function handleFiles(){
    var userFile = document.getElementById("userFile");
    var place = document.getElementById ("text");
    console.log(userFile.files.length);
    if(!userFile.files.length){
        place.innerHTML = "Nav failu...:(";   
    } else if(userFile.files.length > 1){
        place.innerHTML = "Izvēlies vienu failu pls...:(";   
    } else {
       const img = document.createElement("img");
       img.src = URL.createObjectURL(userFile.files[0]);
       img.height = 500;
       place.innerHTML = " ";
       place.appendChild(img);
    }
}
add_img('a69.png')
