//  Properties
var imgcanvas = document.getElementById("image");
var bordercanvas = document.getElementById("border");
var textcanvas = document.getElementById("text");
var overlays = [
    "imgOverlay",
    "borderOverlay",
    "textOverlay"
];
window.onload = init;
var imgURL = "";
var topText = {
    text: "",
    sizeRatio: 100 / imgcanvas.clientWidth,
    textBorderBlur: 15 / textcanvas.clientWidth,
    x: textcanvas.clientWidth / 2,
    y: initTxtPos("top", textcanvas.clientHeight, 100 / imgcanvas.clientWidth),
    rx: (textcanvas.clientWidth / 2) / textcanvas.clientWidth,
    ry: initTxtPos("top", textcanvas.clientHeight, 100 / imgcanvas.clientWidth) / textcanvas.clientHeight,
    defaultPos: true
};
var botText = {
    text: "",
    sizeRatio: 100 / imgcanvas.clientWidth,
    textBorderBlur: 15 / textcanvas.clientWidth,
    x: textcanvas.clientWidth / 2,
    y: initTxtPos("bot", textcanvas.clientWidth, 100 / imgcanvas.clientWidth),
    rx: (textcanvas.clientWidth / 2) / textcanvas.clientWidth,
    ry: initTxtPos("bot", textcanvas.clientHeight, 100 / imgcanvas.clientWidth) / textcanvas.clientHeight,
    defaultPos: true
};
var relativeTxtMove = {
    x: 0,
    y: 0
};
var borderColour = "";
// Set IMG
function setImg(url) {
    imgURL = url;
}
// Get IMG
function getImg() {
    return imgURL;
}
// Set, Get any toptxt field
function setTopTxt(key, value) {
    topText[key] = value;
}
// Set, Get any bottxt field
function setBotTxt(key, value) {
    botText[key] = value;
}
function setRelCord(value) {
    relativeTxtMove.x = value[0];
    relativeTxtMove.y = value[1];
}
function getRelX() {
    return relativeTxtMove.x;
}
function getRelY() {
    return relativeTxtMove.y;
}
//Set,Get border Colour
function setBorderCol(value) {
    borderColour = value;
}
function getBorderCol() {
    return borderColour;
}
//for moving text
textcanvas.onpointerdown = dragText;
textcanvas.onpointerup = dropText;
var aspectAnchor = 0; // for 1080p whether bottom or left is 1080 px if 0 bottom if 1 side
var openOverlay = "imgOverlay";
function init() {
    var topText = document.getElementById("toptext");
    var bottomText = document.getElementById("bottomtext");
    var topRange = document.getElementById("TopRange");
    var botRange = document.getElementById("BotRange");
    var txtCol = document.getElementById("textcolor");
    topText.value = "";
    bottomText.value = "";
    topRange.value = "100";
    botRange.value = "100";
    txtCol.value = "#000000";
}
// Add image on canva
function add_img(src, canva) {
    var ctx = canva.getContext("2d");
    var img = new Image();
    img.src = src;
    img.onload = function () {
        ctx.drawImage(img, 0, 0, canva.clientWidth, canva.clientHeight);
    };
}
//Construct canva from stored data
function constructCanva(canva) {
    var ctx = canva.getContext("2d");
    if (getImg() == "") {
        setBorder(getBorderCol(), canva, canva.clientWidth, canva.clientHeight);
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0; //wtf is this???
        drawTopText(canva, topText.rx * canva.clientWidth, topText.ry * canva.clientHeight, true);
        drawBotText(canva, botText.rx * canva.clientWidth, botText.ry * canva.clientHeight, true);
        var temp = document.createElement("a");
        temp.href = canva.toDataURL();
        temp.download = "afirmacija";
        temp.click();
        temp.remove;
        canva.remove();
        return;
    }
    var img = new Image();
    img.src = getImg();
    img.onload = function () {
        ctx.drawImage(img, 0, 0, canva.clientWidth, canva.clientHeight);
        setBorder(getBorderCol(), canva, canva.clientWidth, canva.clientHeight);
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0; //wtf is this???
        drawTopText(canva, topText.rx * canva.clientWidth, topText.ry * canva.clientHeight, true);
        drawBotText(canva, botText.rx * canva.clientWidth, botText.ry * canva.clientHeight, true);
        var temp = document.createElement("a");
        temp.href = canva.toDataURL();
        temp.download = "afirmacija";
        temp.click();
        temp.remove;
        canva.remove();
    };
}
//Used to save image
function saveFile(exportSize) { downloadCanvas(exportSize); }
//Update imgAspect
function changeAspect() {
    if (aspectAnchor) {
        aspectAnchor = 0;
        return;
    }
    aspectAnchor = 1;
}
//Clear canvas
function clearCanvas(elem) {
    var ctx = elem.getContext("2d");
    ctx.clearRect(0, 0, imgcanvas.clientWidth, imgcanvas.clientHeight);
}
//Clear all
function clearAll() {
    clearCanvas(document.getElementById("image"));
    clearCanvas(document.getElementById("border"));
    clearCanvas(document.getElementById("text"));
}
// Creates final canva and exports it
function downloadCanvas(size) {
    //Create final canva element
    var anch = document.getElementById("finished");
    var new_canvas = document.createElement("canvas");
    var aspectRatio = imgcanvas.clientWidth / imgcanvas.clientHeight;
    anch.appendChild(new_canvas);
    new_canvas.id = "finalCopy";
    if (aspectAnchor) {
        //size == height
        new_canvas.width = size;
        new_canvas.height = size;
    }
    else {
        new_canvas.width = size;
        new_canvas.height = size / aspectRatio;
    }
    //Constructs canva and downloads it
    constructCanva(new_canvas);
}
//Handle image upload
function handleFiles() {
    var userFile = document.getElementById("userFile");
    var place = document.getElementById("text");
    if (!userFile.files.length) {
        place.innerHTML = "Nav failu...:(";
    }
    else if (userFile.files.length > 1) {
        place.innerHTML = "Izvēlies vienu failu pls...:(";
    }
    else {
        place.innerHTML = userFile.files[0].name + ": " + userFile.files[0].size + " biti";
        var tempUrl = URL.createObjectURL(userFile.files[0]);
        setImg(tempUrl);
        add_img(tempUrl, imgcanvas);
        var txtSpan = document.getElementById("file-chosen");
        txtSpan.textContent = userFile.files[0].name;
    }
}
//Border
function convertHex(hexCode, opacity) {
    if (opacity === void 0) { opacity = 1; }
    //code src="https://gist.github.com/danieliser/b4b24c9f772066bcf0a6.js"
    var hex = hexCode.replace('#', '');
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    var r = parseInt(hex.substring(0, 2), 16), g = parseInt(hex.substring(2, 4), 16), b = parseInt(hex.substring(4, 6), 16);
    if (opacity > 1 && opacity <= 100) {
        opacity = opacity / 100;
    }
    var rgba = [r, g, b, opacity];
    return rgba;
}
var colourPicker = document.getElementById("colorpicker");
var color = colourPicker.value;
colourPicker.addEventListener("change", function () {
    clearCanvas(bordercanvas);
    color = this.value;
    setBorderCol(color);
    setBorder(color, bordercanvas, bordercanvas.clientWidth, bordercanvas.clientHeight);
});
function setBorder(borderColour, canva, width, height) {
    //Formats and sets border with user color input
    if (borderColour == "") {
        return;
    }
    ;
    var ctxborder = canva.getContext("2d");
    var borderWidth = width / 30;
    ctxborder.fillStyle = borderColour;
    ctxborder.shadowColor = borderColour;
    ctxborder.shadowBlur = 30;
    ctxborder.fillStyle = setGradient(0, 0, 0, borderWidth, borderColour, ctxborder);
    ctxborder.shadowOffsetY = 5;
    ctxborder.fillRect(0, 0, width, borderWidth); //top
    ctxborder.fillStyle = setGradient(0, 0, borderWidth, 0, borderColour, ctxborder);
    ctxborder.shadowOffsetX = 5;
    ctxborder.fillRect(0, 0, borderWidth, height); //left
    ctxborder.fillStyle = setGradient(0, height, 0, height - borderWidth, borderColour, ctxborder);
    ctxborder.shadowOffsetY = -5;
    ctxborder.fillRect(0, height - borderWidth, width, borderWidth); //bottom
    ctxborder.fillStyle = setGradient(height, 0, height - borderWidth, 0, borderColour, ctxborder);
    ctxborder.shadowOffsetX = -5;
    ctxborder.fillRect(width - borderWidth, 0, borderWidth, height); //right
}
function setGradient(x, y, x1, y1, color, ctxb) {
    var rgba = convertHex(color, 1);
    var r = rgba[0], g = rgba[1], b = rgba[2];
    var gradient = ctxb.createLinearGradient(x, y, x1, y1);
    gradient.addColorStop(0, "rgba(".concat(r, ",").concat(g, ",").concat(b, ",1)"));
    //gradient.addColorStop(0.35, `rgba(${r},${g},${b},.95)`); //idk
    gradient.addColorStop(0.7, "rgba(".concat(r, ",").concat(g, ",").concat(b, ",.2)"));
    gradient.addColorStop(1, "rgba(".concat(r, ",").concat(g, ",").concat(b, ",0)"));
    return gradient;
}
//Text
var maxWidth = 0;
function drawText(text, fontSize, x, y, canva, size, blurRatio) {
    maxWidth = size * 0.9;
    var txtCon = canva.getContext("2d");
    //Text formatting
    txtCon.textAlign = 'center';
    //if add changable boldness
    //txtCon.font = fontWeight + ' '+ fontSize * size + 'px Work Sans';
    txtCon.font = '700 ' + fontSize * size + 'px Work Sans';
    txtCon.fillStyle = '#FFFFFF';
    var txtCol = document.getElementById("textcolor");
    txtCon.shadowColor = txtCol.value;
    txtCon.shadowBlur = blurRatio * size;
    txtCon.fillText(text, x, y, maxWidth);
    txtCon.fillText(text, x, y, maxWidth);
}
function drawTopText(canva, x, y, final) {
    if (topText.text == "") {
        console.log("Missing Top Text");
        return;
    }
    ;
    var ctx = canva.getContext("2d");
    if (botText.text != "" && !final) {
        ctx.clearRect(0, 0, textcanvas.clientWidth, textcanvas.clientHeight);
        setTopTxt("x", x);
        setTopTxt("y", y);
        drawText(botText.text, botText.sizeRatio, botText.rx * textcanvas.clientWidth, botText.ry * textcanvas.clientHeight, canva, canva.clientWidth, botText.textBorderBlur);
    }
    else if (!final) {
        ctx.clearRect(0, 0, textcanvas.clientWidth, textcanvas.clientHeight);
    }
    drawText(topText.text, topText.sizeRatio, x, y, canva, canva.clientWidth, topText.textBorderBlur);
}
function drawBotText(canva, x, y, final) {
    if (botText.text == "") {
        console.log("Missing Bottom Text");
        return;
    }
    ;
    var ctx = canva.getContext("2d");
    if (topText.text != "" && !final) {
        ctx.clearRect(0, 0, textcanvas.clientWidth, textcanvas.clientHeight);
        setBotTxt("x", x);
        setBotTxt("y", y);
        drawText(topText.text, topText.sizeRatio, topText.rx * textcanvas.clientWidth, topText.ry * textcanvas.clientHeight, canva, canva.clientWidth, topText.textBorderBlur);
    }
    else if (!final) {
        ctx.clearRect(0, 0, textcanvas.clientWidth, textcanvas.clientHeight);
    }
    drawText(botText.text, botText.sizeRatio, x, y, canva, canva.clientWidth, botText.textBorderBlur);
}
function initTxtPos(txtType, height, sizeRatio) {
    switch (txtType) {
        case "top":
            return (height * (0.15 + sizeRatio * 0.35));
        case "bot":
            return (height * 0.92);
    }
}
document.getElementById("textcolor").addEventListener("change", function () {
    //Changes text color on user color input
    if (topText.text.length != 0) {
        drawTopText(textcanvas, topText.x, topText.y, false);
    }
    if (botText.text.length != 0) {
        drawBotText(textcanvas, botText.x, botText.y, false);
        ;
    }
});
function topTextHndler(e) {
    var target = e.target;
    var ctxt = textcanvas.getContext("2d");
    ctxt.clearRect(0, 0, textcanvas.clientWidth, textcanvas.clientHeight / 2);
    setTopTxt("text", target.value.toUpperCase());
    drawTopText(textcanvas, topText.rx * textcanvas.clientWidth, topText.ry * textcanvas.clientHeight, false);
}
function botTextHndler(e) {
    var target = e.target;
    var ctxt = textcanvas.getContext("2d");
    ctxt.clearRect(0, textcanvas.clientHeight / 2, textcanvas.clientWidth, textcanvas.clientHeight / 2);
    setBotTxt("text", target.value.toUpperCase());
    drawBotText(textcanvas, botText.rx * textcanvas.clientWidth, botText.ry * textcanvas.clientHeight, false);
}
var topTxtInput = document.getElementById("toptext");
var botTxtInput = document.getElementById("bottomtext");
topTxtInput.addEventListener('input', topTextHndler);
botTxtInput.addEventListener('input', botTextHndler);
topTxtInput.addEventListener('propertychange', topTextHndler);
botTxtInput.addEventListener('propertychange', botTextHndler);
function getValueTopSlider(e) {
    //Changes TOP text size on user slider input
    setTopTxt("sizeRatio", e.target.value / textcanvas.clientWidth);
    if (topText.defaultPos) {
        var newy = initTxtPos("top", textcanvas.clientHeight, e.target.value / textcanvas.clientWidth);
        setTopTxt("ry", newy / textcanvas.clientHeight);
        drawTopText(textcanvas, topText.x, newy, false);
        return;
    }
    drawTopText(textcanvas, topText.x, topText.y, false);
}
function getValueBotSlider(e) {
    //Changes BOTTOM text size on user slider input
    setBotTxt("sizeRatio", e.target.value / textcanvas.clientWidth);
    drawBotText(textcanvas, botText.x, botText.y, false);
}
var dragok = false;
function dragText(e) {
    e.preventDefault();
    if (e.pageX < topText.x + textcanvas.clientWidth * 0.45 + document.getElementById('result').offsetLeft &&
        e.pageX > topText.x - textcanvas.clientWidth * 0.45 + document.getElementById('result').offsetLeft &&
        e.pageY < topText.y + 20 + document.getElementById('result').offsetTop &&
        e.pageY > topText.y - textcanvas.clientHeight / 4 + document.getElementById('result').offsetTop) {
        dragok = true;
        setTopTxt("defaultPos", false);
        var tempx = e.pageX - document.getElementById('result').offsetLeft;
        var tempy = e.pageY - document.getElementById('result').offsetTop;
        var relTxtCords = [topText.x - tempx, topText.y - tempy];
        setRelCord(relTxtCords);
        //textcanvas.addEventListener('touchmove', moveTextTop);
        textcanvas.onpointermove = moveTextTop;
    }
    if (e.pageX < botText.x + textcanvas.clientWidth * 0.45 + document.getElementById('result').offsetLeft &&
        e.pageX > botText.x - textcanvas.clientWidth * 0.45 + document.getElementById('result').offsetLeft &&
        e.pageY < botText.y + 20 + document.getElementById('result').offsetTop &&
        e.pageY > botText.y - textcanvas.clientHeight / 4 + document.getElementById('result').offsetTop) {
        dragok = true;
        var tempx = e.pageX - document.getElementById('result').offsetLeft;
        var tempy = e.pageY - document.getElementById('result').offsetTop;
        var relTxtCords = [botText.x - tempx, botText.y - tempy];
        setRelCord(relTxtCords);
        //textcanvas.addEventListener('touchmove', moveTextBot);
        textcanvas.onpointermove = moveTextBot;
    }
}
function dropText() {
    if (topText.defaultPos) {
        setTopTxt("defaultPos", false);
    }
    if (botText.defaultPos) {
        setBotTxt("defaultPos", false);
    }
    setRelCord([0, 0]);
    textcanvas.onpointermove = null;
    //textcanvas.removeEventListener("touchmove");
}
function moveTextTop(e) {
    if (dragok) {
        var x = e.pageX - document.getElementById('result').offsetLeft + getRelX();
        var y = e.pageY - document.getElementById('result').offsetTop + getRelY();
        setTopTxt("rx", x / textcanvas.clientWidth);
        setTopTxt("ry", y / textcanvas.clientHeight);
        setTopTxt("x", x);
        setTopTxt("y", y);
        drawTopText(textcanvas, x, y, false);
    }
}
function moveTextBot(e) {
    if (dragok) {
        var x = e.pageX - document.getElementById('result').offsetLeft + getRelX();
        var y = e.pageY - document.getElementById('result').offsetTop + getRelY();
        setBotTxt("rx", x / textcanvas.clientWidth);
        setBotTxt("ry", y / textcanvas.clientHeight);
        setBotTxt("x", x);
        setBotTxt("y", y);
        drawBotText(textcanvas, x, y, false);
    }
}
//dynamic canvas
function canvasDims(canvas) {
    var dpr = window.devicePixelRatio;
    var cssWidth = canvas.clientWidth;
    var cssHeight = canvas.clientHeight;
    var pxWidth = Math.round(dpr * cssWidth);
    var pxHeight = Math.round(dpr * cssHeight);
    return { dpr: dpr, cssWidth: cssWidth, cssHeight: cssHeight, pxWidth: pxWidth, pxHeight: pxHeight };
}
function rerender() {
    var _a = canvasDims(imgcanvas), cssWidth = _a.cssWidth, cssHeight = _a.cssHeight, pxWidth = _a.pxWidth, pxHeight = _a.pxHeight, dpr = _a.dpr;
    imgcanvas.width = pxWidth;
    imgcanvas.height = pxHeight;
    bordercanvas.width = pxWidth;
    bordercanvas.height = pxHeight;
    textcanvas.width = pxWidth;
    textcanvas.height = pxHeight;
    var ctxi = imgcanvas.getContext("2d");
    var ctxb = bordercanvas.getContext("2d");
    var ctxt = textcanvas.getContext("2d");
    ctxi.scale(dpr, dpr);
    ctxb.scale(dpr, dpr);
    ctxt.scale(dpr, dpr);
    add_img(getImg(), imgcanvas);
    if (getBorderCol() != "") {
        setBorder(getBorderCol(), bordercanvas, cssWidth, cssHeight);
    }
    drawTopText(textcanvas, topText.rx * cssWidth, topText.ry * cssHeight, false);
    drawBotText(textcanvas, botText.rx * cssWidth, botText.ry * cssHeight, false);
}
function toggleHide(elemID) {
    var elem = document.getElementById(elemID);
    for (var i = 0; i < overlays.length; i++) {
        if (!document.getElementById(overlays[i]).classList.contains("hidden")) {
            document.getElementById(overlays[i]).classList.toggle("hidden");
        }
    }
    elem.classList.toggle("hidden");
}
function updateColorPicker(btn_index) {
    var colour = document.getElementsByClassName("hiddenpicker")[btn_index].value;
    document.getElementsByClassName("styledPicker")[btn_index].style.backgroundColor = colour;
}
new ResizeObserver(function () { return rerender(); }).observe(imgcanvas);
