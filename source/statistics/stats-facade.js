/**
 * Stats Facade constructor.
 * It creates the client_id.
 * It initialises all the stats services with the _options param.
 *
 * @public
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {JSON}
 */

function StatsFacade(options) {
    this._options = options;
    this._options.client_id = this._createClientId();

    this.peerInfoStatsService = new PeerInfoStatsService(this._options);
    this.authInfoStatsService = new AuthStatsService(this._options);
    this.clientSignalingStatsService = new ClientSignalingStatsService(this._options);
    this.iceAgentStatsService = new IceAgentStatsService(this._options);
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
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @return {String} Client id
 */
StatsFacade.prototype._createClientId = function() {
    return (this._options.appKeyOwner  || 'dummy') + '_' + (Date.now() + Math.floor(Math.random() * 1000000));
};

/**
 * It sends the peer info to the server.
 *
 * @public
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {MediaStream} WebRTC media stream.
 */
StatsFacade.prototype.sendPeerInfo = function(mediaStream) {
    this.peerInfoStatsService.send(mediaStream);
};

/**
 * It sends the auth info to the server.
 *
 * @public
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {JSON} Response from the XMLHTTPRequest for either success or error.
 */
StatsFacade.prototype.sendAuthInfo = function(response) {
    this.authInfoStatsService.send(response);
};

/**
 * It sends the client signaling info to the server.
 *
 * @public
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {JSON}
 */
StatsFacade.prototype.sendClientSignalingInfo = function(options) {
    this.clientSignalingStatsService.send(options);
};

/**
 * It sends ICE state information.
 *
 * @public
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {JSON}
 */
StatsFacade.prototype.sendIceAgentInfo = function(options) {
    this.iceAgentStatsService.send(options);
};