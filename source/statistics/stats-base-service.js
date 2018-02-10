/**
 * @constructor
 * @since 0.6.x
 * @param {JSON}
 */
function StatsBaseService(params) {
    this.appKey = params.appKey;
    this.enabled = params.enabled;
    this.statsUrl = params.statsUrl;
    this.client_id = params.client_id;
    this.enableStats = params.enableStats;
};

StatsBaseService.prototype.constructor = StatsBaseService;


/**
 * It builds a URL concatenating statsUrl, which was set at the configuration file, plus BASE_URL
 * and the correspoiding endpoint.
 *
 * @method _buildURL
 * @private
 * @since 0.6.x
 * @param {String} endPoint Example: /api/stats
 * @return {String} The url with https://xxx.xxx.xxx./api/rest/stats/client'
 */
StatsBaseService.prototype._buildURL = function(endPoint) {
    return this.statsUrl + '/' + this._getBaseUrl() + '/' + endPoint;
};

/**
 * Stats base url.
 *
 * @public
 * @method _getBaseUrl
 * @since 0.6.x
 * @return {String} Chunk of base URL
 */
StatsBaseService.prototype._getBaseUrl = function() {
    return 'rest/stats';
};

/**
 * Stats endpoints.
 *
 * @method getEndpoints
 * @public
 * @since 0.6.x
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
 * Template method pattern.
 *
 * It builds the data for the given params.
 * It fetches the endpoint from the concrete classes.
 * It sends the information to the stats server.
 *
 * @private
 * @method sendInfo
 * @since 0.6.x
 * @param {JSON} Any data that wants to be sent to the stats server. It will be
 * Stringified in the HTTP service class.
 */
StatsBaseService.prototype.send = function(params) {
    try {
        if(!this.enableStats)
            return;

        // Explanatory temp. variables.
        var data = this._buildData(params);
        var endpoint =  this._getEndpoint();

        HTTP.doPost(this._buildURL(endpoint), data);
    } catch(error) {
        console.log("Statistics module failed sending datas.", error);
    }

};