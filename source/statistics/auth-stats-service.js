/**
 * AuthStatsService constructor.
 *
 * @public
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 */
function AuthStatsService(options) {
    this.appKey = options.appKey;
    this.enabled = options.enabled;
    this.statsUrl = options.statsUrl;
    this.client_id = options.client_id;
};

AuthStatsService.prototype = Object.create(StatsBaseService.prototype);
AuthStatsService.prototype.constructor = AuthStatsService;

/**
 * It sends the auth stats.
 *
 * @method send
 * @public
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @return {Object} XMLHttpRequest response for success or error.
 */
AuthStatsService.prototype.send = function(response) {
    if(!this.enabled)
        return;

    console.log("Sending auth information stats.");
    new HTTP().doPost(this._buildURL(this.getEndpoints().auth), this._buildAuthObj(response));
};

/**
 * It builds the auth stats object.
 *
 * @method _buildAuthObj
 * @private
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {Object} XMLHttpRequest response for success or error
 * @return {Object} {
 *  client_id: String,
 *  app_key: String,
 *  api_url: String,
 *  api_result: String
 * }
 */
AuthStatsService.prototype._buildAuthObj = function(response) {
    return {
        'client_id': this.client_id,
        'app_key': this.appKey,
        'timestamp': new Date().toISOString(),
        'api_url': this.statsUrl,
        'api_result': JSON.stringify(response)
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
AuthStatsService.prototype._buildURL = function(endPoint) {
    return this.statsUrl + '/' + this.getBaseUrl() + '/' + endPoint;
};