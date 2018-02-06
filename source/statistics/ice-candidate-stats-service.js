/**
 * IceCandidateStatsService constructor.
 *
 * @public
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {JSON}
 */
function IceCandidateStatsService(options) {
    StatsBaseService.call(this, options);
};

IceCandidateStatsService.prototype = Object.create(StatsBaseService.prototype);
IceCandidateStatsService.prototype.constructor = IceCandidateStatsService;

/**
 * It builds the client ICE candidate object for the WebRTC stats.
 *
 * @method _buildIceCandidateObj
 * @private
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {JSON} WebRTC ICE candidate object.
 * @return {JSON}
 */
IceCandidateStatsService.prototype._buildIceCandidateObj = function(options) {
    options.timestamp = new Date().toISOString();
    options.app_key = this.appKey;
    options.client_id = this.client_id;
    return options;
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
IceCandidateStatsService.prototype.send = function(options) {
    if(!this.enabled)
        return;

    console.log("Sending ICE candidate information.");

    new HTTP().doPost(this._buildURL(this.getEndpoints().icecandidate),
    this._buildIceCandidateObj(options));
};