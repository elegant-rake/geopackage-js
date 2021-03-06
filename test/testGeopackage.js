var GeoPackage = require('../index.js');

var path = require('path')
  , should = require('chai').should();

describe('GeoPackageAPI tests', function() {

  var existingPath = path.join(__dirname, 'fixtures', 'rivers.gpkg');
  var geopackageToCreate = path.join(__dirname, 'tmp', 'tmp.gpkg');


  it.only('should open the geopackage', function(done) {
    GeoPackage.openGeoPackage(existingPath, function(err, geopackage) {
      should.not.exist(err);
      should.exist(geopackage);
      done();
    });
  });

  it('should create a geopackage', function(done) {
    GeoPackage.createGeoPackage(geopackageToCreate, function(err, gp) {
      should.not.exist(err);
      should.exist(gp);
      done();
    });
  });

  describe('should operate on a new geopackage', function() {
    var geopackage;
    beforeEach(function(done) {
      GeoPackage.createGeoPackage(geopackageToCreate, function(err, gp) {
        geopackage = gp;
        done();
      });
    });

    it('should create a feature table', function(done) {
      var columns = [];

      var FeatureColumn = GeoPackage.FeatureColumn;
      var GeometryColumns = GeoPackage.GeometryColumns;
      var DataTypes = GeoPackage.DataTypes;

      var tableName = 'features';

      var geometryColumns = new GeometryColumns();
      geometryColumns.table_name = tableName;
      geometryColumns.column_name = 'geometry';
      geometryColumns.geometry_type_name = 'GEOMETRY';
      geometryColumns.z = 0;
      geometryColumns.m = 0;

      columns.push(FeatureColumn.createPrimaryKeyColumnWithIndexAndName(0, 'id'));
      columns.push(FeatureColumn.createColumnWithIndexAndMax(7, 'test_text_limited.test', DataTypes.GPKGDataType.GPKG_DT_TEXT, 5, false, null));
      columns.push(FeatureColumn.createColumnWithIndexAndMax(8, 'test_blob_limited.test', DataTypes.GPKGDataType.GPKG_DT_BLOB, 7, false, null));
      columns.push(FeatureColumn.createGeometryColumn(1, 'geometry', 'GEOMETRY', false, null));
      columns.push(FeatureColumn.createColumnWithIndex(2, 'test_text.test', DataTypes.GPKGDataType.GPKG_DT_TEXT, false, ""));
      columns.push(FeatureColumn.createColumnWithIndex(3, 'test_real.test', DataTypes.GPKGDataType.GPKG_DT_REAL, false, null));
      columns.push(FeatureColumn.createColumnWithIndex(4, 'test_boolean.test', DataTypes.GPKGDataType.GPKG_DT_BOOLEAN, false, null));
      columns.push(FeatureColumn.createColumnWithIndex(5, 'test_blob.test', DataTypes.GPKGDataType.GPKG_DT_BLOB, false, null));
      columns.push(FeatureColumn.createColumnWithIndex(6, 'test_integer.test', DataTypes.GPKGDataType.GPKG_DT_INTEGER, false, ""));

      GeoPackage.createFeatureTable(geopackage, tableName, geometryColumns, columns, function(err, featureDao) {
        should.not.exist(err);
        should.exist(featureDao);
        GeoPackage.getFeatureTables(geopackage, function(err, results) {
          results.length.should.be.equal(1);
          results[0].should.be.equal(tableName);
          GeoPackage.addGeoJSONFeatureToGeoPackage(geopackage, {
            "type": "Feature",
            "properties": {
              'test_text_limited.test': 'test'
            },
            "geometry": {
              "type": "Point",
              "coordinates": [
                -99.84374999999999,
                40.17887331434696
              ]
            }
          }, tableName, function(err, id) {
            id.should.be.equal(1);
            GeoPackage.addGeoJSONFeatureToGeoPackage(geopackage, {
              "type": "Feature",
              "properties": {
                'test_text_limited.test': 'test'
              },
              "geometry": {
                "type": "Point",
                "coordinates": [
                  -99.84374999999999,
                  40.17887331434696
                ]
              }
            }, tableName, function(err, id) {
              id.should.be.equal(2);
              GeoPackage.getFeature(geopackage, tableName, 2, function(err, feature) {
                should.not.exist(err);
                should.exist(feature);
                feature.id.should.be.equal(2);
                should.exist(feature.geometry);
                var count = 0;
                GeoPackage.iterateGeoJSONFeaturesFromTable(geopackage, tableName, function(err, feature, rowCallback) {
                  count++;
                  rowCallback();
                }, function(err) {
                  count.should.be.equal(2);
                  done();
                });
              });
            });
          });
        });
      });
    });

    it('should create a tile table', function(done) {
      var columns = [];

      var TileColumn = GeoPackage.TileColumn;
      var DataTypes = GeoPackage.DataTypes;
      var BoundingBox = GeoPackage.BoundingBox;

      var tableName = 'tiles';

      var contentsBoundingBox = new BoundingBox(-180, 180, -80, 80);
      var contentsSrsId = 4326;
      var tileMatrixSetBoundingBox = new BoundingBox(-180, 180, -80, 80);
      var tileMatrixSetSrsId = 4326;

      GeoPackage.createTileTable(geopackage, tableName, contentsBoundingBox, contentsSrsId, tileMatrixSetBoundingBox, tileMatrixSetSrsId, function(err, tileMatrixSet) {
        should.not.exist(err);
        should.exist(tileMatrixSet);
        done();
      });
    });

    it('should create a standard web mercator tile table', function(done) {
      var columns = [];

      var TileColumn = GeoPackage.TileColumn;
      var DataTypes = GeoPackage.DataTypes;
      var BoundingBox = GeoPackage.BoundingBox;

      var tableName = 'tiles';

      var contentsBoundingBox = new BoundingBox(-180, 180, -80, 80);
      var contentsSrsId = 4326;
      var tileMatrixSetBoundingBox = new BoundingBox(-180, 180, -80, 80);
      var tileMatrixSetSrsId = 4326;

      GeoPackage.createStandardWebMercatorTileTable(geopackage, tableName, contentsBoundingBox, contentsSrsId, tileMatrixSetBoundingBox, tileMatrixSetSrsId, 0, 3, function(err, tileMatrixSet) {
        should.not.exist(err);
        should.exist(tileMatrixSet);
        done();
      });
    });

  });

});
