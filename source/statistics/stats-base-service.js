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
    this.enableStats = params.enableStats;
    this.enablelogStats = params.enablelogStats;
};

StatsBaseService.prototype.constructor = StatsBaseService;


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
    return this.statsUrl + '/' + this._getBaseUrl() + '/' + endPoint;
};

/**
 * Stats base url.
 *
 * @public
 * @method _getBaseUrl
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
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
 * Template method pattern.
 *
 * It builds the data for the given params.
 * It fetches the endpoint from the concrete classes.
 * It sends the information to the stats server.
 *
 * @private
 * @method send
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {JSON} Any data that wants to be sent to the stats server. It will be
 * Stringified in the HTTP service class.
 */
StatsBaseService.prototype.send = function(params) {
    if(!this.enableStats)
        return;

    // Explanatory temp. variables.
    var data = this._buildData(params);
    var endpoint =  this._getEndpoint();

    if(this.enablelogStats)
        console.log("Sending info to stats server endpoint: " + endpoint, data);

    new HTTP().doPost(this._buildURL(endpoint), data);
};