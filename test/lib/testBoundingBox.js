var BoundingBox = require('../../lib/boundingBox.js');

describe('BoundingBox tests', function() {

  it('should create a BoundingBox', function() {
    var bb = new BoundingBox(0, 1, 2, 3);
    bb.minLongitude.should.be.equal(0);
    bb.maxLongitude.should.be.equal(1);
    bb.minLatitude.should.be.equal(2);
    bb.maxLatitude.should.be.equal(3);
  });

  it('should duplicate a BoundingBox', function() {
    var bb = new BoundingBox(0, 1, 2, 3);
    var bb2 = new BoundingBox(bb);
    bb2.minLongitude.should.be.equal(0);
    bb2.maxLongitude.should.be.equal(1);
    bb2.minLatitude.should.be.equal(2);
    bb2.maxLatitude.should.be.equal(3);
  });

  it('should be equal to another BoundingBox', function() {
    var bb = new BoundingBox(0, 1, 2, 3);
    var bb2 = new BoundingBox(0, 1, 2, 3);
    bb.equals(bb2).should.be.equal(true);
  });

  it('should not be equal to another undefined', function() {
    var bb = new BoundingBox(0, 1, 2, 3);
    bb.equals(undefined).should.be.equal(false);
  });

  it('should be equal to itself', function() {
    var bb = new BoundingBox(0, 1, 2, 3);
    bb.equals(bb).should.be.equal(true);
  });

  it('should project the BoundingBox', function() {
    var bb = new BoundingBox(0, 1, 2, 3);
    var projected = bb.projectBoundingBox('EPSG:4326', 'EPSG:3857');
    projected.minLongitude.should.be.equal(0);
    projected.maxLongitude.should.be.equal(111319.49079327357);
    projected.minLatitude.should.be.equal(222684.20850554455);
    projected.maxLatitude.should.be.equal(334111.1714019597);
  });

  it('should return the BoundingBox due to no projection', function() {
    var bb = new BoundingBox(0, 1, 2, 3);
    var projected = bb.projectBoundingBox('EPSG:4326');
    projected.minLongitude.should.be.equal(0);
    projected.maxLongitude.should.be.equal(1);
    projected.minLatitude.should.be.equal(2);
    projected.maxLatitude.should.be.equal(3);
  });

});
