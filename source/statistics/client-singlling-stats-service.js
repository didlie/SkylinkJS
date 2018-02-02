/**
 * ClientSignallingStatsService constructor.
 *
 * @public
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 */
function ClientSignallingStatsService(options) {
    this.appKey = options.appKey;
    this.enabled = options.enabled;
    this.statsUrl = options.statsUrl;
    this.client_id = options.client_id;
};

ClientSignallingStatsService.prototype = Object.create(StatsBaseService.prototype);
ClientSignallingStatsService.prototype.constructor = ClientSignallingStatsService;

/**
 * It builds the client signalling object for the WebRTC stats.
 *
 * @method _buildClientSignallingObj
 * @private
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {MediaStream} WebRTC MediaStream
 * @return {Object} { audio: Object, video: Object }
 */
ClientSignallingStatsService.prototype._buildClientSignallingObj = function(options) {
    return {
        'client_id': this.client_id,
        'app_key': this.appKey,
        'room_id': options.room_id,
        'timestamp': new Date().toISOString(),
        'state': options.state,
        'server': options.server,
        'port': options.port,
        'transport': options.transport,
        'attempts': options.attempts
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
ClientSignallingStatsService.prototype._buildURL = function(endPoint) {
    return this.statsUrl + '/' + this.getBaseUrl() + '/' + endPoint;
};

/**
 * It posts the client information (agent, media, etc).
 *
 * @method send
 * @public
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {MediaStream} WebRTC MediaStream
 * @return {Object} {client_id: String, app_key: String, sdk: Object, agent: Object, media: Object}
 */
ClientSignallingStatsService.prototype.send = function(mediaStream) {
    if(!this.enabled)
        return;

    console.log("Sending signalling client information stats.");
    new HTTP().doPost(
        this._buildURL(this.getEndpoints().clientSignaling),
        this._buildClientSignallingObj(mediaStream));
};