function euklid_distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
  }

transformedLineDataArray = [];
window.transformedLineDataArrayController = JSON.stringify(transformedLineDataArray);

//gather canvas data
window.addEventListener('newLoupeSizeAdded', () => {
    let gatherCanvasData = event.detail;
    console.log("gatherCanvasData after event", gatherCanvasData);
    //add to local storage
    localStorage.setItem("gatherCanvasData", gatherCanvasData);
    console.log("gatherCanvasData after local storage", localStorage.getItem("gatherCanvasData"));
});

window.addEventListener("lineMeasurementAdded", () => {
    this.measurementNum ++;
    var lineMeasurementDataString = event.detail;
    var lineMeasurementData = JSON.parse(lineMeasurementDataString);

     //ALTERT USER ONLY ONCE ABOUT AN ANCHOR MEASUREMENT
     if (window.transformedLineDataArray.length === 0) {
        alert("ANCHOR MEASUREMENT! IMPORTANT!");
    }

    var userEnteredMeasurement = prompt("Please enter the actual length of the line in inches");
    window.AnchorMeasurement = userEnteredMeasurement;
    
    //calculations for data table
    var LengthX = lineMeasurementData.p2x - lineMeasurementData.p1x;
    var LengthY = lineMeasurementData.p2y - lineMeasurementData.p1y;

    var dx_dy = LengthX/LengthY;

    var tempCanvasSize = localStorage.getItem("gatherCanvasData")
    console.log("logs.js canvasSize", canvasSize);

    var canvasSize = JSON.parse(tempCanvasSize);
    console.log("logs.js canvasSize", canvasSize);

    var ResizeVariableRatiox = Math.abs(LengthX) - userEnteredMeasurement;


    // Change structure from p1x, p1y, p2x, p2y, measurementNum to x1y1, x2y2, measurementNum
    var transformedLineData = {
        measurementNum: lineMeasurementData.measurementNum,
        x1y1: `${lineMeasurementData.p1x},${lineMeasurementData.p1y}`,
        x2y2: `${lineMeasurementData.p2x},${lineMeasurementData.p2y}`,
        euklid_distance: euklid_distance(lineMeasurementData.p1x, lineMeasurementData.p1y, lineMeasurementData.p2x, lineMeasurementData.p2y),
        dx_dy: dx_dy,
        direction: dx_dy > 1 ? "Horizontal" : "Vertical",
        actualLength: userEnteredMeasurement,
        similarity: ResizeVariableRatiox,
        canvasSize: canvasSize.x + "x" + canvasSize.y
    };

    console.log("logs.js transformedLineData", transformedLineData);

    window.transformedLineDataArray.push(transformedLineData);

    console.log("logs.js transformedLineDataArray", JSON.stringify(transformedLineDataArray));

    localStorage.setItem("transformedLineDataArrayController", JSON.stringify(transformedLineDataArray));
    console.log("logs.js myList", window.transformedLineDataArrayController);

    let UpdateDataArrayEvent = new CustomEvent('UpdateDataArray', { detail: transformedLineDataArray });
    console.log("UpdateDataArray event dispatched from logs.js");
    window.dispatchEvent(UpdateDataArrayEvent);
}); 

window.addEventListener('UpdateDataArray', function() {
    console.log('UpdateDataArray listner event fired from logs.js');
});
    
// Builds the HTML Table out of myList json data from Ivy restful service.
function buildHtmlTable() {
    //reset the table
    $("#excelDataTable").html("");

    var myList = JSON.parse(localStorage.getItem("transformedLineDataArrayController"));

    //clear local storage
localStorage.getItem("transformedLineDataArrayController");

    var columns = addAllColumnHeaders(myList);
    console.log("build html table function", myList);
    
for (var i = 0 ; i < myList.length ; i++) {
 var row$ = $('<tr/>');
 for (var colIndex = 0 ; colIndex < columns.length ; colIndex++) {
     var cellValue = myList[i][columns[colIndex]];

     if (cellValue == null) { cellValue = ""; }

     row$.append($('<td/>').html(cellValue));
 }
 $("#excelDataTable").append(row$);

 //center the excel data table
    $("#excelDataTable").css("margin", "auto");
}
}

// Adds a header row to the table and returns the set of columns.
// Need to do union of keys from all records as some records may not contain
// all records
function addAllColumnHeaders(myList)
{
var columnSet = [];
var headerTr$ = $('<tr/>');

for (var i = 0 ; i < myList.length ; i++) {
 var rowHash = myList[i];
 for (var key in rowHash) {
     if ($.inArray(key, columnSet) == -1){
         columnSet.push(key);
         headerTr$.append($('<th/>').html(key));
     }
 }
}
$("#excelDataTable").append(headerTr$);

return columnSet;
}
