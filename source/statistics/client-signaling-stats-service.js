/**
 * ClientSignalingStatsService constructor.
 *
 * @public
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {JSON}
 */
function ClientSignalingStatsService(options) {
    StatsBaseService.call(this, options);
};

ClientSignalingStatsService.prototype = Object.create(StatsBaseService.prototype);
ClientSignalingStatsService.prototype.constructor = ClientSignalingStatsService;

/**
 * It builds the client signaling object for the WebRTC stats.
 *
 * @method _buildClientSignalsendAuthInfoingObj
 * @private
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {MediaStream} WebRTC MediaStream
 * @return {JSON}
 */
ClientSignalingStatsService.prototype._buildClientSignalingObj = function(options) {
    return {
        'client_id': this.client_id,
        'app_key': this.appKey,
        'room_id': options.room_id,
        'timestamp': new Date().toISOString(),
        'state': options.state,
        'server': options.server,
        'port': options.port,
        'transport': options.transport,
        'attempts': options.attempts
    };
};

/**
 * It posts the client information (socket state, transport, attempts, etc).
 *
 * @method send
 * @public
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {JSON}
 * */
ClientSignalingStatsService.prototype.send = function(options) {
    if(!this.enabled)
        return;

    console.log("Sending signaling client information.");
    new HTTP().doPost(
        this._buildURL(this.getEndpoints().clientSignaling),
        this._buildClientSignalingObj(options));
};