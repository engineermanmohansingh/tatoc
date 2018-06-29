function paintquestion() {
    var rand = Math.floor(Math.random()*7) + 1;
    var color = "";
    switch(rand){
        case 1:
            color = "violet";
            break;
        case 2:
            color = "indigo"
            break;
        case 3:
            color = "blue"
            break;
        case 4:
            color = "green"
            break;
        case 5:
            color = "yellow"
            break;
        case 6:
            color = "orange"
            break;
        case 7:
            color = "red"
            break;
        default:
            color = "black"
    }
    return(color);
}
function paintanswer() {
    var rand = Math.floor(Math.random()*7) + 1;
    var color = "";
    switch(rand){
        case 1:
            color = "violet";
            break;
        case 2:
            color = "indigo"
            break;
        case 3:
            color = "blue"
            break;
        case 4:
            color = "green"
            break;
        case 5:
            color = "yellow"
            break;
        case 6:
            color = "orange"
            break;
        case 7:
            color = "red"
            break;
        default:
            color = "black"
    }
    return(color);
}

function printgrid() {
    var clickcell = Math.floor(Math.random()*15) + 1;
    var grid = "";
    grid += "<table>";
    for(var i=0; i<4; i++){
        grid += "<tr>";
        for(var j=0; j<4; j++) {
            if(clickcell == (i*4) + j + 1 ) {
                grid += "<td><div class='greenbox' onClick=passthru();></div></td>";
            } else {
                grid += "<td><div class='redbox' onClick=failthru();></div></td>";
            }
        }
        grid += "</tr>";
    }
    grid +="</table>";
    document.write(grid);
}
