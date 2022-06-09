var chance;

function randomEqualFunny(){
    chance = (Math.floor(Math.random()*100) + 1);
    console.log(chance)
    if (chance == 69)       {showYourself(4)}
    else if (chance < 33)   {showYourself(1)}
    else if (chance < 66)   {showYourself(2)} 
    else                    {showYourself(3)}
}

function showYourself(a){
    document.getElementsByClassName("banana")[a-1].classList.toggle("shown");
}

function changeType(a){
    document.getElementById(a).classList.toggle("bigBoi");
}

const randomColor = "#"+((1<<24)*Math.random()|0).toString(16);
document.documentElement.style.setProperty('--main-bg-color', randomColor);
