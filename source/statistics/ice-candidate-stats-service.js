/**
 * @constructor
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {JSON}
 */
function IceCandidateStatsService(params) {
    StatsBaseService.call(this, params);
};

IceCandidateStatsService.prototype = Object.create(StatsBaseService.prototype);
IceCandidateStatsService.prototype.constructor = IceCandidateStatsService;

/**
 * It builds the client ICE candidate/SDP object for the WebRTC stats.
 *
 * @method _buildData
 * @private
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {JSON} WebRTC ICE candidate object.
 * @return {JSON}
 */
IceCandidateStatsService.prototype._buildData = function(params) {
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
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @return {String} with the endpoint URL chunk. Example: client/iceconnection
 */
IceCandidateStatsService.prototype._getEndpoint = function() {
    return this.getEndpoints().client;
};