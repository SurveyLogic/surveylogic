

//Wait for dom to load
function svg_innit() {
    document.addEventListener('DOMContentLoaded', function () {GatherDataForDrawingLines()});


/////////////////////////////////
//CSS FORMATTING STUFF GROSS!!!//
/////////////////////////////////

//GATHER CANVAS SIZE
localStorage.getItem("gatherCanvasData");
var CanvasSize = JSON.parse(localStorage.getItem("gatherCanvasData"));
console.log("DIVCanvasSize", CanvasSize.x, CanvasSize.y);


//    //Resize the svgCanvas to the canvas size
//    var svgcanvas = document.getElementById("svgCanvasforSVG-Photo"); // Replace "yourDivId" with the actual ID of your div
//    svgcanvas.style.width = CanvasSize.x + "px";
//    svgcanvas.style.height = CanvasSize.y + "px";

//    //Resize the svgDiv to the canvas size
//    var svgdiv = document.getElementById("svgDIVforSVG-Photo"); //
//    svgdiv.style.width = CanvasSize.x + "px";
//    svgdiv.style.height = CanvasSize.y + "px";


}

function GatherDataForDrawingLines() {
    var importData = localStorage.getItem("transformedLineDataArrayController");
    var ParsedLineData = JSON.parse(importData);
    console.log(ParsedLineData);

    let measurementQuantity = ParsedLineData.length;
    
    let amendedImportData = ParsedLineData.map(data => {
        let [x1, y1] = data.x1y1.split(',');
        let [x2, y2] = data.x2y2.split(',');
        return { measurementNum: data.measurementNum, x1, y1, x2, y2 };
    });
    let JSONamendedImportData = JSON.stringify(amendedImportData);
    localStorage.setItem("LineDataXYValues", JSONamendedImportData);

console.log("amendedImportData", amendedImportData);

drawLineAsSVG(amendedImportData);
}


function drawLineAsSVG(amendedImportData) {
    document.getElementById("svgContainer");
    
    //get canvas size
    localStorage.getItem("gatherCanvasData");
    var CanvasSize = JSON.parse(localStorage.getItem("gatherCanvasData"));
    console.log("tempCanvasSize", CanvasSize.x, CanvasSize.y);


    // Create the SVG element
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('width', CanvasSize.x);
    svg.setAttribute('height', CanvasSize.y);

    document.getElementById("SVGforSVG-Photo").appendChild(svg);
    var svgforcanvas = document.getElementById("SVGforSVG-Photo");
    svgforcanvas.setAttribute('width', CanvasSize.x);
    svgforcanvas.setAttribute('height', CanvasSize.y);
    //center the svg horizontally
    svgforcanvas.style.margin = "auto";
    //center the svg vertically
    svgforcanvas.style.display = "block";


    //Set the DIV to the dize of the SVG
    var svgdiv = document.getElementById("canvas-container");
    svgdiv.style.width = CanvasSize.x
    svgdiv.style.height = CanvasSize.y


    // Create a link element
    var link = document.createElementNS("http://www.w3.org/2000/svg", "a");
    link.setAttributeNS("http://www.w3.org/1999/xlink", "href", "https://example.com");
    svg.appendChild(link);

    console.log(amendedImportData);
   // 0: {measurementNum: 1, x1: '332.5', y1: '103.5', x2: '257.5', y2: '108.5'},
   // 1: {measurementNum: 2, x1: '164.5', y1: '73.5', x2: '315.5', y2: '88.5'},
   // 2: {measurementNum: 3, x1: '242.5', y1: '78.5', x2: '237.5', y2: '130.5'},
   // 3: {measurementNum: 4, x1: '175.5', y1: '141.5', x2: '387.5', y2: '54.5'}


    // Create a line element inside the link
    amendedImportData.forEach(data => {
         //check data
    //    console.log("check data line.setAttribute x1", data.x1);
    //    console.log("check data line.setAttribute y1", data.y1);
    //    console.log("check data line.setAttribute x2", data.x2);
    //    console.log("check data line.setAttribute y2", data.y2);


        var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", data.x1);
        line.setAttribute("y1", data.y1);
        line.setAttribute("x2", data.x2);
        line.setAttribute("y2", data.y2);
        line.setAttribute("stroke", "black");
        //set line ID as "Line" + measurementNum
        line.setAttribute("id", "Line" + data.measurementNum);
        link.appendChild(line);
        console.log("Line" + data.measurementNum + "has been drawn",data.x1, data.y1, data.x2, data.y2);
    }); 
}




function resizeIMGtoAnchorMeasurements () {
    var imageSrc = localStorage.getItem("UserImage");
    var AnchorMeasurement = localStorage.getItem("AnchorMeasurement");

    var importData = localStorage.getItem("transformedLineDataArrayController");
    var ParsedLineData = JSON.parse(importData);
    console.log("from resizeIMGtoAnchorMeasurements()",  ParsedLineData);

    var imgElement = document.getElementById("UserImage");
    imgElement.src = imageSrc;
}


function resizeButton() {

    //DEFINE PPI & SCALE VALUES FROM BUTTTON ON IMAGERESIZER.HTML
    var PPI = document.getElementById("PPI").value;
    var Scale = document.getElementById("Scale").value;

    console.log("PPI", PPI);
    console.log("Scale", Scale);


    var line1 = document.getElementById("Line1");


}