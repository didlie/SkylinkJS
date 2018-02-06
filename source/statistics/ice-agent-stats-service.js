/**
 * IceAgentStatsService constructor.
 *
 * @public
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {JSON}
 */
function IceAgentStatsService(options) {
    StatsBaseService.call(this, options);
};

IceAgentStatsService.prototype = Object.create(StatsBaseService.prototype);
IceAgentStatsService.prototype.constructor = IceAgentStatsService;

/**
 * It builds the client ICE agent state object for the WebRTC stats.
 *
 * @method _buildIceAgentStateObj
 * @private
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {JSON} WebRTC ICE Agent state object.
 * @return {JSON} {
 * }
 */
IceAgentStatsService.prototype._buildIceAgentStateObj = function(options) {
    options.timestamp = new Date().toISOString();
    options.app_key = this.appKey;
    options.client_id = this.client_id;
    return options;
};

/**
 * It posts the ICE agent state information object.
 *
 * @method send
 * @public
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {JSON}
 * */
IceAgentStatsService.prototype.send = function(options) {
    if(!this.enabled)
        return;

    console.log("Sending ICE agent state information.");

    new HTTP().doPost(this._buildURL(this.getEndpoints().iceconnection),
    this._buildIceAgentStateObj(options));
};