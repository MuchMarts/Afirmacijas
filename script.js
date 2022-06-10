
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
    var link = document.createElement('a');
    link.download = 'afirmacija.png';
    link.href = canvas.toDataURL();
    link.click();
}

function showYourself(a){
    document.getElementsByClassName("banana")[a-1].classList.toggle("hidden");
}

function changeType(a){
    document.getElementById(a).classList.toggle("bigBoi");
}

function handleFiles(){
    var userFile = document.getElementById("userFile");
    var place = document.getElementById ("text");
    console.log(userFile.files.length);
    if(!userFile.files.length){
        place.innerHTML = "Nav failu...:(";   
    } else if(userFile.files.length > 1){
        place.innerHTML = "Izvēlies vienu failu pls...:(";   
    } else {
       add_img(URL.createObjectURL(userFile.files[0]));
    }
}
