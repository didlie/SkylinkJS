/**
 * @constructor
 * @since 0.6.x
 * @param {JSON}
 */
function NegotiationStatsService(params) {
    StatsBaseService.call(this, params);
};

NegotiationStatsService.prototype = Object.create(StatsBaseService.prototype);
NegotiationStatsService.prototype.constructor = NegotiationStatsService;

/**
 * It builds the SDP negotiation object. It has the signaling negotiation state,
 * weight, and sdp information.
 *
 * @method buildData
 * @private
 * @since 0.6.x
 * @param {JSON} SDP negotiation state object.
 * @return {JSON}
 */
NegotiationStatsService.prototype._buildData = function(params) {
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
NegotiationStatsService.prototype._getEndpoint = function() {
    return this.getEndpoints().client;
};