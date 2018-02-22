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
 * It builds a URL concatenating statsURL, which was set at the configuration file, plus /rest/stas/
 * and the corresponding endpoint.
 *
 * @method _buildStatsURL
 * @private
 * @since 0.6.30
 * @param {String} endPoint Example: /client/recording
 * @return {String} The url with https://xxx.xxx.xxx./api/rest/stats/client'
 */
Skylink.prototype._buildStatsURL = function(endPoint) {
    return this._initOptions.forceSSL ? 'https:' : 'http:' + this._initOptions.statsURL + '/rest/stats/' + endPoint;
};

/**
 * It sends the information to the stats server executing a POST call.
 *
 * @private
 * @method _sendStatsInfo
 * @since 0.6.30
 * @param {String} Service endpoint chunk URL E.g. client/signaling.
 * @param {JSON} Any data to be sent to the stats server. It will be
 */
Skylink.prototype._sendStatsInfo = function(endpoint, data) {
    try {
        if(!this._initOptions.enableStats) {
            return;
        }

        HTTP.doPost(this._buildStatsURL(endpoint), data);
    } catch(error) {
        log.error('Statistics module failed sending datas.', error);
    }
};

/**
 * It creates the client id concatenating (this.appKeyOwner || 'dummy') _ + Date.now() + a random number.
 *
 * @method _createClientIdStats
 * @private
 * @since 0.6.30
 * @return {String} Client id
 */
Skylink.prototype._createClientIdStats = function() {
    return (this._appKeyOwner  || 'dummy') + '_' + (Date.now() + Math.floor(Math.random() * 1000000));
};

/**
 * It sends the peer information to the stats server.
 *
 * @method sendPeerInfoStats
 * @public
 * @since 0.6.30
 * @param {MediaStream} WebRTC media stream.
 */
Skylink.prototype.sendPeerInfoStats = function(mediaStream) {
    // It builds the AudioMedia object from the WebRTC media stream.
    var audioMedia = [];
    var audioTracks = mediaStream.getAudioTracks();

    try {
        for(var i = 0; i < audioTracks.length; i++) {
            audioMedia.push({
                'id': audioTracks[i].id || null,
                'stream_id': mediaStream.id|| null,
            });
        }
    } catch(error) {
        audioMedia = [];
    }

    // It builds the VideoMedia object.
    var videoMedia = [];
    var videoTracks = mediaStream.getVideoTracks();

    try {
        for(var i = 0; i < videoTracks.length; i++) {
            videoMedia.push({
                'id': videoTracks[i].id || null,
                'stream_id': mediaStream.id|| null,
                'resolution_width': videoTracks[i].resolution_width || null,
                'resolution_height': videoTracks[i].resolution_height || null
            });
        }
    } catch (error) {
        videoMedia = [];
    }

    // It builds the entire object.
    var data = {
        'client_id': this._clientIdStats,
        'app_key': this._initOptions.appKey,
        'timestamp': new Date().toISOString(),
        'username': this._appKeyOwner,
        'sdk': {
            'name': this.SDK_TYPE,
            'version': this.VERSION
        },
        'agent': {
            'name': AdapterJS.webrtcDetectedBrowser,
            'version': AdapterJS.webrtcDetectedVersion || 0,
            'platform': navigator.platform,
            'platform': window.navigator.platform || null,
            'plugin_version': AdapterJS.WebRTCPlugin.plugin ? AdapterJS.WebRTCPlugin.plugin.VERSION : null
        },
        'media': {
            'audio': audioMedia,
            'video': videoMedia
        }
    };

    log.info(['Sending Peer info stats to endpoint: ' + this._statsEndpoints.client], data);

    this._sendStatsInfo(this._statsEndpoints.client, data);
};

/**
 * It sends the authentication information to the stats server.
 *
 * @method sendAuthInfoStats
 * @public
 * @since 0.6.30
 * @param {JSON} Response from the XMLHTTPRequest for either success or error.
 */
Skylink.prototype.sendAuthInfoStats = function(apiResult) {
    var data = {
        'client_id': this._clientIdStats,
        'app_key': this._initOptions.appKey,
        'room_id': this._selectedRoom,
        'timestamp': new Date().toISOString(),
        'api_url': this._initOptions.statsURL,
        'api_result': JSON.stringify(apiResult)
    };

    log.info('Sending Auth info stats to endpoint: ' + this._statsEndpoints.auth, data);

    this._sendStatsInfo(this._statsEndpoints.auth, data);
};

/**
 * It sends the client signaling information to the stats server.
 *
 * @method sendClientSignalingInfoStats
 * @public
 * @since 0.6.30
 * @param {String} The current signaling state.
 */
Skylink.prototype.sendClientSignalingInfoStats = function(currentSignalingState) {
    var data = {
        'client_id': this._clientIdStats,
        'app_key': this._initOptions.appKey,
        'timestamp': new Date().toISOString(),
        'room_id': this._selectedRoom,
        'state': currentSignalingState,
        'protocol': this._signalingServerProtocol,
        'server': this._signalingServer,
        'port': this._signalingServerPort,
        'transport': this._socketSession.transportType,
        'attempts': this._socketSession.attempts
    };

    log.info('Sending client Signaling info stats to endpoint: ' + this._statsEndpoints.clientSignaling, data);

    this._sendStatsInfo(this._statsEndpoints.clientSignaling, data);
};

/**
 * It sends ICE Agent state information to the stats server.
 * It gather the peerConnection.getStats() and the change of state
 * in the WebRTC agent.
 *
 * @method sendIceAgentInfo
 * @public
 * @since 0.6.30
 * @param {JSON} Selected candidate from _retrieveStats function.
 */
Skylink.prototype.sendIceAgentInfo = function(selectedCandidate, iceConnectionState) {
    var data = {
        'client_id': this._clientIdStats,
        'app_key': this._initOptions.appKey,
        'room_id': this._selectedRoom,
        'timestamp': new Date().toISOString(),
        'user_id': this._user.uid,
        'peer_id': this._socket.id,
        'state': iceConnectionState,
        'is_trickle': this._initOptions.enableIceTrickle,
        'local_candidate': this._buildCandidateInfoForIceAgentState(selectedCandidate.local),
        'remote_candidate': this._buildCandidateInfoForIceAgentState(selectedCandidate.remote)
    };

    log.info('Sending ICE agent info stats to endpoint: ' + this._statsEndpoints.iceconnection, data);

    this._sendStatsInfo(this._statsEndpoints.iceconnection, data);
};

/**
 * It builds the candidate information object.
 *
 * @method _buildCandidateInfoForIceAgentState
 * @private
 * @since 0.6.30
 * @param {RTCCandidate}
 * @return {JSON}
 */
Skylink.prototype._buildCandidateInfoForIceAgentState = function(candidate) {
    if(candidate) {
        return {
            address: candidate.ipAddress,
            port: candidate.portNumber,
            candidateType: candidate.candidateType,
            network_type: candidate.networkType || null,
            transport: candidate.protocol,
            priority: candidate.priority
        }
    }
};

/**
 * It sends the peer ICE candidate information to the stats server.
 *
 * @method sendIceCandidateAndSDPInfoStats
 * @public
 * @since 0.6.30
 * @param {RTCIceCandidate}
 * @param {String}
 * @param {String}
 */
Skylink.prototype.sendIceCandidateAndSDPInfoStats = function(candidate, state, errorMsg) {
    var data = {
        'client_id': this._clientIdStats,
        'app_key': this._initOptions.appKey,
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
    };

    log.info('Sending ICE candidate info stats to endpoint: ' + this._statsEndpoints.icecandidate, data);

    this._sendStatsInfo(this._statsEndpoints.icecandidate, data);
};

 /**
 * It sends peer negotiation status information to the stats server.
 *
 * @method sendNegotiationInfoStats
 * @public
 * @since 0.6.30
 * @param {String} Negotiation State.
 * @param {String} Weight given when enter the room.
 * @param {String} SDP
 * @param {String} SDP Type
 * @param {String} Error message
 */
Skylink.prototype.sendNegotiationInfoStats = function(state, weight, sdp, sdpType, errorStr) {
    var data = {
        'client_id': this._clientIdStats,
        'app_key': this._initOptions.appKey,
        'room_id': this._selectedRoom,
        'timestamp': new Date().toISOString(),
        'user_id': this._user.uid,
        'peer_id': this._socket.id,
        'state': state,
        'error': errorStr || null,
        'weight': weight,
        'sdp_type': sdpType || null,
        'sdp_sdp': sdp || null
    };

    log.info('Sending negotiation info stats to endpoint: ' + this._statsEndpoints.negotiation, data);
    this._sendStatsInfo(this._statsEndpoints.negotiation, data);
};