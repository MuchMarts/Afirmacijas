
//  Properties
const width = window.innerWidth;
const height = window.innerHeight;

var canw = 0; var canh = 0;

//Storage
function ConstAfirmacija() {
    
    this.imgURL = "notSet";
    this.text = "notSet";
    this.textCol = "notSet";
    this.borderCol = "notSet";
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

// Add image on canva
function add_img(src) {
    img = new Image();
    img.src = src;
    img.onload = function(){
        context.drawImage(img,0,0,canw,canh);
    }
}

//Merge multiple canvas
function mergeCanvas(imageID, borderID, textID){
    var baseCanva = document.getElementById(imageID);
    var border = document.getElementById(borderID);

    var ctx = baseCanva.getContext("2d");
    ctx.drawImage(border, 0, 0, canw, canh);
}

//Show/Hide smth
function showYourself(a){document.getElementsByClassName("banana")[a-1].classList.toggle("hidden")}

//Strecth smth
function changeType(a){document.getElementById(a).classList.toggle("bigBoi")}

//Used to save image
function saveFile(exportSize){downloadCanvas(exportSize);}

// Creates final canva and exports it
function downloadCanvas(size){
    //Merge all layers
    mergeCanvas("viewport", "border");
    
    //Create final canva element
    var new_canvas = document.createElement("canvas");
    new_canvas.id = "finalCopy";
    new_canvas.width = size;
    new_canvas.height = size;

    let nwctx = new_canvas.getContext("2d");
    nwctx.drawImage(canvas, 0, 0, size, size);

    let canvasUrl = new_canvas.toDataURL();
    
    //Download canva
    const temp = document.createElement("a");
    temp.href = canvasUrl;
    temp.download = "afirmacija";
    temp.click();
    temp.remove;
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
        add_img(tempUrl);
    }
}

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