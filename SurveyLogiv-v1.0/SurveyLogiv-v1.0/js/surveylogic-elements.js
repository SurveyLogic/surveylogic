// Some useful function to have :)
function euklid_distance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

function Point(x, y) {
  this.update = function (x, y) {
    this.x = x;
    this.y = y;
  };

  // key to be used in hash tables.
  this.get_key = function () {
    return this.x + ":" + this.y;
  };

  this.update(x, y);
}

function Line(x1, y1, x2, y2) {
  // The canvas coordinate system numbers the space _between_ pixels
  // as full coordinage. Correct for that.
  this.p1 = new Point(x1 + 0.5, y1 + 0.5);
  this.p2 = new Point(x2 + 0.5, y2 + 0.5);
  


  // While editing: updating second end of the line.
  this.updatePos = function (x2, y2) {
    this.p2.update(x2 + 0.5, y2 + 0.5);
  };


  // Helper for determining selection: how far is the given position from the
  // center text.
  this.distanceToCenter = function (x, y) {
    var centerX = (this.p1.x + this.p2.x) / 2;
    var centerY = (this.p1.y + this.p2.y) / 2;
    return euklid_distance(centerX, centerY, x, y);
  };

  this.length = function () {
    return euklid_distance(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
  };
}

