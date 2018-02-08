/**
 * @constructor
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {JSON}
 */
function AuthStatsService(params) {
    StatsBaseService.call(this, params);
};

AuthStatsService.prototype = Object.create(StatsBaseService.prototype);
AuthStatsService.prototype.constructor = AuthStatsService;


/**
 * It builds the auth stats object.
 *
 * @method _buildData
 * @private
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {JSON} XMLHttpRequest params for success or error
 * @return {JSON}
 */
AuthStatsService.prototype._buildData = function(params) {
    return {
        'client_id': this.client_id,
        'app_key': this.appKey,
        'timestamp': new Date().toISOString(),
        'api_url': this.statsUrl,
        'api_result': JSON.stringify(params)
    };
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
AuthStatsService.prototype._getEndpoint = function() {
    return this.getEndpoints().client;
};