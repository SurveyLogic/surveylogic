function buildHtmlTable() {
    
    var myList = JSON.parse(localStorage.getItem("transformedLineDataArrayController"));
    console.log("build html table function", myList);

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
}
}