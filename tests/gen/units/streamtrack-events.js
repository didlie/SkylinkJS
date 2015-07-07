/*! skylinkjs - v1.0.0 - Mon Jul 06 2015 11:09:33 GMT+0800 (SGT) */

//mocha.bail();
//mocha.run();

var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;

/* Test timeouts */
var testTimeout = 35000;
var gUMTimeout = 25000;
var testItemTimeout = 4000;

/* Shared functions */
// Checking the bytes of the canvas
var checkCanvas = function (ctx, width, height) {
  var nimg = ctx.getImageData(0, 0, width, height);

  var d = nimg.data;

  var i;

  for (i = 0; i < d.length; i += 4) {
    var r = d[i];
    var g = d[i + 1];
    var b = d[i + 2];

    if (r !== 0 || g !== 0 || b !== 0) {
      return true;
    }
  }

  return false;
};

// Drawing into a canvas using video
var drawCanvas = function (v, callback) {
  var draw = function (v,c,w,h) {
    if(v.paused || v.ended) {
      return false;
    }
    c.drawImage(v,0,0,w,h);
    setTimeout(draw,20,v,c,w,h);
  };

  var canvas = document.getElementById('test');

  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'test';
    document.body.appendChild(canvas);
  }

  var context = canvas.getContext('2d');

  var cw = Math.floor(canvas.clientWidth);
  var ch = Math.floor(canvas.clientHeight);
  canvas.width = cw;
  canvas.height = ch;

  draw(v,context,cw,ch);

 setTimeout(function () {
   v.pause();

   callback( checkCanvas(context, cw, ch) );
 }, 50);
};

/* Template */
describe('streamtrack | events', function () {
  this.timeout(testTimeout + 2000);
  this.slow(2000);

  var stream = null;
var audioTrack = null;

describe('#on("streaming"', function () {

  it('has the correct payload', function (done) {
    this.timeout(testItemTimeout);

    stream = new Stream();

    stream.once('streaming', function () {
      audioTrack = stream.getAudioTracks()[0];

      audioTrack.once('streaming', function (payload) {
        expect(payload).to.deep.equal({});
        done();
      });
    });

    stream.start({ audio: true, video: true });
  });
});

describe('#on("mute"', function () {

  it('has the correct payload', function (done) {
    this.timeout(testItemTimeout);

    audioTrack.once('mute', function (payload) {
      expect(payload).to.deep.equal({});
      done();
    });

    audioTrack.mute();
  });

});

describe('#on("unmute"', function () {

  it('has the correct payload', function (done) {
    this.timeout(testItemTimeout);

    audioTrack.once('unmute', function (payload) {
      expect(payload).to.deep.equal({});
      done();
    });

    audioTrack.unmute();
  });

});

describe('#on("stopped"', function () {

  it('has the correct payload', function (done) {
    this.timeout(testItemTimeout);

    audioTrack.once('stopped', function (payload) {
      expect(payload).to.deep.equal({});
      done();
    });

    audioTrack.stop();
  });

});
});