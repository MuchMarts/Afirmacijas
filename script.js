window.onload = init;

//  Properties
const imgcanvas = document.getElementById("image");
const ctxi = imgcanvas.getContext('2d');

const bordercanvas = document.getElementById("border");
const ctxb = bordercanvas.getContext("2d");

const textcanvas = document.getElementById("text");
const ctxt = textcanvas.getContext("2d");

var imgURL = "";
var text = {  
    topTxt : "",
    botTxt : "",
    txtRatioTop: 100/imgcanvas.width,
    txtRatioBot: 100/imgcanvas.width,
}
var borderCol = "";


function init(){
    document.getElementById("toptext").value = "";
    document.getElementById("bottomtext").value = "";
    document.getElementById("TopRange").value = 100;
    document.getElementById("BotRange").value = 100;
    }

// Add image on canva
function add_img(src, canva, width, height) {
    ctx = canva.getContext("2d")
    img = new Image();
    img.src = src;
    img.onload = function(){
        ctx.drawImage(img,0,0,width,height);
    }
}

//Merge multiple canvas
function mergeCanvas(imageID, borderID, textID, textBlurID, ctx, size){
    var baseCanva = document.getElementById(imageID);
    var border = document.getElementById(borderID);
    var text = document.getElementById(textID);
    //var textBlur = document.getElementById(textBlurID);
    
    ctx.drawImage(baseCanva, 0, 0, size, size);
    ctx.drawImage(border, 0, 0, size, size);
    //ctx.drawImage(textBlur, 0, 0, size, size);
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
        ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
        if(text.topTxt != "null" && text.txtRatio != -1){
            drawTopTxt(canva, text.topTxt, text.txtRatioTop);
        }
        if(text.botTxt != "null" && text.txtRatio != -1){
            drawBotTxt(canva, text.botTxt, text.txtRatioBot);
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
    ctx.clearRect(0, 0, imgcanvas.width, imgcanvas.height);}

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
        add_img(tempUrl, imgcanvas, imgcanvas.clientWidth, imgcanvas.clientHeight);
    }
}

//Border

function convertHex(hexCode, opacity = 1){ 
    //code src="https://gist.github.com/danieliser/b4b24c9f772066bcf0a6.js"
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



var color = document.getElementById("colorpicker").value;

document.getElementById("colorpicker").addEventListener("change", function(){
    color = this.value;
    borderCol = color;
    setBorder(color, ctxb, canw);
});

function setBorder(borderColour, ctxborder, width, height){  
    //Formats and sets border with user color input

    clearCanvas(bordercanvas);

    borderWidth = width/40;
    ctxborder.fillStyle = borderColour;
    ctxborder.shadowColor = borderColour;
    ctxborder.shadowBlur = 30;

    ctxborder.fillStyle = setGradient(0, 0, 0, borderWidth, borderColour);
    ctxborder.shadowOffsetY = 5;
    ctxborder.fillRect(0, 0, width, borderWidth); //top

    ctxborder.fillStyle = setGradient(0, 0, borderWidth, 0, borderColour);
    ctxborder.shadowOffsetX = 5;
    ctxborder.fillRect(0, 0, borderWidth, height); //left

    ctxborder.fillStyle = setGradient(0, height, 0, height-borderWidth, borderColour);
    ctxborder.shadowOffsetY = -5;
    ctxborder.fillRect(0, height-borderWidth, height, borderWidth); //bottom

    ctxborder.fillStyle = setGradient(height, 0, height-borderWidth, 0, borderColour);
    ctxborder.shadowOffsetX = -5;
    ctxborder.fillRect(height-borderWidth, 0, borderWidth, height); //right
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

//Text

const maxWidth = imgcanvas.width * 0.9;



function drawText(text, fontSize, x, y, txtCon, size){
    //Text formatting
    
    txtCon.textAlign = 'center';    
    txtCon.font = '700 '+ fontSize * size + 'px Work Sans';
    txtCon.fillStyle = '#FFFFFF';
    txtCon.shadowColor = document.getElementById("textcolor").value;
    txtCon.shadowBlur = 10;

    txtCon.fillText(text, x, y, maxWidth);
    txtCon.fillText(text, x, y, maxWidth);
}

document.getElementById("textcolor").addEventListener("change", function(){
    //Changes text color on user color input
    if(text.botTxt.length != 0){
        setTopTxt();
    }
    if(text.botTxt.length != 0){
        setBttmTxt();
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

function redrawTopTxt(ctx, text, txtRatio, width, height){
    drawText(text, txtRatio, width/2, height*0.15, ctx, width);
}

function redrawBotTxt(ctx, text, txtRatio, width, height){
    drawText(text, txtRatio, width/2, height*0.9, ctx, width);
}
function redrawText(ctx, width, height){
    redrawTopTxt(ctx, text.topTxt, text.txtRatioTop, width, height);
    redrawBotTxt(ctx, text.botTxt, text.txtRatioBot, width, height);
}

function setTopTxt(){
    //TOP text setter
    ctxt.clearRect(0, 0, textcanvas.clientWidth, textcanvas.clientHeight/2);
    text.topTxt = document.getElementById("toptext").value.toUpperCase();
    drawText(text.topTxt, text.txtRatioTop, textcanvas.clientWidth/2, textcanvas.clientHeight*0.15, ctxt, textcanvas.clientWidth);
}

function setBttmTxt(){
    //BOTTOM text setter
    ctxt.clearRect(0, textcanvas.clientHeight/2, textcanvas.clientWidth, textcanvas.clientHeight/2);
    text.botTxt = document.getElementById("bottomtext").value.toUpperCase();
    drawText(text.botTxt, text.txtRatioBot, textcanvas.clientWidth/2, textcanvas.clientHeight*0.9, ctxt, textcanvas.clientWidth);
}

document.getElementById("toptext").addEventListener("change", function(){
    //Sets TOP text on user text input
    document.fonts.load("Work Sans").then(setTopTxt());
});

document.getElementById("bottomtext").addEventListener("change", function(){
    //Sets BOTTOM text on user text input
    document.fonts.load("Work Sans").then(setBttmTxt());
});

var sliderTop = document.getElementById("TopRange"); 

sliderTop.oninput = function() {
    //Changes TOP text size on user slider input
    text.txtRatioTop = this.value/canw;
    document.fonts.load("Work Sans").then(setTopTxt());
}

var sliderBot = document.getElementById("BotRange");

sliderBot.oninput = function() {
    //Changes BOTTOM text size on user slider input
    text.txtRatioBot = this.value/canw;
    document.fonts.load("Work Sans").then(setBttmTxt());
}

function canvasDims(canvas) {
    let dpr = window.devicePixelRatio;
    let cssWidth = canvas.clientWidth;
    let cssHeight = canvas.clientHeight;
    let pxWidth = Math.round(dpr * cssWidth);
    let pxHeight = Math.round(dpr * cssHeight);
    return {dpr, cssWidth, cssHeight, pxWidth, pxHeight};
}

function rerender() {
    clearAll();

    let {cssWidth, cssHeight, pxWidth, pxHeight, dpr} = canvasDims(imgcanvas);
    
    imgcanvas.width = pxWidth;
    imgcanvas.height = pxHeight;
    bordercanvas.width = pxWidth;
    bordercanvas.height = pxHeight;
    textcanvas.width = pxWidth;
    textcanvas.height = pxHeight;

    let ctxi = imgcanvas.getContext("2d");
    let ctxb = bordercanvas.getContext("2d");
    let ctxt = textcanvas.getContext("2d");

    ctxi.scale(dpr, dpr);
    ctxb.scale(dpr, dpr);
    ctxt.scale(dpr, dpr);

    add_img(imgURL, imgcanvas, cssWidth, cssHeight);
    if(borderCol != ""){setBorder(borderCol, ctxb, cssWidth, cssHeight);}
    if(text.topTxt !== "" && text.botTxt !== ""){redrawText(ctxt, width, height);}
}

new ResizeObserver(() => rerender()).observe(imgcanvas);