/**
 * @constructor
 * @since 0.6.x
 * @param {JSON}
 */
function IceAgentStatsService(params) {
    StatsBaseService.call(this, params);
};

IceAgentStatsService.prototype = Object.create(StatsBaseService.prototype);
IceAgentStatsService.prototype.constructor = IceAgentStatsService;

/**
 * It builds the client ICE agent state object for the WebRTC stats.
 *
 * @method _buildData
 * @private
 * @since 0.6.x
 * @param {JSON} WebRTC ICE Agent state object.
 * @return {JSON}
 */
IceAgentStatsService.prototype._buildData = function(params) {
    params.timestamp = new Date().toISOString();
    params.app_key = this.appKey;
    params.client_id = this.client_id;

    return params;
};

/**
 * It gets the endpoint that corresponde to this service.
 *
 * @method _getEndpoint
 * @public
 * @since 0.6.x
 * @return {String} with the endpoint URL chunk. Example: client/iceconnection
 */
IceAgentStatsService.prototype._getEndpoint = function() {
    return this.getEndpoints().client;
};