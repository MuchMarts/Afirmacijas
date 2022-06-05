function changeType(){
    const elem = document.getElementsByClassName('banana');
    console.log(elem)
    if(elem[0].id == "0"){
        elem[0].style.objectFit = "fill";
        elem[0].id = "1";
    }
    else {
        elem[0].style.objectFit = "contain";
        elem[0].id = "0";
    }
}