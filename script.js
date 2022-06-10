const width = window.innerWidth;
const height = window.innerHeight;
var canw = 0; var canh = 0;
const reslq = 100;
const resmq = 1000;
const reshq = 4200;

var canvas = document.getElementById("viewport");
context = canvas.getContext('2d');

console.log(canvas);

if(width > 1020 && height > 1020){
    canw = 1000; canh = 1000;
} else if (width > height){
    canw = height - 50; canh = height - 50;
    canvas.setAttribute("width", canw);
    canvas.setAttribute("height", canh);
} else {
    canw = width - 50; canh = width - 50;
    canvas.setAttribute("width", canw);
    canvas.setAttribute("height", canh);
}
class afirmation {
    constructor(){
        this.imgUrl;
        this.text;
        this.textCol;
        this.borderCol;
    };
    setUrl(url) {
        this.imgUrl = url;
    }

    createCanvas(size){
        var new_canvas = document.createElement('canvas');
        new_canvas.id = "finalCopy";
        new_canvas.width = size;
        new_canvas.height = size;
        var body = document.getElementById('finished');
        body.appendChild(new_canvas);
    }

    saveCanva(res){
        this.createCanvas(res);
        var bob = document.getElementById("finalCopy");
        add_img(this.imgUrl);
        save_canvas(bob);
        document.getElementById('finished').removeChild(bob);
    }
    saveHQ(){
        this.saveCanva(reshq);
    }
    saveMQ(){
        this.saveCanva(resmq);
    }
    saveLQ(){
        this.saveCanva(reslq);
    }
}

let igors = new afirmation(); 

function add_img(src) {
    img = new Image();
    img.src = src;
    img.onload = function(){
    img.crossOrigin = false;
    context.drawImage(img,0,0,canw,canh);
    }
}
function save_canvas(canva) {
    var link = document.createElement('a');
    link.download = 'afirmacija.png';
    link.href = canva.toDataURL();
    link.click();
}

function hq(){
    igors.saveHQ();
}
function mq(){
    igors.saveMQ();
}

function lq(){
    igors.saveLQ();
}

function showYourself(a){
    document.getElementsByClassName("banana")[a-1].classList.toggle("hidden");
}

function changeType(a){
    document.getElementById(a).classList.toggle("bigBoi");
}

const userFile = document.getElementById("userFile");
var place = document.getElementById ("text");

function handleFiles(){
    console.log(userFile.files.length);
    if(!userFile.files.length){
        place.innerHTML = "Nav failu...:(";   
    } else if(userFile.files.length > 1){
        place.innerHTML = "Izvēlies vienu failu pls...:(";   
    } else {
        place.innerHTML = userFile.files[0].name + ": " + userFile.files[0].size + " biti";
        tempUrl = URL.createObjectURL(userFile.files[0]);
        igors.setUrl(tempUrl);
        add_img(tempUrl);
    }
}
