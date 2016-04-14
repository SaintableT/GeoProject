# shrink-wrap

This project is still in progress.

A module written in node.js used for spatial data.
QGIS is required to view the spatial data.

This node.js program is supposed to shrink wrap any GeoJSON FeatureCollection.
The FeatureCollection can contain the following types of GeoJSON objects: 
MultiLineString, Polygon, and MultiPolygon. For this program to work, both
the source code and the GeoJSON file must be in the same directory. The file
is then read, and the program is executed sequentially. The program then 
outputs a file to the same directiory called called smooth.geojson. The file
smooth.geojson can then be dragged into QGIS to view.

Dependencies: hull.js
https://github.com/AndriiHeonia/hull
