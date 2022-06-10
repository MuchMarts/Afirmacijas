
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

const userFile = document.getElementById("userFile");
var place = document.getElementById ("text");

function display(){
    place.innerHTML = userFile.files[0].name + ": " + userFile.files[0].size + " biti woow";
}

function handleFiles(){
    console.log(userFile.files.length);
    if(!userFile.files.length){
        place.innerHTML = "Nav failu...:(";   
    } else if(userFile.files.length > 1){
        place.innerHTML = "Izvēlies vienu failu pls...:(";   
    } else {
        place.innerHTML = userFile.files[0].name + ": " + userFile.files[0].size + " biti";
        add_img(URL.createObjectURL(userFile.files[0]));
    }
}
