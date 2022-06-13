
//  Properties
const width = window.innerWidth;
const height = window.innerHeight;

var canw = 0; var canh = 0;

function ConstAfirmacija() {
    //Storage
    this.imgURL = "notSet";
    this.text = "notSet";
    this.textCol = "notSet";
    this.borderCol = "notSet";
}  

function mergeCanvas(pictureID, overlayID){
    var picture = document.getElementById(pictureID);
    var overlay = document.getElementById(overlayID);

    var pctx = picture.getContext("2d");
    pctx.drawImage(overlay, 0, 0, canw, canh);
}

function downloadCanvas(size){
    mergeCanvas("viewport", "border");
    var new_canvas = document.createElement("canvas");
    new_canvas.id = "finalCopy";
    new_canvas.width = size;
    new_canvas.height = size;
    var body = document.getElementById('finished');
    //body.appendChild(new_canvas);

    let nwctx = new_canvas.getContext("2d");
    nwctx.drawImage(canvas, 0, 0, size, size);

    let canvasUrl = new_canvas.toDataURL();
    const temp = document.createElement("a");
    temp.href = canvasUrl;
    temp.download = "afirmacija";
    temp.click();
    temp.remove;

}

/*    
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
    bob.classList.add('sneaky')
    f_add_img(igors.imgURL, size, bob);
}
*/
function saveHQ(){
    downloadCanvas(reshq);
}

function saveMQ(){
    downloadCanvas(resmq);
}
function saveLQ(){
    downloadCanvas(reslq);
}
/*
function f_add_img(canvas, size, bob) {
    img = new Image();
    new_context = bob.getContext('2d');
    img.src = src;
    //img.onload = function(){
        new_context.drawImage(img,0,0,size,size);
        save_canvas(bob);
        document.getElementById('finished').removeChild(bob);
    //}
}
*/
function add_img(src) {
    img = new Image();
    img.src = src;
    img.onload = function(){
        context.drawImage(img,0,0,canw,canh);
    }
}
/*
function save_canvas(canva) {
    var link = document.createElement('a');
    link.download = 'afirmacija.png';
    link.href = canva.toDataURL();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
*/
}

const igors = new ConstAfirmacija();

const canvas = document.getElementById("viewport");
context = canvas.getContext('2d');

//Diferent workspace size for diferent device
if(width>1050 && height>1050){canw = 1000; canh = 1000;
} else {
    if(width>height){canw = height - 50; canh = height - 50;}
    if(width<height){canw = width - 50; canh = width - 50;}
}

canvas.setAttribute("width", canw);
canvas.setAttribute("height", canh);

//Creates new canva element with export resolution
function save_finished_canvas(size){
    var new_canvas = document.createElement('canvas');
    new_canvas.id = "finalCopy";
    new_canvas.width = size;
    new_canvas.height = size;
    var body = document.getElementById('finished');
    body.appendChild(new_canvas);
    new_canvas.classList.add('sneaky');
    add_image_canva(size, new_canvas, true);
}

//Adds image to canva
function add_image_canva(size, canvaElem, final) {
    img = new Image();
    img.src = igors.imgURL;
    ctx = canvaElem.getContext("2d");
    img.onload = function() {
        ctx.drawImage(img, 0, 0, size, size);
        if(final){
            //If export then saves and deletes the element from html
            save_canvas(canvaElem);
            document.getElementById('finished').removeChild(canvaElem);
        }

    }
}
//Downloads image and removes clutter
function save_canvas(canva) {
    var link = document.createElement('a');
    link.download = 'afirmacija.png';
    link.href = canva.toDataURL();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

//Show/Hide smth
function showYourself(a){
    document.getElementsByClassName("banana")[a-1].classList.toggle("hidden");
}

//Strecth smth
function changeType(a){
    document.getElementById(a).classList.toggle("bigBoi");
}

//Handle image upload
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
        igors.imgURL = tempUrl;
        add_image_canva(canw, canvas, false);
        //add_img(tempUrl);
    }
}

//Used to save image
function saveFile(exportSize){
    save_finished_canvas(exportSize);


function convertHex(hexCode, opacity = 1){ //stolen code src="https://gist.github.com/danieliser/b4b24c9f772066bcf0a6.js"
    var hex = hexCode.replace('#', '');

    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    var r = parseInt(hex.substring(0,2), 16),
        g = parseInt(hex.substring(2,4), 16),
        b = parseInt(hex.substring(4,6), 16);

    /* Backward compatibility for whole number based opacity values. */
    if (opacity > 1 && opacity <= 100) {
        opacity = opacity / 100;   
    }
    var rgba = [r, g, b, opacity];
    return rgba;
}

const brdwd = canw/30;
var borderlayer = document.getElementById("border");
borderlayer.setAttribute("width", canw);
borderlayer.setAttribute("height", canh);
var ctxb = borderlayer.getContext("2d");
var color = document.getElementById("colorpicker").value;
document.getElementById("colorpicker").addEventListener("change", function(){
    color = this.value;
    igors.borderCol = color;
    setBorder();
});

function setBorder(){  
    ctxb.fillStyle = setGradient(0, 0, 0, brdwd, color);
    ctxb.fillRect(0, 0, canw, brdwd); //top

    ctxb.fillStyle = setGradient(0, 0, brdwd, 0, color);
    ctxb.fillRect(0, 0, brdwd, canh); //left

    ctxb.fillStyle = setGradient(0, canh, 0, canh-brdwd, color);
    ctxb.fillRect(0, canh-brdwd, canw, brdwd); //bottom

    ctxb.fillStyle = setGradient(canw, 0, canw-brdwd, 0, color);
    ctxb.fillRect(canw-brdwd, 0, brdwd, canh); //right
}

function setGradient(x, y, x1, y1, color){
    var rgba = convertHex(color, 1);
    var r = rgba[0], g = rgba[1], b = rgba[2];
    var gradient = ctxb.createLinearGradient(x, y, x1, y1);
    gradient.addColorStop(0, `rgba(${r},${g},${b},1)`);
    //gradient.addColorStop(0.35, `rgba(${r},${g},${b},.95)`);
    gradient.addColorStop(0.7, `rgba(${r},${g},${b},.2)`);
    gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
    return gradient;
}