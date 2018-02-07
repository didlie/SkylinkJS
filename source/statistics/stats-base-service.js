/**
 * @constructor
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {JSON}
 */
function StatsBaseService(params) {
    this.appKey = params.appKey;
    this.enabled = params.enabled;
    this.statsUrl = params.statsUrl;
    this.client_id = params.client_id;
};

StatsBaseService.prototype.constructor = StatsBaseService;

/**
 * Stats base url.
 *
 * @public
 * @method getBaseUrl
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @return {String} Chunk of base URL
 */
StatsBaseService.prototype.getBaseUrl = function() {
    return 'rest/stats';
};

/**
 * Stats endpoints.
 *
 * @method getEndpoints
 * @public
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @return {JSON} Endpoints { name: "URL chunk" }
 */
StatsBaseService.prototype.getEndpoints = function() {
    return {
        'client': 'client',
        'auth': 'auth',
        'clientSignaling': 'signaling',
        'signalingSocket': 'client/signaling',
        'iceconnection': 'client/iceconnection',
        'icecandidate': 'client/icecandidate',
        'negotiation': 'client/negotiation',
        'bandwidth': 'client/bandwidth',
        'recording': 'client/recording'
    };
};

/**
 * It builds a URL concatenating statsUrl, which was set at the configuration file, plus BASE_URL
 * and the correspoiding endpoint.
 *
 * @method _buildURL
 * @private
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {String} endPoint Example: /api/stats
 * @return {String} The url with https://xxx.xxx.xxx./api/rest/stats/client'
 */
StatsBaseService.prototype._buildURL = function(endPoint) {
    return this.statsUrl + '/' + this.getBaseUrl() + '/' + endPoint;
};