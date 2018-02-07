/**
 * @constructor
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {JSON}
 */
function IceCandidateStatsService(params) {
    StatsBaseService.call(this, params);
};

IceCandidateStatsService.prototype = Object.create(StatsBaseService.prototype);
IceCandidateStatsService.prototype.constructor = IceCandidateStatsService;

/**
 * It builds the client ICE candidate/SDP object for the WebRTC stats.
 *
 * @method _buildIceCandidateObj
 * @private
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {JSON} WebRTC ICE candidate object.
 * @return {JSON}
 */
IceCandidateStatsService.prototype._buildIceCandidateObj = function(params) {
    params.timestamp = new Date().toISOString();
    params.app_key = this.appKey;
    params.client_id = this.client_id;
    return params;
};

/**
 * It posts the ICE candidate information object.
 *
 * @method send
 * @public
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {JSON}
 * */
IceCandidateStatsService.prototype.send = function(params) {
    if(!this.enabled)
        return;

    console.log("Sending ICE candidate/sdp information.");

    new HTTP().doPost(
        this._buildURL(this.getEndpoints().icecandidate),
        this._buildIceCandidateObj(params));
};