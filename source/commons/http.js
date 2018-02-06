/**
 * HTTP Utils.
 *
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 */
function HTTP() {
    this.http = this._createXMLHttpRequest();
};

HTTP.prototype.constructor = HTTP;

/**
 * It executes a post request.
 *
 * @method doPost
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 */
HTTP.prototype.doPost = function(url, params, successCb, errorCb) {
    this._doHttpRequest('POST', url, params, successCb, errorCb);
};


/**
 * It executes an HTTP request call.
 *
 * @method _doHttpRequest
 * @private
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {String} method POST/GET/etc
 * @param {String} url Example: /api/stats
 * @param {JSON} params Any object to be sent in the request as parameter
 * @param {Function} successCb Function to be executed when the request succeed
 * @param {Function} errorCb Function to be executed when there is an error in the request
 */
HTTP.prototype._doHttpRequest = function(method, url, params, successCb, errorCb) {
    this._setupHTTPEvts(successCb);
    this._openHTTPAndSetRequestHeaders(method, url);
    this._tryExecuteHTTPRequest(method, params);
};

/**
 * It opens the HTML connection and sets the content type.
 *
 * @method _openHTTPAndSetRequestHeaders
 * @private
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {String} method
 * @param {String} URL
 */
HTTP.prototype._openHTTPAndSetRequestHeaders = function(method, url) {
    this.http.open(method, url, true);
    this.http.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
};

/**
 * It creates the XMLHttpRequest or XDomainRequest object.
 *
 * @method _createXMLHttpRequest
 * @private
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @return {Boolean}
 */
HTTP.prototype._createXMLHttpRequest = function() {
    if(this._isXDomainRequestSupported())
        return this._createXDomainRequest();
    else
        return new XMLHttpRequest();
};

/**
 * It tries to execute the request (http.send() method).
 *
 * @method _tryExecuteHTTPRequest
 * @private
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {String} method POST/GET/etc
 * @param {JSON} Params
 */
HTTP.prototype._tryExecuteHTTPRequest = function(method, params) {
    try {
        var statistic = JSON.stringify(params);
        console.log('Sending statistics', statistic);
        this.http.send(statistic);
    } catch(e) {
        console.log([null, 'XMLHttpRequest', method, 'Failed XMLHttpRequest.'], e);
    }
};

/**
 * It sets up the XMLHttpRequest onreadystatechange, abort, and error events.
 *
 * @method _setupHTTPEvts
 * @private
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @param {Function} Success callback
 */
HTTP.prototype._setupHTTPEvts = function(successCb, errorCb) {
    this.http.onabort = this.http.onerror = function(error) {
        console.log([null, 'XMLHttpRequest', 'Failed XMLHttpRequest.'], error);

        if(errorCb === 'function')
            errorCb(error);
    };

    this.http.onreadystatechange = function() {
        if (this.readyState == 4) {
            console.log("Statistics posted.", this.responseText);

            if(successCb === 'function')
                successCb(this.responseText);
        }
    };
};

/**
 * It creates the XDomainRequest object.
 *
 * @method _createXDomainRequest
 * @private
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @return {Boolean}
 */
HTTP.prototype._createXDomainRequest = function() {
    console.log('Creating XDomainRequest.');

    var xDomainRequest = new XDomainRequest();
    xDomainRequest.setContentType = function (contentType) {
        xDomainRequest.contentType = contentType;
    };

    return xDomainRequest;
};

/**
 * It checks if XDomainRequest is supported in IE8 - 9 for CORS connection.
 *
 * @method _isXDomainRequestSupported
 * @private
 * @for Skylink
 * @since 0.6.x
 * @author Leonardo Venoso
 * @return {Boolean}
 */
HTTP.prototype._isXDomainRequestSupported = function() {
    return typeof window.XDomainRequest === 'function' || typeof window.XDomainRequest === 'object';
};