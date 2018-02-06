/**
 * AuthStatsService constructor.
 *
 * @public
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {JSON}
 */
function AuthStatsService(options) {
    StatsBaseService.call(this, options);
};

AuthStatsService.prototype = Object.create(StatsBaseService.prototype);
AuthStatsService.prototype.constructor = AuthStatsService;


/**
 * It builds the auth stats object.
 *
 * @method _buildAuthObj
 * @private
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {JSON} XMLHttpRequest response for success or error
 * @return {JSON}
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
 * It sends the auth stats (api url, result, etc).
 *
 * @method send
 * @public
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @return {JSON} XMLHttpRequest response for success or error.
 */
AuthStatsService.prototype.send = function(response) {
    if(!this.enabled)
        return;

    console.log("Sending auth information.");
    new HTTP().doPost(this._buildURL(this.getEndpoints().auth), this._buildAuthObj(response));
};