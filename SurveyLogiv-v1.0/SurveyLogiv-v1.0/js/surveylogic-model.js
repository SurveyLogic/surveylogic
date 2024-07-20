//TO DO: ADD FUNCTIONALITY TO REMOVE MEASUREMENTS FROM THE LOG!


//Logging definition
//Initialize a variable to store the previous measurement data
let startingMeasurementDataToExport = {}

// Conctructor function.
function surveylogicModel() {
  "use strict";
  this.lines_ = new Array();
  this.point_angle_map_ = {}; // points to lines originating from it.
  this.current_line_ = undefined;
  this.current_angle_ = undefined;
  this.logCounter = 1; //Counter for the log (starting at measuement1)

  // -- editing operation. We start a line and eventually commit or forget it.
 
  // Start a new line but does not add it to the model yet.
  this.startEditLine = function (x, y) {
    var line = new Line(x, y, x, y);
    this.current_line_ = line;
  };
  this.hasEditLine = function () {
    return this.current_line_ != undefined;
  };
  this.getEditLine = function () {
    return this.current_line_;
  };
  this.updateEditLine = function (x, y) {
    if (this.current_line_ == undefined) return;
    this.current_line_.updatePos(x, y);
    return this.current_line_;
  };

  this.commitEditLine = function () {
    var line = this.current_line_;

    console.log("p1Measurement" + this.logCounter, line.p1, "p2Measurement" + this.logCounter, line.p2); //log measurement points after commiting
    
    //create variable to represent the measurement data
    let lineMeasurementData = {
      measurementNum : this.logCounter,
      p1x: line.p1.x,
      p1y: line.p1.y,
      p2x: line.p2.x,
      p2y: line.p2.y,
    }

    //convert the data to JSON string
    let lineMeasurementDataString = JSON.stringify(lineMeasurementData);
    console.log("Measurement Data: ", lineMeasurementDataString); //log the measurement data
    //store data locally
    window.localStorage.setItem("lineMeasurementDataString", lineMeasurementDataString);
    
    let lineMeasurementEvent = new CustomEvent('lineMeasurementAdded', { detail: lineMeasurementDataString });
    window.dispatchEvent(lineMeasurementEvent);

     this.logCounter++; //increment the counter
    
    this.lines_.push(line);
    this.current_line_ = undefined;
  };
  this.forgetEditLine = function () {
    if (this.current_line_ == undefined) return;
    this.removeAngle(this.current_line_.p1, this.current_line_);
    this.current_line_ = undefined;
  };

  this.removeAngle = function (center_point, line) {
    var key = center_point.get_key();
    var angle_list = this.point_angle_map_[key];
    if (angle_list === undefined) return; // shrug.
    var pos = -1;
    for (var i = 0; i < angle_list.length; ++i) {
      if (angle_list[i].line == line) {
        pos = i;
        break;
      }
    }
    if (pos >= 0) {
      angle_list.splice(pos, 1);
    }
  };

  // Remove a line
  this.removeLine = function (line) {
    var pos = this.lines_.indexOf(line);
    if (pos < 0) alert("Should not happen: Removed non-existent line");
    this.lines_.splice(pos, 1);
  };

  // Find the closest line to the given coordinate or 'undefined', if they
  // are all too remote.
  this.findClosest = function (x, y) {
    var smallest_distance = undefined;
    var selected_line = undefined;
    this.forAllLines(function (line) {
      var this_distance = line.distanceToCenter(x, y);
      if (smallest_distance == undefined || this_distance < smallest_distance) {
        smallest_distance = this_distance;
        selected_line = line;
      }
    });
    if (selected_line && smallest_distance < 50) {
      return selected_line;
    }
    return undefined;
  };

  // Iterate over all lines; Callback needs to accept a line.
  this.forAllLines = function (cb) {
    for (var i = 0; i < this.lines_.length; ++i) {
      cb(this.lines_[i]);
    }
  };

  this.forAllArcs = function (cb) {
    for (var key in this.point_angle_map_) {
      if (!this.point_angle_map_.hasOwnProperty(key)) continue;
      var angle_list = this.point_angle_map_[key];
      if (angle_list.length < 2) continue;
      angle_list.sort(function (a, b) {
        return a.angle - b.angle;
      });
      for (var i = 0; i < angle_list.length; ++i) {
        var a = angle_list[i],
          b = angle_list[(i + 1) % angle_list.length];
        if (!a.is_valid || !b.is_valid) continue;
        var arc = new Arc(a, b);
        if (arc.angleInDegrees() >= 180.0) continue;
        cb(arc);
      }
    }
  };
}
//Export Measurement Lines

