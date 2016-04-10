/**
 * We need the package fs to read the file and write to a file.
 * We also need the pachage hull.js to make our alpha shape
 */

var fs = require('fs');
var hull = require('hull.js');

/**
 * The code below is supposed to read in any GeoJSON file with fs
 * then the newObject variable parses the object so that we can access
 * all the attributes within that file. The GeoJSON file that we're
 * using is called ma.geojson and it is a FeatureCollection that
 * contains multiple features where those features contain GeoJSON
 * primitives called MultiPolygons which consist of multiple polygons
 * in one feature.
 */

var data = fs.readFileSync("./ma.geojson");
var newObject = JSON.parse(data);

/**
 * The code shown below is supposed to declare a new array, loop through
 * all the features in the FeatureCollection, and gather all the points.
 * Our goal is to make an alpha shape, and we do this using hull.js.
 * hull.js does not take in GeoJSON data therefore we must change the data's
 * format to use hull(). At the end, all the points are placed in a new array
 * object called newArray for further use.
 */
var newArray = [];
for (var i=0; i<newObject.features.length; i++) {
	for (var j=0; j<newObject.features[i].geometry.coordinates[0][0].length; j++) {
		newArray[newArray.length] = newObject.features[i].geometry.coordinates[0][0][j];
	}
}

/**
 * Here is where the alpha shape is created. The function hull(object,alpha)
 * takes in an object as an array of coordinates, then an alpha that controls the
 * concavity of the shape, this can then be used to return an alpha shape.
 * At alpha equal to the number of points, hull() will return a convex hull.
 * at a lower alpha, hull will return a concave hull.
 */

var myHull = hull(newArray, 50000); // returns points of the hull (in clockwise order)

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
            "coordinates": [myHull]
        }
    }]
};

/**
 * The following lines of code are supposed to turn the GeoJSON object into a string in
 * order to output the information into a file. fs.writeFile deals with outputting the 
 * object to a new GeoJSON file.
 */

var linestring = JSON.stringify(attributes);

fs.writeFile('alpha.geojson', linestring, function (err) {
	if (err) {
		return console.log(err);
	}
});