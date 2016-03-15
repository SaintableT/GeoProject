var fs = require('fs');
var util = require('util');

//var datahull = fs.readFileSync("./convex-hull.geojson");
//var objhull = JSON.parse(datahull);
//var objfeats = objhull.geometry.coordinates[0];

var data = fs.readFileSync("./master-polygon.geojson");
var obj = JSON.parse(data);
//var feats = obj.features[0].geometry.coordinates[0];

var feats;
for (var i = 0; i < (obj.features).length ; i++) {
	feats = obj.features[i].geometry.coordinates[0];
}

//Rational Bezier Curves
var bezier = function(t, w, p0, p1, p2) {
    var x = (Math.pow(1-t,2)*p0[0]+2*t*w*(1-t)*p1[0]+Math.pow(t,2)*p2[0])/(Math.pow(1-t,2)+2*t*w*(1-t)+Math.pow(t,2));
	var y = (Math.pow(1-t,2)*p0[1]+2*t*w*(1-t)*p1[1]+Math.pow(t,2)*p2[1])/(Math.pow(1-t,2)+2*t*w*(1-t)+Math.pow(t,2));
	return [x,y];
};

var angle = function(p0, p1, p2) {
    var p0p1 = Math.pow(p1[0]-p0[0],2)+Math.pow(p1[1]-p0[1],2);
    var p1p2 = Math.pow(p1[0]-p2[0],2)+Math.pow(p1[1]-p2[1],2);
    var p2p0 = Math.pow(p2[0]-p0[0],2)+Math.pow(p2[1]-p0[1],2);
    return Math.acos((p0p1+p1p2-p2p0)/Math.sqrt(4*p0p1*p1p2));
};

var points = [];
for (var n = 0; n <= feats[0].length; n+=30) {
	for (var t = 0; t <= 1; t+=0.001) {
		if (angle(feats[0][n],feats[0][n+20],feats[0][n+10]) < Math.PI/2) {
			points.push(bezier(t,3,feats[0][n],feats[0][n+10],feats[0][n+20]));
		}
	}
}

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

var linestring = JSON.stringify(attributes);

fs.writeFile('smooth.geojson', linestring, function (err) {
	if (err) {
		return console.log(err);
	}
});