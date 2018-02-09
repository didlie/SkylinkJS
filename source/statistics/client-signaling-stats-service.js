/**
 * @constructor
 * @since 0.6.x
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
 * @since 0.6.x
 * @param {MediaStream} WebRTC MediaStream
 * @return {JSON}
 */
ClientSignalingStatsService.prototype._buildData = function(params) {
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
 * It gets the endpoint that corresponde to this service.
 *
 * @method _getEndpoint
 * @public
 * @since 0.6.x
 * @return {String} with the endpoint URL chunk. Example: client/iceconnection
 */
ClientSignalingStatsService.prototype._getEndpoint = function() {
    return this.getEndpoints().client;
};