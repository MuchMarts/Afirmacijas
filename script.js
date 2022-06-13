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
    document.getElementsByClassName("banana")[a-1].classList.toggle("shown");
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
    }
}

//Used to save image
function saveFile(exportSize){
    save_finished_canvas(exportSize);
}
