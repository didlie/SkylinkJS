/**
 * @constructor
 * @since 0.6.x
 * @param {JSON}
 */
function PeerInfoStatsService(params) {
    StatsBaseService.call(this, params);
};

PeerInfoStatsService.prototype = Object.create(StatsBaseService.prototype);
PeerInfoStatsService.prototype.constructor = PeerInfoStatsService;

/**
 * It builds the peerInfo object (agent, media, etc).
 *
 * @method _buildData
 * @private
 * @since 0.6.x
 * @param {MediaStream} WebRTC MediaStream
 * @return {JSON}
 */
PeerInfoStatsService.prototype._buildData = function(mediaStream) {
    return {
        'client_id': this.client_id,
        'app_key': this.appKey,
        'timestamp': new Date().toISOString(),
        'sdk': this._buildSDKObj(),
        'agent': this._buildAgentObj(),
        'media': this._buildMediaObj(mediaStream)
    }
};

/**
 * It builds the media object for the WebRTC stats.
 *
 * @method _buildMediaObj
 * @private
 * @since 0.6.x
 * @param {MediaStream} WebRTC MediaStream
 * @return {JSON}
 */
PeerInfoStatsService.prototype._buildMediaObj = function(mediaStream) {
    return {
        'audio': this._buildAudioTracksObj(mediaStream.getAudioTracks()),
        'video': this._buildVideoTracksObj(mediaStream.getVideoTracks())
    };
};

/**
 * It builds the SDK object for the WebRTC stats.
 *
 * @method _buildSDKObj
 * @private
 * @since 0.6.x
 * @return {JSON}
 */
PeerInfoStatsService.prototype._buildSDKObj = function() {
    return {
        'name': this.SDK_TYPE,
        'version': this.VERSION
    };
};

/**
 * It builds the Agent object for the WebRTC stats.
 *
 * @method _buildAgentObj
 * @private
 * @since 0.6.x
 * @return {JSON}
 */
PeerInfoStatsService.prototype._buildAgentObj = function() {
    return {
        'platform': navigator.platform,
        'name': AdapterJS.webrtcDetectedBrowser,
        'version': AdapterJS.webrtcDetectedVersion || 0,
        'platform': window.navigator.platform || null,
        'pluginVersion': AdapterJS.WebRTCPlugin.plugin ? AdapterJS.WebRTCPlugin.plugin.VERSION : null
    };
};

/**
 * It builds the AudioTrack object for the WebRTC stats.
 *
 * @method _buildAudioTracksObj
 * @private
 * @since 0.6.x
 * @param {Array} WebRTC audio MediaStreamTracks
 * @return {Array}
 */
PeerInfoStatsService.prototype._buildAudioTracksObj = function(audioTracks) {
    var audioMedia = [];

    try {
        for(var i = 0; i < audioTracks.length; i++)
            audioMedia.push({
                'id': audioTracks[i].id || null,
                'stream_id': audioTracks[i].stream_id || null
            });
    } catch(error) {
        audioMedia = [];
    }

    return audioMedia;
};

/**
 * It builds the VideoTrack object for the WebRTC stats.
 *
 * @method _buildVideoTracksObj
 * @private
 * @since 0.6.x
 * @param {Array} WebRTC video MediaStreamTracks
 * @return {JSON}
 */
PeerInfoStatsService.prototype._buildVideoTracksObj = function(videoTracks) {
    var videoMedia = [];

    try {
        for(var i = 0; i < videoTracks.length; i++)
            videoMedia.push({
                'id': videoTracks[i].id || null,
                'stream_id': videoTracks[i].stream_id || null,
                'resolution_width': videoTracks[i].resolution_width || null,
                'resolution_height': videoTracks[i].resolution_height || null
            });
    } catch (error) {
        videoMedia = [];
    }

    return videoMedia;
};

/**
 * It gets the endpoint that corresponde to this service.
 *
 * @method _getEndpoint
 * @public
 * @since 0.6.x
 * @return {String} with the endpoint URL chunk. Example: client/iceconnection
 */
PeerInfoStatsService.prototype._getEndpoint = function() {
    return this.getEndpoints().client;
};