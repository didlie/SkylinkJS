/**
 * Stats shared behavior constructor.
 *
 * @public
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 */
function StatsBaseService() {

};

StatsBaseService.prototype.constructor = StatsBaseService;

/**
 * Stats base url.
 *
 * @public
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
 * @public
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @return {Object} Endpoints { name: "URL chunk" }
 */
StatsBaseService.prototype.getEndpoints = function() {
    return {
        'client': 'client',
        'auth': 'auth',
        'clientSignaling': 'signaling',
        'signallingSocket': 'client/signaling',
        'iceconnection': 'client/iceconnection',
        'icecandidate': 'client/icecandidate',
        'negotiation': 'client/negotiation',
        'bandwidth': 'client/bandwidth',
        'recording': 'client/recording'
    };
};