//  Properties
const imgcanvas = <HTMLCanvasElement> document.getElementById("image");
const bordercanvas = <HTMLCanvasElement> document.getElementById("border");
const textcanvas = <HTMLCanvasElement> document.getElementById("text");

const overlays = [
    "imgOverlay",
    "borderOverlay",
    "textOverlay"
]

interface IDictionary<TValue> {
    [key: string]: TValue;
}

class affData{
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
    topText: IDictionary<any>; 
    botTxt: IDictionary<any>; 

    //topText: { text: string; sizeRatio: number; textBorderBlur: number; x: number, y: number, rx: number, ry: number, defaultPos: boolean };
    //botTxt: { text: string; sizeRatio: number; textBorderBlur: number; x: number, y: number, rx: number, ry: number, defaultPos: boolean };
    
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
    setBotTxt(key: any, value: any){
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

const affD = new affData();

//for moving text

textcanvas.onpointerdown = dragText;
textcanvas.onpointerup = dropText;

var aspectAnchor = 0; // for 1080p whether bottom or left is 1080 px if 0 bottom if 1 side

var openOverlay = "imgOverlay";

window.onload = init;

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

        setBorder(affD.getBorder(), canva, canva.clientWidth, canva.clientHeight);
        ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0; //wtf is this???

        drawTopText(canva, affD.getTopTxt("rx") * canva.clientWidth, affD.getTopTxt("ry") * canva.clientHeight, true);
        drawBotText(canva, affD.getBotTxt("rx") * canva.clientWidth, affD.getBotTxt("ry") * canva.clientHeight, true);     
        
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

        setBorder(affD.getBorder(), canva, canva.clientWidth, canva.clientHeight);
        ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0; //wtf is this???
        
        drawTopText(canva, affD.getTopTxt("rx") * canva.clientWidth, affD.getTopTxt("ry") * canva.clientHeight, true);
        drawBotText(canva, affD.getBotTxt("rx") * canva.clientWidth, affD.getBotTxt("ry") * canva.clientHeight, true);     
         
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
        affD.setImg(tempUrl);
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
    affD.setBorder(color);
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

function drawText(text: string, fontSize: number, x: number, y: number, txtCon: any, size: number, blurRatio: number){
    maxWidth = size * 0.9;
    
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
}

function drawTopText(canva: HTMLCanvasElement, x: number, y:number, final: boolean){
    if(affD.getTopTxt("text") == ""){console.log("Missing Top Text"); return};
    
    var ctx = canva.getContext("2d");
    
    if(affD.getBotTxt("text") != "" && !final){
        ctx.clearRect(0, 0, textcanvas.clientWidth, textcanvas.clientHeight);   

        affD.setTopTxt("x", x);
        affD.setTopTxt("y", y)

        drawText(affD.getBotTxt("text"), affD.getBotTxt("sizeRatio"), affD.getBotTxt("rx") * textcanvas.clientWidth, affD.getBotTxt("ry") * textcanvas.clientHeight, ctx, canva.clientWidth, affD.getBotTxt("textBorderBlur"));
    }else if (!final){
        ctx.clearRect(0, 0, textcanvas.clientWidth, textcanvas.clientHeight);   
    }
    drawText(affD.getTopTxt("text"), affD.getTopTxt("sizeRatio"), x, y, ctx, canva.clientWidth, affD.getTopTxt("textBorderBlur"));
} 

function drawBotText(canva: HTMLCanvasElement, x: number, y: number, final: boolean){
    if(affD.getBotTxt("text") == ""){console.log("Missing Bottom Text"); return};
    var ctx = canva.getContext("2d");

    
    if(affD.getTopTxt("text") != "" && !final){
        ctx.clearRect(0, 0, textcanvas.clientWidth, textcanvas.clientHeight);

        affD.setBotTxt("x", x);
        affD.setBotTxt("y", y)

        drawText(affD.getTopTxt("text"), affD.getTopTxt("sizeRatio"), affD.getTopTxt("rx") * textcanvas.clientWidth, affD.getTopTxt("ry") * textcanvas.clientHeight, ctx, canva.clientWidth, affD.getTopTxt("textBorderBlur"));
    }else if (!final){
        ctx.clearRect(0, 0, textcanvas.clientWidth, textcanvas.clientHeight);
    }
    drawText(affD.getBotTxt("text"), affD.getBotTxt("sizeRatio"), x, y, ctx, canva.clientWidth, affD.getBotTxt("textBorderBlur"));
}

function initTxtPos(txtType: "top"|"bot", height: number){
    switch(txtType){
        case "top":
            return (height * (0.15 + affD.getTopTxt("sizeRatio") * 0.35));
        case "bot":
            return (height * 0.92);
    }
}

document.getElementById("textcolor").addEventListener("change", function(){
    //Changes text color on user color input
    if(affD.getTopTxt("text").length != 0){
        drawTopText(textcanvas, affD.getTopTxt("x"), affD.getTopTxt("y"), false);
    }
    if(affD.getBotTxt("text").length != 0){
        drawBotText(textcanvas, affD.getBotTxt("x"), affD.getBotTxt("y"), false);;
    }
})


function topTextHndler(e: any) {
    let ctxt = textcanvas.getContext("2d");
    ctxt.clearRect(0, 0, textcanvas.clientWidth, textcanvas.clientHeight/2);
    affD.setTopTxt("text", e.target.value.toUpperCase());
    drawTopText(textcanvas, affD.getTopTxt("rx") * textcanvas.clientWidth, affD.getTopTxt("ry") * textcanvas.clientHeight, false);
}

function botTextHndler(e: any){
    let ctxt = textcanvas.getContext("2d");
    ctxt.clearRect(0, textcanvas.clientHeight/2, textcanvas.clientWidth, textcanvas.clientHeight/2);
    affD.setBotTxt("text", e.target.value.toUpperCase());
    drawBotText(textcanvas, affD.getBotTxt("rx") * textcanvas.clientWidth, affD.getBotTxt("ry") * textcanvas.clientHeight, false);
}

var topTxt = document.getElementById("toptext") as HTMLInputElement;
var botTxt = document.getElementById("bottomtext") as HTMLInputElement;

topTxt.addEventListener('input', topTextHndler);
botTxt.addEventListener('input', botTextHndler);

topTxt.addEventListener('propertychange', topTextHndler);
botTxt.addEventListener('propertychange', botTextHndler);


var sliderTop = document.getElementById("TopRange") as HTMLInputElement; 

sliderTop.oninput = () => function() {
    //Changes TOP text size on user slider input
    affD.setTopTxt("sizeRatio", this.value/textcanvas.clientWidth);
    if(affD.getTopTxt("defaultPos")){
        let newy = initTxtPos("top", textcanvas.clientHeight);  
        affD.setTopTxt("ry", newy / textcanvas.clientHeight);
        drawTopText(textcanvas, affD.getTopTxt("x"), newy, false);
        return;
    }
    drawTopText(textcanvas, affD.getTopTxt("x") ,affD.getTopTxt("y"), false);
}

var sliderBot = document.getElementById("BotRange");

sliderBot.oninput = () => function() {
    //Changes BOTTOM text size on user slider input
    affD.setBotTxt("sizeRatio", this.value/textcanvas.clientWidth);
    drawBotText(textcanvas,  affD.getBotTxt("x"), affD.getBotTxt("y"), false);
}

var dragok = false;

function dragText(e: any){
    e.preventDefault();
    if( e.pageX < affD.getTopTxt("x") + textcanvas.clientWidth * 0.45 + document.getElementById('result').offsetLeft &&
        e.pageX > affD.getTopTxt("x") - textcanvas.clientWidth * 0.45 + document.getElementById('result').offsetLeft &&
        e.pageY < affD.getTopTxt("y") + 20 + document.getElementById('result').offsetTop &&
        e.pageY > affD.getTopTxt("y") - textcanvas.clientHeight / 4 + document.getElementById('result').offsetTop)
        {
            dragok = true;

            affD.setTopTxt("defaultPos", false);

            let tempx: number = e.pageX - document.getElementById('result').offsetLeft;
            let tempy: number = e.pageY - document.getElementById('result').offsetTop;

            let relTxtCords: number[] = [affD.getTopTxt("x") - tempx, affD.getTopTxt("y") - tempy];
            affD.setRelCord(relTxtCords); 

            //textcanvas.addEventListener('touchmove', moveTextTop);
            textcanvas.onpointermove = moveTextTop;
    }
 
    if( e.pageX < affD.getBotTxt("x") + textcanvas.clientWidth * 0.45 + document.getElementById('result').offsetLeft &&
        e.pageX > affD.getBotTxt("x") - textcanvas.clientWidth * 0.45 + document.getElementById('result').offsetLeft &&
        e.pageY < affD.getBotTxt("y") + 20 + document.getElementById('result').offsetTop &&
        e.pageY > affD.getBotTxt("y") - textcanvas.clientHeight / 4 + document.getElementById('result').offsetTop)
        {
            dragok = true;

            let tempx = e.pageX - document.getElementById('result').offsetLeft;
            let tempy = e.pageY - document.getElementById('result').offsetTop;

            let relTxtCords: number[] = [affD.getBotTxt("x") - tempx, affD.getBotTxt("y") - tempy];
            affD.setRelCord(relTxtCords); 

            //textcanvas.addEventListener('touchmove', moveTextBot);
            textcanvas.onpointermove = moveTextBot;
    }
}

function dropText(){
    if(affD.getTopTxt("defaultPos")){affD.setTopTxt("defaultPos", false)}
    if(affD.getBotTxt("defaultPos")){affD.setBotTxt("defaultPos", false)}

    affD.setRelCord([0,0])
    textcanvas.onpointermove = null;
    //textcanvas.removeEventListener("touchmove");
}

function moveTextTop(e: any){
    if (dragok){
        let x = e.pageX - document.getElementById('result').offsetLeft + affD.getRelX();
        let y = e.pageY - document.getElementById('result').offsetTop + affD.getRelY();
        affD.setTopTxt("rx", x / textcanvas.clientWidth);
        affD.setTopTxt("ry", y / textcanvas.clientHeight);
        affD.setTopTxt("x", x);
        affD.setTopTxt("y", y);

        drawTopText(textcanvas, x, y, false);
    }
}

function moveTextBot(e: any){
    if (dragok){
        let x = e.pageX - document.getElementById('result').offsetLeft + affD.getRelX();
        let y = e.pageY - document.getElementById('result').offsetTop + affD.getRelY();
        affD.setBotTxt("rx", x / textcanvas.clientWidth);
        affD.setBotTxt("ry", y / textcanvas.clientHeight);
        affD.setBotTxt("x", x);
        affD.setBotTxt("y", y);

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

    add_img(affD.getImg(), imgcanvas);
    if(affD.getBorder() != ""){setBorder(affD.getBorder(), bordercanvas, cssWidth, cssHeight);}

    drawTopText(textcanvas, affD.getTopTxt("rx") * cssWidth,affD.getTopTxt("ry") * cssHeight, false);
    drawBotText(textcanvas, affD.getBotTxt("rx") * cssWidth, affD.getTopTxt("ry") * cssHeight, false);    
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
