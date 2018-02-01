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
 * Stats ase url.
 *
 * @private
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 */
StatsBaseService.prototype._BASE_URL = 'rest/stats';

/**
 * Stats endpoints.
 *
 * @public
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 */
StatsBaseService.prototype.ENDPOINTS = {
    'client': 'client',
    'auth': 'auth',
    'signalingAuth': 'signaling',
    'signallingSocket': 'client/signaling',
    'iceconnection': 'client/iceconnection',
    'icecandidate': 'client/icecandidate',
    'negotiation': 'client/negotiation',
    'bandwidth': 'client/bandwidth',
    'recording': 'client/recording'
};