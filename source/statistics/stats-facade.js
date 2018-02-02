/**
 * Stats Facade constructor.
 * It creates the client_id.
 * It initialises all the stats services with the options param.
 *
 * @public
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {Object} {
 *  enabled: Boolean,
 *  statsUrl: String,
 *  appKeyOwner: String,
 *  appKey: String,
 *  selectedRoom: String
 * }
 */

function StatsFacade(options) {
    this.options = options;
    this.options.client_id = this._createClientId();

    this.peerInfoStatsService = new PeerInfoStatsService(this.options);
    this.authInfoStatsService = new AuthStatsService(this.options);
    this.clientSignallingStatsService = new ClientSignallingStatsService(this.options);
};

StatsFacade.prototype.constructor = StatsFacade;

/**
 * It sends the peer info to the server.
 *
 * @public
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {MediaStream} WebRTC media stream
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
 * @param {Object} Response from the XMLHTTPRequest for either success or error.
 */
StatsFacade.prototype.sendAuthInfo = function(response) {
    this.authInfoStatsService.send(response);
};

/**
 * It sends the client signalling info to the server.
 *
 * @public
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {Object} {
 *  room_id: String,
 *  state: String,
 *  server: String,
 *  port: Integer,
 *  transport: String,
 *  attempts: Integer
 * }
 */
StatsFacade.prototype.sendClientSignalingInfo = function(options) {
    this.clientSignallingStatsService.send(options);
};

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
    return (this.options.appKeyOwner  || 'dummy') + '_' + (Date.now() + Math.floor(Math.random() * 1000000));
};
