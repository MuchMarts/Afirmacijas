const width = window.innerWidth;
const height = window.innerHeight;
var canw = 0; var canh = 0;
const reslq = 100;
const resmq = 1000;
const reshq = 4200;

var canvas = document.getElementById("viewport");
context = canvas.getContext('2d');

function ConstAfirmacija() {
    this.imgURL = "notSet";
    this.text = "notSet";
    this.textCol = "notSet";
    this.borderCol = "notSet";
}

if(width > 1050 && height > 1050){
    canw = 1000; canh = 1000;
} else if (width > height){
    canw = height - 50; canh = height - 50;
} else {
    canw = width - 50; canh = width - 50;
}
canvas.setAttribute("width", canw);
canvas.setAttribute("height", canh);
const igors = new ConstAfirmacija();
    
function createCanvas(size){
    var new_canvas = document.createElement('canvas');
    new_canvas.id = "finalCopy";
    new_canvas.width = size;
    new_canvas.height = size;
    var body = document.getElementById('finished');
    body.appendChild(new_canvas);
}

function dwnImg(size){
    createCanvas(size);
    var bob = document.getElementById("finalCopy");
    f_add_img(igors.imgURL, size, bob);
}

function saveHQ(){
    dwnImg(reshq);
}
function saveMQ(){
    dwnImg(resmq);
}
function saveLQ(){
    dwnImg(reslq);
}

function f_add_img(src, size, bob) {
    img = new Image();
    new_context = bob.getContext('2d');
    img.src = src;
    img.onload = function(){
    new_context.drawImage(img,0,0,size,size);
    save_canvas(bob);
    document.getElementById('finished').removeChild(bob);
    }
}

function add_img(src) {
    img = new Image();
    img.src = src;
    img.onload = function(){
    context.drawImage(img,0,0,canw,canh);
    }
}
function save_canvas(canva) {
    var link = document.createElement('a');
    link.download = 'afirmacija.png';
    link.href = canva.toDataURL();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function test_save(){
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
        console.log(tempUrl);
        igors.imgURL = tempUrl;
        add_img(tempUrl);
    }
}
