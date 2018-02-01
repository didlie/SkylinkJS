/**
 * PeerInfoStatsService constructor.
 *
 * @public
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 */
function PeerInfoStatsService(options) {
    this.appKeyOwner = options.appKeyOwner;
    this.appKey = options.appKey;
    this.enabled = options.enabled;
    this.statsUrl = options.statsUrl;
    this.client_id = options.client_id;
};

PeerInfoStatsService.prototype = Object.create(StatsBaseService.prototype);
PeerInfoStatsService.prototype.constructor = PeerInfoStatsService;

/**
 * It builds the peerInfo object (agent, media, etc).
 *
 * @method _buildPeerInfoObj
 * @private
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {MediaStream} WebRTC MediaStream
 * @return {Object} {client_id: String, app_key: String, sdk: Object, agent: Object, media: Object}
 */
PeerInfoStatsService.prototype._buildPeerInfoObj = function(mediaStream) {
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
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {MediaStream} WebRTC MediaStream
 * @return {Object} {audio: Object, video: Object}
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
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @return {Object} {name: String, version: String}
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
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @return {Object} {platform: String, name: String}
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
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {Array} WebRTC audio MediaStreamTracks
 * @return {Array} [{ id: String, stream_id: String }]
 */
PeerInfoStatsService.prototype._buildAudioTracksObj = function(audioTracks) {
    var audioMedia = [];

    try {
        for(var i = 0; i < audioTracks.length; i++)
            audioMedia.push({
                'id': audioTracks[i].id,
                'stream_id': audioTracks[i].stream_id
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
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {Array} WebRTC video MediaStreamTracks
 * @return {Object} [{ id: String, stream_id: String, resolution_width: Integer, resolution_height: Integer }, ...n]
 */
PeerInfoStatsService.prototype._buildVideoTracksObj = function(videoTracks) {
    var videoMedia = [];

    try {
        for(var i = 0; i < videoTracks.length; i++)
            videoMedia.push({
                'id': videoTracks[i].id || '',
                'stream_id': videoTracks[i].stream_id || '',
                'resolution_width': videoTracks[i].resolution_width || null,
                'resolution_height': videoTracks[i].resolution_height || null
            });
    } catch (error) {
        videoMedia = [];
    }

    return videoMedia;
};


/**
 * It builds a URL concatenating statsUrl, which was set at the configuration file, plus BASE_URL
 * and the correspoiding endpoint.
 *
 * @method _buildURL
 * @private
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {String} endPoint Example: /api/stats
 * @return {String} The url with https://xxx.xxx.xxx./api/rest/stats/client'
 */
PeerInfoStatsService.prototype._buildURL = function(endPoint) {
    return this.statsUrl + '/' + this._BASE_URL + '/' + endPoint;
};

/**
 * It posts the client information (agent, media, etc).
 *
 * @method sendStats
 * @public
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {MediaStream} WebRTC MediaStream
 * @return {Object} {client_id: String, app_key: String, sdk: Object, agent: Object, media: Object}
 */
PeerInfoStatsService.prototype.sendStats = function(mediaStream) {
    if(!this.enabled)
        return;

    console.log("Sending peer information stats.");
    new HTTP().doPost(this._buildURL(this.ENDPOINTS.client), this._buildPeerInfoObj(mediaStream));
};