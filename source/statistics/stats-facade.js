/**
 * Stats Facade constructor.
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
    this.options.client_id = this._createClientId(this.options.appKeyOwner);

    this.peerInfoStatsService = new PeerInfoStatsService(this.options);
    this.authInfoStatsService = new AuthStatsService(this.options);
};

StatsFacade.prototype.constructor = StatsFacade;

/**
 * It sends the peer information stats to the server.
 *
 * @public
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {MediaStream} WebRTC media stream
 */
StatsFacade.prototype.sendPeerInfo = function(mediaStream) {
    this.peerInfoStatsService.sendStats(mediaStream);
};

/**
 * It sends the auth stats to the server.
 *
 * @public
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {Object}
 */
StatsFacade.prototype.sendAuthInfo = function(response) {
    this.authInfoStatsService.sendStats(response);
};

/**
 * It creates the client id concatenating appKeyOwner _ + Date.now() + a random number.
 *
 * @method _createClientId
 * @private
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @return {String} Client id
 */
StatsFacade.prototype._createClientId = function(appKeyOwner) {
    return appKeyOwner + '_' + (Date.now() + Math.floor(Math.random() * 1000000));
};
