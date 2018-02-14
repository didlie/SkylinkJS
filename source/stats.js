/**
 * Stats endpoints URL chunks.
 */
Skylink.prototype._statsEndpoints = {
    'client': 'client',
    'auth': 'auth',
    'clientSignaling': 'signaling',
    'signalingSocket': 'client/signaling',
    'iceconnection': 'client/iceconnection',
    'icecandidate': 'client/icecandidate',
    'negotiation': 'client/negotiation',
    'bandwidth': 'client/bandwidth',
    'recording': 'client/recording'
};

/**
 * It builds a URL concatenating statsURL, which was set at the configuration file, plus BASE_URL
 * and the correspoiding endpoint.
 *
 * @method _buildStatsURL
 * @private
 * @since 0.6.29
 * @param {String} endPoint Example: /api/stats
 * @return {String} The url with https://xxx.xxx.xxx./api/rest/stats/client'
 */
Skylink.prototype._buildStatsURL = function(endPoint) {
    return this._initOptions.forceSSL ? 'https:' : 'http:' + this._initOptions.statsURL + '/rest/stats/' + endPoint;
};

/**
 * It builds the data for the given params.
 * It fetches the endpoint from the concrete classes.
 * It sends the information to the stats server.
 *
 * @private
 * @method _sendStatsInfo
 * @since 0.6.29
 * @param {String} Service endpoint chunk URL E.g. client/signaling.
 * @param {JSON} Any data that wants to be sent to the stats server. It will be
 * Stringified in the HTTP service class.
 */
Skylink.prototype._sendStatsInfo = function(endpoint, data) {
    try {
        if(!this._initOptions.enableStats)
            return;

        HTTP.doPost(this._buildStatsURL(endpoint), data);
    } catch(error) {
        console.log('Statistics module failed sending datas.', error);
    }
};

/**
 * It creates the client id concatenating (this.appKeyOwner || 'dummy') _ + Date.now() + a random number.
 * The why of the dummy data is because the skilink.init() is executed twice. During the first
 * execution it does not retrive the apiKeyOwner; however, in the second execution it retrieves
 * the API owner.
 *
 * @method _createClientIDStats
 * @private
 * @since 0.6.29
 * @return {String} Client id
 */
Skylink.prototype._createClientIDStats = function() {
    return (this._appKeyOwner  || 'dummy') + '_' + (Date.now() + Math.floor(Math.random() * 1000000));
};

/**
 * It initializes the Stats module.
 * It creates a client_id.
 * This function has to be called when the room inits. During the second call Skylink will get
 * the appKeyOwner. In the first call the client_id will be a 'dummy' one.
 *
 * @method initStatsModule
 * @public
 * @since 0.6.29
 * @param {JSON} Response from the XMLHTTPRequest for either success or error.
 */
Skylink.prototype.initStatsModule = function() {
    this._clientIDStats = this._createClientIDStats();
};

/**
 * It sends the authentication stats information.
 *
 * @method sendAuthInfoStats
 * @public
 * @since 0.6.29
 * @param {JSON} Response from the XMLHTTPRequest for either success or error.
 */
Skylink.prototype.sendAuthInfoStats = function(apiResult) {
    this._sendStatsInfo(
        this._statsEndpoints.auth,
        {
            'client_id': this._clientIDStats,
            'app_key': this._initOptions.appKey,
            'timestamp': new Date().toISOString(),
            'api_url': this._initOptions.statsURL,
            'api_result': JSON.stringify(apiResult)
        }
    );
};

/**
 * It sends the client signalling stats information.
 *
 * @method sendClientSignalingInfoStats
 * @public
 * @since 0.6.29
 * @param {String}
 */
Skylink.prototype.sendClientSignalingInfoStats = function(currentState) {
    this._sendStatsInfo(
        this._statsEndpoints.clientSignaling,
        {
            'client_id': this._clientIDStats,
            'app_key': this._initOptions.appKey,
            'timestamp': new Date().toISOString(),
            'room_id': this._initOptions.defaultRoom,
            'state': currentState,
            'server': this._signalingServer,
            'port': this._signalingServerPort,
            'transport': this._socketSession.transportType,
            'attempts': this._socketSession.attempts
        }
    );
};


/**
 * It sends the peer stats information.
 *
 * @method sendPeerInfoStats
 * @public
 * @since 0.6.29
 * @param {MediaStream} WebRTC media stream.
 */
Skylink.prototype.sendPeerInfoStats = function(mediaStream) {
    // It builds the AudioMedia object.
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

    // It builds the VideoMedia object.
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

    // It builds the entire object.
    var data = {
        'client_id': this._clientIDStats,
        'app_key': this.appKey,
        'timestamp': new Date().toISOString(),
        'sdk': {
            'name': this.SDK_TYPE,
            'version': this.VERSION
        },
        'agent': {
            'platform': navigator.platform,
            'name': AdapterJS.webrtcDetectedBrowser,
            'version': AdapterJS.webrtcDetectedVersion || 0,
            'platform': window.navigator.platform || null,
            'pluginVersion': AdapterJS.WebRTCPlugin.plugin ? AdapterJS.WebRTCPlugin.plugin.VERSION : null
        },
        'media': {
            'audio': audioMedia,
            'video': videoMedia
        }
    };

    this._sendStatsInfo(this._statsEndpoints.client, data);
};

/**
 * It sends ICE Agent state information.
 * It gather the peerConnection.getStats() and the change of state
 * in the method.
 *
 * @method sendIceAgentInfo
 * @public
 * @since 0.6.29
 * @param {JSON} { statsPromise: WebRTCStats, state: String }
 */
Skylink.prototype.sendIceAgentInfo = function(options) {
    var self = this;
    var rtcStatsReport;

    options.statsPromise
    .then(function(_rtcStatsReport) {
        var localCandidates = [];
        var remoteCandidates = [];
        var state = options.state;

        rtcStatsReport = _rtcStatsReport;

        rtcStatsReport.forEach(function(entry) {
            if(entry.id.indexOf('RTCIceCandidatePair') >= 0) {
                console.log(entry)
                // Temporal and explanatory variables.
                var localCandidateEntry = rtcStatsReport.get(entry.localCandidateId);
                var remoteCandidateEntry = rtcStatsReport.get(entry.remoteCandidateId);

                // Temporal and explanatory variables.
                var localCandidateInfo = self._buildCandidateInfoForIceAgentState(localCandidateEntry);
                var remoteCandidateInfo = self._buildCandidateInfoForIceAgentState(remoteCandidateEntry);

                if(localCandidateInfo)
                    localCandidates.push(localCandidateInfo)

                if(remoteCandidateInfo)
                    remoteCandidates.push(remoteCandidateInfo)
            }
        }.bind(this));

        debugger;
        this._sendStatsInfo(
            this._statsEndpoints.iceconnection,
            {
                'client_id': this._clientIDStats,
                'app_key': this.appKey,
                'room_id': this._selectedRoom,
                'timestamp': new Date().toISOString(),
                'user_id': this._user.uid,
                'peer_id': this._socket.id,
                'state': options.state,
                'is_trickle': self._initOptions.enableIceTrickle,
                'local_candidate': JSON.stringify(localCandidates),
                'remote_candidate': JSON.stringify(remoteCandidates)
            }
        );
    })
};

/**
 * It builds the candidate informationb object.
 *
 * @method _buildCandidateInfoForIceAgentState
 * @private
 * @since 0.6.29
 * @param {RTCCandidate}
 * @return {JSON}
 */
Skylink.prototype._buildCandidateInfoForIceAgentState = function(candidate) {
    if(candidate)
        return {
            address: candidate.ip,
            port: candidate.port,
            candidateType: candidate.candidateType,
            network_type: candidate.networkType || null,
            transport: candidate.transportId,
            priority: candidate.priority
        }
};

/**
 * It sends the peer stats information.
 *
 * @method sendIceCandidateAndSDPInfoStats
 * @public
 * @since 0.6.29
 * @param {RTCIceCandidate}
 * @param {String}
 * @param {String}
 */
Skylink.prototype.sendIceCandidateAndSDPInfoStats = function(candidate, state, errorMsg) {
    this._sendStatsInfo(
        this._statsEndpoints.icecandidate,
        {
            'client_id': this._clientIDStats,
            'app_key': this.appKey,
            'room_id': this._selectedRoom,
            'timestamp': new Date().toISOString(),
            'user_id': this._user.uid,
            'peer_id': this._socket.id,
            'candidate_id': candidate.type + '_' + (new Date()).getTime(),
            'state': state,
            'sdpMid': candidate.sdpMid,
            'sdpMLineIndex': candidate.sdpMLineIndex,
            'candidate': JSON.stringify(candidate),
            'error': errorMsg || null
        }
    );
};

 /**
 * It sends peer negotiation status information.
 *
 * @method sendNegotiationInfoStats
 * @public
 * @since 0.6.29
 * @param {String}
 * @param {String}
 * @param {String}
 * @param {String}
 * @param {String}
 */
Skylink.prototype.sendNegotiationInfoStats = function(state, weight, sdp, sdpType, error) {
    this._sendStatsInfo(
        this._statsEndpoints.negotiation,
        {
            'client_id': this._clientIDStats,
            'app_key': this.appKey,
            'room_id': this._selectedRoom,
            'user_id': this._user.uid,
            'peer_id': this._socket.id,
            'state': state,
            'error': error || null,
            'weight': weight,
            'sdp_type': sdpType || null,
            'sdp_sdp': sdp || null
        }
    );
};

