//  Properties
const imgcanvas = <HTMLCanvasElement> document.getElementById("image");
const bordercanvas = <HTMLCanvasElement> document.getElementById("border");
const textcanvas = <HTMLCanvasElement> document.getElementById("text");

const overlays = [
    "imgOverlay",
    "borderOverlay",
    "textOverlay"
]

window.onload = init;

interface IDictionary<TValue> {
    [key: string]: TValue;
}
let imgURL: string = "";
let topText: IDictionary<any> = {
    text : "",
    sizeRatio: 100/imgcanvas.clientWidth,
    textBorderBlur: 15/textcanvas.clientWidth,
    x: textcanvas.clientWidth/2,
    y: initTxtPos("top", textcanvas.clientHeight, 100/imgcanvas.clientWidth),
    rx: (textcanvas.clientWidth/2) / textcanvas.clientWidth,
    ry: initTxtPos("top", textcanvas.clientHeight, 100/imgcanvas.clientWidth) / textcanvas.clientHeight,
    defaultPos: true,
};
let botText: IDictionary<any> = {
    text : "",
    sizeRatio: 100/imgcanvas.clientWidth,
    textBorderBlur: 15/textcanvas.clientWidth,
    x: textcanvas.clientWidth/2,
    y: initTxtPos("bot", textcanvas.clientWidth, 100/imgcanvas.clientWidth),
    rx: (textcanvas.clientWidth/2) / textcanvas.clientWidth,
    ry: initTxtPos("bot", textcanvas.clientHeight, 100/imgcanvas.clientWidth) / textcanvas.clientHeight,
    defaultPos: true,
};
let relativeTxtMove: { x: number; y: number } = {
    x: 0,
    y: 0,
};
let borderColour: string = "";

// Set IMG
function setImg(url: string) {
    imgURL = url;
}
// Get IMG
function getImg() {
    return imgURL;
}
    
// Set, Get any toptxt field
function setTopTxt(key: string, value: any){
    topText[key] = value;
}

// Set, Get any bottxt field
function setBotTxt(key: any, value: any){
    botText[key] = value;
}

function setRelCord(value: number[]){
    relativeTxtMove.x = value[0];
    relativeTxtMove.y = value[1];
}

function getRelX(){
    return relativeTxtMove.x;
}
function getRelY(){
    return relativeTxtMove.y;
}


//Set,Get border Colour
function setBorderCol(value: string){
    borderColour = value;
}
function getBorderCol(){
    return borderColour;
}

//for moving text

textcanvas.onpointerdown = dragText;
textcanvas.onpointerup = dropText;

var aspectAnchor = 0; // for 1080p whether bottom or left is 1080 px if 0 bottom if 1 side

var openOverlay = "imgOverlay";



function init(){
    let topText = document.getElementById("toptext") as HTMLInputElement;
    let bottomText = document.getElementById("bottomtext") as HTMLInputElement;
    let topRange = document.getElementById("TopRange") as HTMLInputElement;
    let botRange = document.getElementById("BotRange") as HTMLInputElement;
    let txtCol = document.getElementById("textcolor") as HTMLInputElement;
    topText.value = "";
    bottomText.value = "";
    topRange.value = "100";
    botRange.value = "100";
    txtCol.value = "#000000";
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

    if(getImg() == ""){

        setBorder(getBorderCol(), canva, canva.clientWidth, canva.clientHeight);
        ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0; //wtf is this???

        drawTopText(canva, topText.rx * canva.clientWidth, topText.ry * canva.clientHeight, true);
        drawBotText(canva, botText.rx * canva.clientWidth, botText.ry * canva.clientHeight, true);     
        
        const temp = document.createElement("a");
        temp.href = canva.toDataURL();
        temp.download = "afirmacija";
        temp.click();
        temp.remove;
        canva.remove(); 
        return;
    }

    let img = new Image();
    img.src = getImg();

    img.onload = function(){
        ctx.drawImage(img,0,0,canva.clientWidth,canva.clientHeight);

        setBorder(getBorderCol(), canva, canva.clientWidth, canva.clientHeight);
        ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0; //wtf is this???
        
        drawTopText(canva, topText.rx * canva.clientWidth, topText.ry * canva.clientHeight, true);
        drawBotText(canva, botText.rx * canva.clientWidth, botText.ry * canva.clientHeight, true);     
         
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
function downloadCanvas(size: number){
        
    //Create final canva element
    var anch: HTMLElement = document.getElementById("finished");
    var new_canvas: HTMLCanvasElement = document.createElement("canvas");
    var aspectRatio: number = imgcanvas.clientWidth/imgcanvas.clientHeight;

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

function handleFiles(){

    var userFile = document.getElementById("userFile") as HTMLInputElement;
    var place = document.getElementById ("text");

    if(!userFile.files.length){
        place.innerHTML = "Nav failu...:(";   
    } else if(userFile.files.length > 1){
        place.innerHTML = "Izvēlies vienu failu pls...:(";   
    } else {
        place.innerHTML = userFile.files[0].name + ": " + userFile.files[0].size + " biti";
        let tempUrl:string = URL.createObjectURL(userFile.files[0]);
        setImg(tempUrl);
        add_img(tempUrl, imgcanvas);

        const txtSpan = document.getElementById("file-chosen");
        txtSpan.textContent = userFile.files[0].name;

    }
}

//Border

function convertHex(hexCode: string, opacity: number = 1){ 
    //code src="https://gist.github.com/danieliser/b4b24c9f772066bcf0a6.js"
    var hex: string = hexCode.replace('#', '');

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

var colourPicker: HTMLInputElement = document.getElementById("colorpicker") as HTMLInputElement;
var color = colourPicker.value;

colourPicker.addEventListener("change", function(){
    clearCanvas(bordercanvas);
    color = this.value;
    setBorderCol(color);
    setBorder(color, bordercanvas, bordercanvas.clientWidth, bordercanvas.clientHeight);
});

function setBorder(borderColour: string, canva: HTMLCanvasElement, width: number, height: number){  
    //Formats and sets border with user color input
    if(borderColour == ""){return};
    
    let ctxborder = canva.getContext("2d");

    let borderWidth: number = width/30;
    
    ctxborder.fillStyle = borderColour;
    ctxborder.shadowColor = borderColour;
    ctxborder.shadowBlur = 30;

    ctxborder.fillStyle = setGradient(0, 0, 0, borderWidth, borderColour, ctxborder);
    ctxborder.shadowOffsetY = 5;
    ctxborder.fillRect(0, 0, width, borderWidth); //top

    ctxborder.fillStyle = setGradient(0, 0, borderWidth, 0, borderColour, ctxborder);
    ctxborder.shadowOffsetX = 5;
    ctxborder.fillRect(0, 0, borderWidth, height); //left

    ctxborder.fillStyle = setGradient(0, height, 0, height-borderWidth, borderColour, ctxborder);
    ctxborder.shadowOffsetY = -5;
    ctxborder.fillRect(0, height-borderWidth, width, borderWidth); //bottom

    ctxborder.fillStyle = setGradient(height, 0, height-borderWidth, 0, borderColour, ctxborder);
    ctxborder.shadowOffsetX = -5;
    ctxborder.fillRect(width-borderWidth, 0, borderWidth, height); //right
}

function setGradient(x: number, y: number, x1: number, y1: number, color: string, ctxb: any){
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

function drawText(text: string, fontSize: number, x: number, y: number, canva: HTMLCanvasElement, size: number, blurRatio: number){
    maxWidth = size * 0.9;

    let txtCon = canva.getContext("2d")
    txtCon.save();
    //Text formatting

    txtCon.textAlign = 'center';    
    //if add changable boldness
    //txtCon.font = fontWeight + ' '+ fontSize * size + 'px Work Sans';
    txtCon.font = '700 '+ fontSize * size + 'px Work Sans';
    txtCon.fillStyle = '#FFFFFF';
    let txtCol = document.getElementById("textcolor") as HTMLInputElement;
    txtCon.shadowColor = txtCol.value;
    txtCon.shadowBlur = blurRatio * size;

    txtCon.fillText(text, x, y, maxWidth);
    txtCon.fillText(text, x, y, maxWidth);
    txtCon.restore();
}

function drawTopText(canva: HTMLCanvasElement, x: number, y:number, final: boolean){
    if(topText.text == ""){console.log("Missing Top Text"); return};

    var ctx = canva.getContext("2d");

    if(botText.text != "" && !final){
        ctx.clearRect(0, 0, textcanvas.clientWidth, textcanvas.clientHeight);   

        setTopTxt("x", x);
        setTopTxt("y", y)

        drawText(botText.text, botText.sizeRatio, botText.rx * textcanvas.clientWidth, botText.ry * textcanvas.clientHeight, canva, canva.clientWidth, botText.textBorderBlur);
    }else if (!final){
        ctx.clearRect(0, 0, textcanvas.clientWidth, textcanvas.clientHeight);   
    }

    drawText(topText.text, topText.sizeRatio, x, y, canva, canva.clientWidth, topText.textBorderBlur);
} 

function drawBotText(canva: HTMLCanvasElement, x: number, y: number, final: boolean){
    if(botText.text == ""){console.log("Missing Bottom Text"); return};
    var ctx = canva.getContext("2d");

    
    if(topText.text != "" && !final){
        ctx.clearRect(0, 0, textcanvas.clientWidth, textcanvas.clientHeight);

        setBotTxt("x", x);
        setBotTxt("y", y)

        drawText(topText.text, topText.sizeRatio, topText.rx * textcanvas.clientWidth, topText.ry * textcanvas.clientHeight, canva, canva.clientWidth, topText.textBorderBlur);
    }else if (!final){
        ctx.clearRect(0, 0, textcanvas.clientWidth, textcanvas.clientHeight);
    }
    drawText(botText.text, botText.sizeRatio, x, y, canva, canva.clientWidth, botText.textBorderBlur);
}

function initTxtPos(txtType: "top"|"bot", height: number, sizeRatio: number){
    switch(txtType){
        case "top":
            return (height * (0.15 + sizeRatio * 0.35));
        case "bot":
            return (height * 0.92);
    }
}

document.getElementById("textcolor").addEventListener("change", function(){
    //Changes text color on user color input
    if(topText.text.length != 0){
        drawTopText(textcanvas, topText.x, topText.y, false);
    }
    if(botText.text.length != 0){
        drawBotText(textcanvas, botText.x, botText.y, false);;
    }
})


function topTextHndler(e: any) {
    const target = e.target as HTMLInputElement;
    let ctxt = textcanvas.getContext("2d");
    ctxt.clearRect(0, 0, textcanvas.clientWidth, textcanvas.clientHeight/2);    
    setTopTxt("text", target.value.toUpperCase());
    drawTopText(textcanvas, topText.rx * textcanvas.clientWidth, topText.ry * textcanvas.clientHeight, false);
}

function botTextHndler(e: any){
    const target = e.target as HTMLInputElement;
    let ctxt = textcanvas.getContext("2d");
    ctxt.clearRect(0, textcanvas.clientHeight/2, textcanvas.clientWidth, textcanvas.clientHeight/2);
    setBotTxt("text", target.value.toUpperCase());
    drawBotText(textcanvas, botText.rx * textcanvas.clientWidth, botText.ry * textcanvas.clientHeight, false);
}

var topTxtInput = document.getElementById("toptext") as HTMLInputElement;
var botTxtInput = document.getElementById("bottomtext") as HTMLInputElement;

topTxtInput.addEventListener('input', topTextHndler);
botTxtInput.addEventListener('input', botTextHndler);

topTxtInput.addEventListener('propertychange', topTextHndler);
botTxtInput.addEventListener('propertychange', botTextHndler);

function getValueTopSlider(e: { target: { value: number; }; }) {
    //Changes TOP text size on user slider input
    setTopTxt("sizeRatio", e.target.value/textcanvas.clientWidth);

    if(topText.defaultPos){
        let newy = initTxtPos("top", textcanvas.clientHeight, e.target.value/textcanvas.clientWidth);  
        setTopTxt("ry", newy / textcanvas.clientHeight);
        drawTopText(textcanvas, topText.x, newy, false);
        return;
    }
    drawTopText(textcanvas, topText.x ,topText.y, false);
}

function getValueBotSlider(e: { target: { value: number; }; }) {
    //Changes BOTTOM text size on user slider input
    setBotTxt("sizeRatio", e.target.value/textcanvas.clientWidth);
    drawBotText(textcanvas,  botText.x, botText.y, false);
}

var dragok = false;

function dragText(e: any){
    e.preventDefault();
    if( e.pageX < topText.x + textcanvas.clientWidth * 0.45 + document.getElementById('result').offsetLeft &&
        e.pageX > topText.x - textcanvas.clientWidth * 0.45 + document.getElementById('result').offsetLeft &&
        e.pageY < topText.y + 20 + document.getElementById('result').offsetTop &&
        e.pageY > topText.y - textcanvas.clientHeight / 4 + document.getElementById('result').offsetTop)
        {
            dragok = true;

            setTopTxt("defaultPos", false);

            let tempx: number = e.pageX - document.getElementById('result').offsetLeft;
            let tempy: number = e.pageY - document.getElementById('result').offsetTop;

            let relTxtCords: number[] = [topText.x - tempx, topText.y - tempy];
            setRelCord(relTxtCords); 

            //textcanvas.addEventListener('touchmove', moveTextTop);
            textcanvas.onpointermove = moveTextTop;
    }
 
    if( e.pageX < botText.x + textcanvas.clientWidth * 0.45 + document.getElementById('result').offsetLeft &&
        e.pageX > botText.x - textcanvas.clientWidth * 0.45 + document.getElementById('result').offsetLeft &&
        e.pageY < botText.y + 20 + document.getElementById('result').offsetTop &&
        e.pageY > botText.y - textcanvas.clientHeight / 4 + document.getElementById('result').offsetTop)
        {
            dragok = true;

            let tempx = e.pageX - document.getElementById('result').offsetLeft;
            let tempy = e.pageY - document.getElementById('result').offsetTop;

            let relTxtCords: number[] = [botText.x - tempx, botText.y - tempy];
            setRelCord(relTxtCords); 

            //textcanvas.addEventListener('touchmove', moveTextBot);
            textcanvas.onpointermove = moveTextBot;
    }
}

function dropText(){
    if(topText.defaultPos){setTopTxt("defaultPos", false)}
    if(botText.defaultPos){setBotTxt("defaultPos", false)}

    setRelCord([0,0])
    textcanvas.onpointermove = null;
    //textcanvas.removeEventListener("touchmove");
}

function moveTextTop(e: any){
    if (dragok){
        let x = e.pageX - document.getElementById('result').offsetLeft + getRelX();
        let y = e.pageY - document.getElementById('result').offsetTop + getRelY();
        setTopTxt("rx", x / textcanvas.clientWidth);
        setTopTxt("ry", y / textcanvas.clientHeight);
        setTopTxt("x", x);
        setTopTxt("y", y);

        drawTopText(textcanvas, x, y, false);
    }
}

function moveTextBot(e: any){
    if (dragok){
        let x = e.pageX - document.getElementById('result').offsetLeft + getRelX();
        let y = e.pageY - document.getElementById('result').offsetTop + getRelY();
        setBotTxt("rx", x / textcanvas.clientWidth);
        setBotTxt("ry", y / textcanvas.clientHeight);
        setBotTxt("x", x);
        setBotTxt("y", y);

        drawBotText(textcanvas, x, y, false);
    }
}

//dynamic canvas

function canvasDims(canvas: HTMLCanvasElement) {
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

    ctxi.save();
    ctxb.save();
    ctxt.save();

    add_img(getImg(), imgcanvas);
    if(getBorderCol() != ""){setBorder(getBorderCol(), bordercanvas, cssWidth, cssHeight);}

    drawTopText(textcanvas, topText.rx * cssWidth, topText.ry * cssHeight, false);
    drawBotText(textcanvas, botText.rx * cssWidth, botText.ry * cssHeight, false);    
}

function toggleHide(elemID: string){
    var elem = document.getElementById(elemID);
    
    for(let i = 0; i < overlays.length; i++){
        if(!document.getElementById(overlays[i]).classList.contains("hidden")){
            document.getElementById(overlays[i]).classList.toggle("hidden");
        }
    }
    
    elem.classList.toggle("hidden");
}

function updateColorPicker(btn_index: number){
    var colour = (document.getElementsByClassName("hiddenpicker")[btn_index] as HTMLInputElement).value;
    (document.getElementsByClassName("styledPicker")[btn_index] as HTMLLabelElement).style.backgroundColor = colour;
}

new ResizeObserver(() => rerender()).observe(imgcanvas);
