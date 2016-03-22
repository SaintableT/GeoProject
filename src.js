/**
 * We need the package fs to read the file and write to a file.
 */

var fs = require('fs');

/**
 * The code below is supposed to read in the GeoJSON file called
 * master-polygon and the and converts the polygon into an object
 * so that we can access the attributes within the object since
 * the GeoJSON file is made up of a feature collection with multiple
 * features, and within those features contain geometries,
 * specificall points.
 */

var data = fs.readFileSync("./master-polygon.geojson");
var obj = JSON.parse(data);

/**
 * The code below is supposed to loop through all the features in the
 * GeoJSON object and then the feats variable can be used to modify
 * the GeoJSON file.
 */
var feats;
for (var i = 0; i < (obj.features).length ; i++) {
	feats = obj.features[i].geometry.coordinates[0];
}

/**
 * The function below is supposed to make Bezier curves out of the points
 * from the GeoJSON files. The goal is to implement this on any complex
 * GeoJSON FeatureCollection rather than just one feature. t is the 
 * precision of the curves and p0, p1, and p2 are the three points.
 */
var bezier = function(t, p0, p1, p2) {
    var x = (Math.pow(1-t,2)*p0[0]+2*t*(1-t)*p1[0]+Math.pow(t,2)*p2[0]);
	var y = (Math.pow(1-t,2)*p0[1]+2*t*(1-t)*p1[1]+Math.pow(t,2)*p2[1]);
	return [x,y];
};

/**
 * The function below is supposed to take in a set of three points a specified
 * distance away from each other and return the angle that those three points
 * made. This function is meant to be used to return all angles inside any given
 * polygons.
 */
var angle = function(p0, p1, p2) {
    var p0p1 = Math.pow(p1[0]-p0[0],2)+Math.pow(p1[1]-p0[1],2);
    var p1p2 = Math.pow(p1[0]-p2[0],2)+Math.pow(p1[1]-p2[1],2);
    var p2p0 = Math.pow(p2[0]-p0[0],2)+Math.pow(p2[1]-p0[1],2);
    var angle = Math.acos((p0p1+p1p2-p2p0)/Math.sqrt(4*p0p1*p1p2));
    return angle;
};

/**
 * The following nested for loop is supposed to loop through the function called
 * bezier and it's supposed to return a modified version of the original GeoJSON
 * points using the feats variable. The inner loop is supposed to loop through the
 * function and the points while the outer loop's role is to run the inner loop a
 * specified number of times.
 */
var points = [];
for (var n = 0; n <= feats[0].length; n+=75) {
	for (var t = 0; t <= 1; t+=0.001) {
		if (angle(feats[0][n],feats[0][n+50],feats[0][n+25]) < Math.PI) {
			points.push(bezier(t,feats[0][n],feats[0][n+25],feats[0][n+50]));
		}
	}
}

/**
 * The following object is supposed to turn the points acquired from the nested for
 * loop above into a GeoJSON FeatureCollection. It uses the same properties as the
 * original GeoJSON files given.
 */
var attributes = {
    "type": "FeatureCollection",
    "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:EPSG::3857" } },
    "features": [{
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [points]
        }
    }]
};

/**
 * The following lines of code are supposed to turn the GeoJSON object into a string in
 * order to output the information into a file. fs.writeFile deals with outputting the 
 * object to a new GeoJSON file.
 */
var linestring = JSON.stringify(attributes);

fs.writeFile('smooth.geojson', linestring, function (err) {
	if (err) {
		return console.log(err);
	}
});