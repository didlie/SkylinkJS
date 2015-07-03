var Stream = function () {

  'use strict';

  var self = this;

  // This stream constraints
  self._constraints = null;

  // This stream readyState
  self.readyState = 'constructed';

  // This stream native MediaStream reference
  self._objectRef = null;

  // This stream audio tracks list
  self._audioTracks = [];

  // This stream video tracks list
  self._videoTracks = [];

  // Append events settings in here
  Event.mixin(self);
};


// getAudioTracks function. Returns AudioStreamTrack objects.
Stream.prototype.getAudioTracks = function () {
  var self = this;

  return self._audioTracks;
};

// getVideoTracks function. Returns VideoStreamTrack objects.
Stream.prototype.getVideoTracks = function () {
  var self = this;

  return self._videoTracks;
};

// stop the stream itself.
Stream.prototype.stop = function () {
  var self = this;

  try {
    self._objectRef.stop();

  } catch (error) {
    // MediaStream.stop is not implemented.
    // Stop all MediaStreamTracks

    var i, j;

    for (i = 0; i < self._audioTracks.length; i += 1) {
      self._audioTracks[i].stop();
    }

    for (j = 0; j < self._videoTracks.length; j += 1) {
      self._videoTracks[j].stop();
    }
  }

  self.readyState = 'stopped';
  self.trigger('stopped', {});
};

// attach the video element with the stream
Stream.prototype.attachStream = function (dom) {
  var self = this;

  // check if IE or Safari
  // muted / autoplay is not supported in the object element
  if (window.webrtcDetectedBrowser === 'safari' ||
    window.webrtcDetectedBrowser === 'IE') {

    // NOTE: hasAttribute is only supported from IE 8 onwards
    if (dom.hasAttribute('muted')) {
      dom.removeAttribute('muted');
    }

    if (dom.hasAttribute('autoplay')) {
      dom.removeAttribute('autoplay');
    }
  }

  dom.autoplay = true;

  console.log(dom);

  window.attachMediaStream(dom, self._objectRef);
};

// append listeners
Stream.prototype._appendListeners = function (mstream) {
  var self = this;

  self._objectRef = mstream;

  var i, j;

  var audioTracks = mstream.getAudioTracks();
  var videoTracks = mstream.getVideoTracks();

  for (i = 0; i < audioTracks.length; i += 1) {
    self._audioTracks[i] = new StreamTrack(audioTracks[i]);
  }

  for (j = 0; j < videoTracks.length; j += 1) {
    self._videoTracks[j] = new StreamTrack(videoTracks[j]);
  }

  self.readyState = 'streaming';
  self.trigger('streaming', {});
};

// initialise the stream object and subscription of events
Stream.prototype.start = function (constraints, mstream) {
  var self = this;

  // we don't manage the parsing of the stream.
  // just your own rtc getUserMedia stuff here :)
  self._constraints = constraints;

  // reset to null if undefined to have a fixed null if empty
  if (typeof self._constraints === 'undefined') {
    self._constraints = null;
  }

  if (typeof mstream === 'object' && mstream !== null) {

    if (typeof mstream.getAudioTracks === 'function' &&
      typeof mstream.getVideoTracks === 'function') {
      self._appendListeners(mstream);
      return;

    } else {
      return Util.throw(new Error('Provided mstream object is not a MediaStream object'));
    }

  } else {

    window.navigator.getUserMedia(self._constraints, function (mstreamrecv) {
      self._appendListeners(mstreamrecv);
    }, function (error) {
      // NOTE: throw is not support for older IEs (ouch)
      return Util.throw(error);
    });
  }
};