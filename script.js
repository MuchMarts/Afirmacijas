window.onload = init;

//  Properties
const width = window.innerWidth;
const height = window.innerHeight;

var canw = 0; var canh = 0;

//Diferent workspace size for diferent device
if(width>1050 && height>1050){canw = 1000; canh = 1000;
} else {
    if(width>height){canw = height - 50; canh = height - 50;}
    if(width<height){canw = width - 50; canh = width - 50;}
}

var imgURL = "";
var text = {  
    topTxt : "null",
    botTxt : "null",
    txtRatio: 100/canw
}
var borderCol = "null";

const canvas = document.getElementById("image");
const context = canvas.getContext('2d');
   


canvas.setAttribute("width", canw);
canvas.setAttribute("height", canh);

document.getElementById('result').style.width = canw + 'px';
document.getElementById('result').style.height = canh + 'px';
document.getElementById('interface').style.width = canw + 'px';

function init(){
    document.getElementById("toptext").value = "";
    document.getElementById("bottomtext").value = "";
    document.getElementById("myRange").value = 100;
    }

// Add image on canva
function add_img(src, canva, size) {
    var ctx = canva.getContext("2d");
    img = new Image();
    img.src = src;
    img.onload = function(){
        ctx.drawImage(img,0,0,size,size);
    }
}

//Merge multiple canvas
function mergeCanvas(imageID, borderID, textID, textBlurID, ctx, size){
    var baseCanva = document.getElementById(imageID);
    var border = document.getElementById(borderID);
    var text = document.getElementById(textID);
    var textBlur = document.getElementById(textBlurID);
    
    ctx.drawImage(baseCanva, 0, 0, size, size);
    ctx.drawImage(border, 0, 0, size, size);
    ctx.drawImage(textBlur, 0, 0, size, size);
    ctx.drawImage(text, 0, 0, size, size);
}

//Construct canva from stored data

function constructCanva(canva, size){

    var ctx = canva.getContext("2d");
    img = new Image();
    img.src = imgURL;
    img.onload = function(){
        ctx.drawImage(img,0,0,size,size);
        if(borderCol != "null"){setBorder(borderCol, ctx, size);}
        if(text.topTxt != "null" && text.txtRatio != -1){
            drawTopTxt(canva, text.topTxt, text.txtRatio);
        }
        if(text.botTxt != "null" && text.txtRatio != -1){
            drawBotTxt(canva, text.botTxt, text.txtRatio);
        }
        
        const temp = document.createElement("a");
        temp.href = canva.toDataURL();
        temp.download = "afirmacija";
        temp.click();
        temp.remove;
        canva.remove();
    }
}


//Show/Hide smth
function showYourself(a){document.getElementsByClassName("banana")[a-1].classList.toggle("hidden");}

//Strecth smth
function changeType(a){document.getElementById(a).classList.toggle("bigBoi");}

//Used to save image
function saveFile(exportSize){downloadCanvas(exportSize);}

//Clear canvas
function clearCanvas(elem){
    var ctx = elem.getContext("2d");
    ctx.clearRect(0, 0, canh, canw);}

//Clear all
function clearAll(){
    clearCanvas(document.getElementById("image"));
    clearCanvas(document.getElementById("border"));
    clearCanvas(document.getElementById("text"));
}
// Creates final canva and exports it
function downloadCanvas(size){
        
    //Create final canva element
    var anch = document.getElementById("finished");
    var new_canvas = document.createElement("canvas");
    anch.appendChild(new_canvas);
    new_canvas.id = "finalCopy";
    new_canvas.width = size;
    new_canvas.height = size;

    //Constructs canva and downloads it
    constructCanva(new_canvas, size);

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
        imgURL = tempUrl;
        add_img(tempUrl, canvas, canw);
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

const borderlayer = document.getElementById("border");

borderlayer.setAttribute("width", canw);
borderlayer.setAttribute("height", canh);

const ctxb = borderlayer.getContext("2d");

var color = document.getElementById("colorpicker").value;

document.getElementById("colorpicker").addEventListener("change", function(){
    color = this.value;
    borderCol = color;
    setBorder(color, ctxb, canw);
});

function setBorder(borderColour, ctxborder, width){  

    borderWidth = width/30;

    ctxborder.fillStyle = setGradient(0, 0, 0, borderWidth, borderColour);
    ctxborder.fillRect(0, 0, width, borderWidth); //top

    ctxborder.fillStyle = setGradient(0, 0, borderWidth, 0, borderColour);
    ctxborder.fillRect(0, 0, borderWidth, width); //left

    ctxborder.fillStyle = setGradient(0, width, 0, width-borderWidth, borderColour);
    ctxborder.fillRect(0, width-borderWidth, width, borderWidth); //bottom

    ctxborder.fillStyle = setGradient(width, 0, width-borderWidth, 0, borderColour);
    ctxborder.fillRect(width-borderWidth, 0, borderWidth, width); //right
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

//Text bs

const maxWidth = canw * 0.9;

const textLayer = document.getElementById("text");

textLayer.setAttribute("width", canw);
textLayer.setAttribute("height", canh);

const txtctx = textLayer.getContext("2d");

function drawText(text, fontSize, x, y, txtCon, size){
    
    txtCon.textAlign = 'center';    
    txtCon.font = '700 '+ fontSize * size + 'px Work Sans';
    txtCon.fillStyle = '#FFFFFF';
    txtCon.shadowColor = document.getElementById("textcolor").value;
    txtCon.shadowBlur = 10;

    txtCon.fillText(text, x, y, maxWidth);
    txtCon.fillText(text, x, y, maxWidth);
}

document.getElementById("textcolor").addEventListener("change", function(){
    if(text.botTxt.length != 0){
        setBttmTxt();
    }
    if(text.botTxt.length != 0){
        setTopTxt();
    }
})

function drawTopTxt(canva, text, txtRatio){
    var ctx = canva.getContext("2d");
    drawText(text, txtRatio, canva.width/2, canva.height*0.15, ctx, canva.width);
}

function drawBotTxt(canva, text, txtRatio){
    var ctx = canva.getContext("2d");
    drawText(text, txtRatio, canva.width/2, canva.height*0.9, ctx, canva.width);
}

function setBttmTxt(){
    txtctx.clearRect(0, 0, canw, canh/2);
    //blurctx.clearRect(0, 0, canw, canh/2);
    text.topTxt = document.getElementById("toptext").value.toUpperCase();
    drawText(text.topTxt, text.txtRatio, canw/2, canh*0.15, txtctx, canw);
}

function setTopTxt(){
    txtctx.clearRect(0, canh/2, canw, canh/2);
    //blurctx.clearRect(0, canh/2, canw, canh/2);
    text.botTxt = document.getElementById("bottomtext").value.toUpperCase();
    drawText(text.botTxt, text.txtRatio, canw/2, canh*0.9, txtctx, canw);
}

document.getElementById("toptext").addEventListener("change", function(){
    document.fonts.load("Work Sans").then(setBttmTxt());
});

document.getElementById("bottomtext").addEventListener("change", function(){
    document.fonts.load("Work Sans").then(setTopTxt());
});

var slider = document.getElementById("myRange");

slider.oninput = function() {
    text.txtRatio = this.value/canw;
    document.fonts.load("Work Sans").then(setBttmTxt());
    document.fonts.load("Work Sans").then(setTopTxt());
}