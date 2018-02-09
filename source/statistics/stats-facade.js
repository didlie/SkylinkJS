
/**
 * This is the entry point to the Statistics module.
 *
 * @constructor
 * @since 0.6.x
 * @param {JSON}
 */

function StatsFacade(params) {
    this._params = params;
    this._params.client_id = this._createClientId();

    this.peerInfoStatsService = new PeerInfoStatsService(this._params);
    this.authInfoStatsService = new AuthStatsService(this._params);
    this.clientSignalingStatsService = new ClientSignalingStatsService(this._params);
    this.iceAgentStatsService = new IceAgentStatsService(this._params);
    this.iceCandidateStatsService = new IceCandidateStatsService(this._params);
    this.negotiationStatsService = new NegotiationStatsService(this._params);
};

StatsFacade.prototype.constructor = StatsFacade;

/**
 * It creates the client id concatenating (this.appKeyOwner || 'dummy') _ + Date.now() + a random number.
 * The why of the dummy data is because the skilink.init() is executed twice. During the first
 * execution it does not retrive the apiKeyOwner; however, in the second execution it retrieves
 * the API owner.
 *
 * @method _createClientId
 * @private
 * @since 0.6.x
 * @return {String} Client id
 */
StatsFacade.prototype._createClientId = function() {
    return (this._params.appKeyOwner  || 'dummy') + '_' + (Date.now() + Math.floor(Math.random() * 1000000));
};

/**
 * It sends the peer info to the server.
 *
 * @method sendPeerInfo
 * @public
 * @since 0.6.x
 * @param {MediaStream} WebRTC media stream.
 */
StatsFacade.prototype.sendPeerInfo = function(mediaStream) {
    this.peerInfoStatsService.send(mediaStream);
};

/**
 * It sends the auth info to the server.
 *
 * @method sendAuthInfo
 * @public
 * @since 0.6.x
 * @param {JSON} Response from the XMLHTTPRequest for either success or error.
 */
StatsFacade.prototype.sendAuthInfo = function(response) {
    this.authInfoStatsService.send(response);
};

/**
 * It sends the client signaling info to the server.
 *
 * @method sendClientSignalingInfo
 * @public
 * @since 0.6.x
 * @param {JSON}
 */
StatsFacade.prototype.sendClientSignalingInfo = function(params) {
    this.clientSignalingStatsService.send(params);
};

/**
 * It sends ICE Agent state information.
 *
 * @method sendIceAgentInfo
 * @public
 * @since 0.6.x
 * @param {JSON}
 */
StatsFacade.prototype.sendIceAgentInfo = function(params) {
    this.iceAgentStatsService.send(params);
};

/**
 * It sends ICE Candidate/SDP state information.
 *
 * @method sendIceCandidateAndSDPInfo
 * @public
 * @since 0.6.x
 * @param {JSON}
 */
StatsFacade.prototype.sendIceCandidateAndSDPInfo = function(params) {
    this.iceAgentStatsService.send(params);
};

/**
 * It sends negotiation information.
 *
 * @method sendNegotiationInfo
 * @public
 * @since 0.6.x
 * @param {JSON}
 */
StatsFacade.prototype.sendNegotiationInfo = function(params) {
    this.negotiationStatsService.send(params);
};
