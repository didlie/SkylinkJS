/**
 * @constructor
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {JSON}
 */
function IceAgentStatsService(params) {
    StatsBaseService.call(this, params);
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
IceAgentStatsService.prototype._buildIceAgentStateObj = function(params) {
    params.timestamp = new Date().toISOString();
    params.app_key = this.appKey;
    params.client_id = this.client_id;
    return params;
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
IceAgentStatsService.prototype.send = function(params) {
    if(!this.enabled)
        return;

    console.log("Sending ICE agent state information.");

    new HTTP().doPost(
        this._buildURL(this.getEndpoints().iceconnection),
        this._buildIceAgentStateObj(params));
};