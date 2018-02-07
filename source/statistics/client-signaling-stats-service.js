/**
 * @constructor
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {JSON}
 */
function ClientSignalingStatsService(params) {
    StatsBaseService.call(this, params);
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
ClientSignalingStatsService.prototype._buildClientSignalingObj = function(params) {
    return {
        'client_id': this.client_id,
        'app_key': this.appKey,
        'room_id': params.room_id,
        'timestamp': new Date().toISOString(),
        'state': params.state,
        'server': params.server,
        'port': params.port,
        'transport': params.transport,
        'attempts': params.attempts
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
ClientSignalingStatsService.prototype.send = function(params) {
    if(!this.enabled)
        return;

    console.log("Sending signaling client information.");

    new HTTP().doPost(
        this._buildURL(this.getEndpoints().clientSignaling),
        this._buildClientSignalingObj(params));
};