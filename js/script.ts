window.onload = init;

//  Properties
const imgcanvas = <HTMLCanvasElement> document.getElementById("image");
const bordercanvas = <HTMLCanvasElement> document.getElementById("border");
const textcanvas = <HTMLCanvasElement> document.getElementById("text");

const overlays = [
    "imgOverlay",
    "borderOverlay",
    "textOverlay"
]

//for moving text

textcanvas.onpointerdown = dragText;
textcanvas.onpointerup = dropText;

class affData {
    // Stores image data
    imgURL: string;
    
    /** Stores text data
        text = text; input
        sizeRatio = number; text size relative to canva width
        textBorderBlur = number; text blur size relative to canva width
        x = number; text x cordinate
        y = number; text y cordinate
        rx = number; text relative x cordinate to canva width
        ry = number; text relative ry cordinate to canva width
        defaultPos = boolean; determines wheter text should use automatic positioning
    */
    topText: { text: string; sizeRatio: number; textBorderBlur: number; x: number, y: number, rx: number, ry: number, defaultPos: boolean };
    botTxt: { text: string; sizeRatio: number; textBorderBlur: number; x: number, y: number, rx: number, ry: number, defaultPos: boolean };
    
    // Temporary cordinates used when text is moved
    relativeTxtMove: { x: number; y: number };

    // Hex string for colour
    borderColour: string;

    constructor(){
        this.imgURL = "";
        this.topText = {
            text : "",
            sizeRatio: 100/imgcanvas.clientWidth,
            textBorderBlur: 15/textcanvas.clientWidth,
            x: textcanvas.clientWidth/2,
            y: initTxtPos("top", textcanvas.clientHeight),
            rx: (textcanvas.clientWidth/2) / textcanvas.clientWidth,
            ry: initTxtPos("top", textcanvas.clientHeight) / textcanvas.clientHeight,
            defaultPos: true,
        };
        this.botTxt = {
            text : "",
            sizeRatio: 100/imgcanvas.clientWidth,
            textBorderBlur: 15/textcanvas.clientWidth,
            x: textcanvas.clientWidth/2,
            y: initTxtPos("bot", textcanvas.clientWidth),
            rx: (textcanvas.clientWidth/2) / textcanvas.clientWidth,
            ry: initTxtPos("bot", textcanvas.clientHeight) / textcanvas.clientHeight,
            defaultPos: true,
        };
        this.relativeTxtMove = {
            x: 0,
            y: 0,
        };
        this.borderColour = "";
    }

    // Set IMG
    setImg(url: string) {
        this.imgURL = url;
    }
    // Get IMG
    getImg() {
        return this.imgURL;
    }
    
    // Set, Get any toptxt field
    setTopTxt(key: string, value: any){
        this.topText[key] = value;
    }
    getTopTxt(key: string){
        return this.topText[key];
    }

    // Set, Get any bottxt field
    setBotTxt(key: string, value: any){
        this.botTxt[key] = value;
    }
    getBotTxt(key: string){
        return this.botTxt[key];
    }

    setRelCord(value: number[]){
        this.relativeTxtMove.x = value[0];
        this.relativeTxtMove.y = value[1];
    }

    getRelX(){
        return this.relativeTxtMove.x;
    }
    getRelY(){
        return this.relativeTxtMove.y;
    }


    //Set,Get border Colour
    setBorder(value: string){
        this.borderColour = value;
    }
    getBorder(){
        return this.borderColour;
    }
}

const affD: affData = new affData();

var aspectAnchor = 0; // for 1080p whether bottom or left is 1080 px if 0 bottom if 1 side

var openOverlay = "imgOverlay";

function init(){
    let topText = document.getElementById("toptext") as HTMLInputElement;
    let bottomText = document.getElementById("bottomtext") as HTMLInputElement;
    let topRange = document.getElementById("TopRange") as HTMLInputElement;
    let botRange = document.getElementById("BotRange") as HTMLInputElement;

    topText.value = "";
    bottomText.value = "";
    topRange.value = "100";
    botRange.value = "100";
    }

// Add image on canva
function add_img(src: string, canva: HTMLCanvasElement) {
    let ctx = canva.getContext("2d")
    let img = new Image();
    img.src = src;
    img.onload = function(){
        ctx.drawImage(img, 0, 0, canva.clientWidth, canva.clientHeight );
    }
}

//Construct canva from stored data
function constructCanva(canva: HTMLCanvasElement){
    
    let ctx = canva.getContext("2d");

    if(affD.getImg() == ""){

        setBorder(affD.getBorder(), ctx, canva.clientWidth, canva.clientHeight);
        ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0; //wtf is this???

        drawTopText(canva, affD.getTopTxt("rx") * canva.clientWidth, affD.getTopTxt("ry") * canva.clientHeight, 1);
        drawBotText(canva, affD.getBotTxt("rx") * canva.clientWidth, affD.getBotTxt("ry") * canva.clientHeight, 1);     
        
        const temp = document.createElement("a");
        temp.href = canva.toDataURL();
        temp.download = "afirmacija";
        temp.click();
        temp.remove;
        canva.remove(); 
        return;
    }

    let img = new Image();
    img.src = affD.getImg();

    img.onload = function(){
        ctx.drawImage(img,0,0,canva.clientWidth,canva.clientHeight);

        setBorder(affD.getBorder(), ctx, canva.clientWidth, canva.clientHeight);
        ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0; //wtf is this???
        
        drawTopText(canva, affD.getTopTxt("rx") * canva.clientWidth, affD.getTopTxt("ry") * canva.clientHeight, 1);
        drawBotText(canva, affD.getBotTxt("rx") * canva.clientWidth, affD.getBotTxt("ry") * canva.clientHeight, 1);     
         
        const temp = document.createElement("a");
        temp.href = canva.toDataURL(); 
        temp.download = "afirmacija";
        temp.click();
        temp.remove;
        canva.remove();
    }
}

//Used to save image
function saveFile(exportSize: number){downloadCanvas(exportSize);}

//Update imgAspect
function changeAspect(){
    if(aspectAnchor){aspectAnchor = 0; return} 
    aspectAnchor = 1;
}

//Clear canvas
function clearCanvas(elem: HTMLCanvasElement){
    var ctx = elem.getContext("2d");
    ctx.clearRect(0, 0, imgcanvas.clientWidth, imgcanvas.clientHeight);
}

//Clear all
function clearAll(){
    clearCanvas(<HTMLCanvasElement> document.getElementById("image"));
    clearCanvas(<HTMLCanvasElement> document.getElementById("border"));
    clearCanvas(<HTMLCanvasElement> document.getElementById("text"));
}

// Creates final canva and exports it
function downloadCanvas(size){
        
    //Create final canva element
    var anch = document.getElementById("finished");
    var new_canvas = document.createElement("canvas");
    var aspectRatio = imgcanvas.clientWidth/imgcanvas.clientHeight;

    anch.appendChild(new_canvas);
    new_canvas.id = "finalCopy";
    
    if(aspectAnchor){
        //size == height
        new_canvas.width = size; 
        new_canvas.height = size;   
    } else {
        new_canvas.width = size;
        new_canvas.height = size / aspectRatio;
    }

    //Constructs canva and downloads it
    constructCanva(new_canvas);

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

        const txtSpan = document.getElementById("file-chosen");
        txtSpan.textContent = userFile.files[0].name;

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

    if (opacity > 1 && opacity <= 100) {
        opacity = opacity / 100;   
    }
    var rgba = [r, g, b, opacity];
    return rgba;
}

var color = document.getElementById("colorpicker").value;

document.getElementById("colorpicker").addEventListener("change", function(){
    clearCanvas(bordercanvas);
    color = this.value;
    borderCol = color;
    setBorder(color, ctxb, bordercanvas.clientWidth, bordercanvas.clientHeight);
});

function setBorder(borderColour, ctxborder, width, height){  
    //Formats and sets border with user color input
    if(borderColour == ""){return};
    
    let borderWidth: number = width/30;
    
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
    ctxborder.fillRect(0, height-borderWidth, width, borderWidth); //bottom

    ctxborder.fillStyle = setGradient(height, 0, height-borderWidth, 0, borderColour);
    ctxborder.shadowOffsetX = -5;
    ctxborder.fillRect(width-borderWidth, 0, borderWidth, height); //right
}

function setGradient(x, y, x1, y1, color){
    var rgba = convertHex(color, 1);
    var r = rgba[0], g = rgba[1], b = rgba[2];
    var gradient = ctxb.createLinearGradient(x, y, x1, y1);
    gradient.addColorStop(0, `rgba(${r},${g},${b},1)`);
    //gradient.addColorStop(0.35, `rgba(${r},${g},${b},.95)`); //idk
    gradient.addColorStop(0.7, `rgba(${r},${g},${b},.2)`);
    gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
    return gradient;
}

//Text
var maxWidth = 0;

function drawText(text, fontSize, x, y, txtCon, size, blurRatio){
    maxWidth = size * 0.9;
    
    //Text formatting

    txtCon.textAlign = 'center';    
    //if add changable boldness
    //txtCon.font = fontWeight + ' '+ fontSize * size + 'px Work Sans';
    txtCon.font = '700 '+ fontSize * size + 'px Work Sans';
    txtCon.fillStyle = '#FFFFFF';
    txtCon.shadowColor = document.getElementById("textcolor").value;
    txtCon.shadowBlur = blurRatio * size;

    txtCon.fillText(text, x, y, maxWidth);
    txtCon.fillText(text, x, y, maxWidth);
}

function drawTopText(canva, x, y, final){
    if(text.topTxt == ""){console.log("Missing Top Text"); return};
    var ctx = canva.getContext("2d");
    
    if(text.botTxt != "" && !final){
        ctx.clearRect(0, 0, textcanvas.clientWidth, textcanvas.clientHeight);   
        topTextCords.x = x;
        topTextCords.y = y;
        drawText(text.botTxt, text.txtRatioBot, botTextCords.rx * textcanvas.clientWidth, botTextCords.ry * textcanvas.clientHeight, ctx, canva.clientWidth, text.borderBlurRatio);
    }else if (!final){
        ctx.clearRect(0, 0, textcanvas.clientWidth, textcanvas.clientHeight);   
    }
    drawText(text.topTxt, text.txtRatioTop, x, y, ctx, canva.clientWidth, text.borderBlurRatio);
} 

function drawBotText(canva, x, y, final){
    if(text.botTxt == ""){console.log("Missing Bottom Text"); return};
    var ctx = canva.getContext("2d");

    
    if(text.topTxt != "" && !final){
        ctx.clearRect(0, 0, textcanvas.clientWidth, textcanvas.clientHeight);
        botTextCords.x = x;
        botTextCords.y = y; 
        drawText(text.topTxt, text.txtRatioTop, topTextCords.rx * textcanvas.clientWidth, topTextCords.ry * textcanvas.clientHeight, ctx, canva.clientWidth, text.borderBlurRatio);
    }else if (!final){
        ctx.clearRect(0, 0, textcanvas.clientWidth, textcanvas.clientHeight);
    }
    drawText(text.botTxt, text.txtRatioBot, x, y, ctx, canva.clientWidth, text.borderBlurRatio);
}

function initTxtPos(txtType, height){
    switch(txtType){
        case "top":
            return (height * (0.15 + text.txtRatioTop * 0.35));
        case "bot":
            return (height * 0.92);
    }
}

document.getElementById("textcolor").addEventListener("change", function(){
    //Changes text color on user color input
    if(text.topTxt.length != 0){
        drawTopText(textcanvas, topTextCords.x, topTextCords.y);
    }
    if(text.botTxt.length != 0){
        drawBotText(textcanvas, botTextCords.x, botTextCords.y);
    }
})


function topTextHndler(e) {
    ctxt.clearRect(0, 0, textcanvas.clientWidth, textcanvas.clientHeight/2);
    text.topTxt = e.target.value.toUpperCase();
    drawTopText(textcanvas, topTextCords.rx * textcanvas.clientWidth, topTextCords.ry * textcanvas.clientHeight);
}

function botTextHndler(e){
    ctxt.clearRect(0, textcanvas.clientHeight/2, textcanvas.clientWidth, textcanvas.clientHeight/2);
    text.botTxt = e.target.value.toUpperCase();
    drawBotText(textcanvas, botTextCords.rx * textcanvas.clientWidth, botTextCords.ry * textcanvas.clientHeight);
}

var topTxt = document.getElementById("toptext");
var botTxt = document.getElementById("bottomtext");

topTxt.addEventListener('input', topTextHndler);
botTxt.addEventListener('input', botTextHndler);

topTxt.addEventListener('propertychange', topTextHndler);
botTxt.addEventListener('propertychange', botTextHndler);


var sliderTop = document.getElementById("TopRange"); 

sliderTop.oninput = function() {
    //Changes TOP text size on user slider input
    text.txtRatioTop = this.value/textcanvas.clientWidth;
    if(defaultCords){
        newy = initTxtPos("top", textcanvas.clientHeight);  
        topTextCords.ry = newy / textcanvas.clientHeight;
        drawTopText(textcanvas, topTextCords.x, newy);
        return;
    }
    drawTopText(textcanvas, topTextCords.x ,topTextCords.y);
}

var sliderBot = document.getElementById("BotRange");

sliderBot.oninput = function() {
    //Changes BOTTOM text size on user slider input
    text.txtRatioBot = this.value/textcanvas.clientWidth;
    drawBotText(textcanvas,  botTextCords.x, botTextCords.y);
}

var dragok = false;

function dragText(e){
    e.preventDefault();
    if( e.pageX < topTextCords.x+ textcanvas.clientWidth*0.45 +document.getElementById('result').offsetLeft &&
        e.pageX > topTextCords.x- textcanvas.clientWidth*0.45 +document.getElementById('result').offsetLeft &&
        e.pageY < topTextCords.y + 20 + document.getElementById('result').offsetTop &&
        e.pageY > topTextCords.y - textcanvas.clientHeight/4 +document.getElementById('result').offsetTop)
        {
            dragok = true;

            defaultCords = false;

            tempx = e.pageX - document.getElementById('result').offsetLeft;
            tempy = e.pageY - document.getElementById('result').offsetTop;

            relTextCords.x = topTextCords.x - tempx;
            relTextCords.y = topTextCords.y - tempy;

            //textcanvas.addEventListener('touchmove', moveTextTop);
            textcanvas.onpointermove = moveTextTop;
    }
 
    if( e.pageX < botTextCords.x+ textcanvas.clientWidth*0.45 +document.getElementById('result').offsetLeft &&
        e.pageX > botTextCords.x- textcanvas.clientWidth*0.45 +document.getElementById('result').offsetLeft &&
        e.pageY < botTextCords.y + 20 + document.getElementById('result').offsetTop &&
        e.pageY > botTextCords.y - textcanvas.clientHeight/4 +document.getElementById('result').offsetTop)
        {
            dragok = true;

            tempx = e.pageX - document.getElementById('result').offsetLeft;
            tempy = e.pageY - document.getElementById('result').offsetTop;

            relTextCords.x = botTextCords.x - tempx;
            relTextCords.y = botTextCords.y - tempy;
            
            //textcanvas.addEventListener('touchmove', moveTextBot);
            textcanvas.onpointermove = moveTextBot;
    }
}

function dropText(){
    dragok = false;
    relTextCords = {x: 0, y: 0}
    textcanvas.onpointermove = null;
    //textcanvas.removeEventListener("touchmove");
}

function moveTextTop(e){
    if (dragok){
        x = e.pageX - document.getElementById('result').offsetLeft + relTextCords.x;
        y = e.pageY - document.getElementById('result').offsetTop + relTextCords.y;
        topTextCords.rx = x / textcanvas.clientWidth;
        topTextCords.ry = y / textcanvas.clientHeight;
        topTextCords.x = x;
        topTextCords.y = y;
        drawTopText(textcanvas, x, y);
    }
}

function moveTextBot(e){
    if (dragok){
        x = e.pageX - document.getElementById('result').offsetLeft + relTextCords.x;
        y = e.pageY - document.getElementById('result').offsetTop + relTextCords.y;
        botTextCords.rx = x / textcanvas.clientWidth;
        botTextCords.ry = y / textcanvas.clientHeight;
        botTextCords.x = x;
        botTextCords.y = y;
        drawBotText(textcanvas, x, y);
    }
}

//dynamic canvas

function canvasDims(canvas) {
    let dpr = window.devicePixelRatio;
    let cssWidth = canvas.clientWidth;
    let cssHeight = canvas.clientHeight;
    let pxWidth = Math.round(dpr * cssWidth);
    let pxHeight = Math.round(dpr * cssHeight);
    return {dpr, cssWidth, cssHeight, pxWidth, pxHeight};
}

function rerender() {
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

    drawTopText(textcanvas, topTextCords.rx * cssWidth, topTextCords.ry * cssHeight);
    drawBotText(textcanvas, botTextCords.rx * cssWidth, botTextCords.ry * cssHeight);    
}

function toggleHide(elemID){
    var elem = document.getElementById(elemID);
    
    for(i = 0; i<overlays.length; i++){
        if(!document.getElementById(overlays[i]).classList.contains("hidden")){
            document.getElementById(overlays[i]).classList.toggle("hidden");
        }
    }
    
    elem.classList.toggle("hidden");
}

function updateColorPicker(btn_index){
    var colour = document.getElementsByClassName("hiddenpicker")[btn_index].value;
    document.getElementsByClassName("styledPicker")[btn_index].style.backgroundColor = colour;
}

new ResizeObserver(() => rerender()).observe(imgcanvas);
