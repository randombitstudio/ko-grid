(function(kg) {
    "use strict";
    
    /**
     * @constructor
     * @this {Query}
     * @param {Object}
     **/
    var Query = function(definition) {
        var self = this;
        
        //Extend the default initializer class for json loading.
        ko.utils.extend(self, new (kg.getComponent('KgInitializer'))());
        
        //List of properties that will be loaded from json.
        self.addInitProperties(
            [
                "gridId"
            ]
        );        
        
        /**
         * @desc Repository for all urls that will be used by the
         * grid.
         * @type {KgRepository}
         **/
        self.urls = new (kg.getComponent('KgRepository'))();
        
        /**
         * @desc Owner grid identifier
         * @type {String}
         **/
        self.gridId = null;
        
        /**
         * @desc Required url keys.
         * @type {Array} 
         **/
        self.requiredUrlKeys = [
            "refresh",
            "add",
            "remove"
        ];

        
        /** 
         * @desc Ajax request function, left for framework
         *       implementation
         * @param {string} - Url to query.
         * @param {Object} - Request data.
         * @param {callback} - Function to call upon completion
         **/
        self.request = function(url, params, cb) {
            return $.post(
                url,
                params
            ).done(
                cb
            );
        };
        
        //Initialized the urls.
        if (typeof definition.urls !== 'undefined') {
            ko.utils.objectForEach(
                definition.urls,
                function(urlKey, url) {
                    self.addUrl(urlKey, url);
                }
            );
        }
        
        self.validate();
        self.load(definition);
    };
    
    Query.prototype = {
        "constructor": Query,
        
        /**
         * @desc Build sort, filter & paginator parameters.
         * @return {object}
         * @this {Query}
         **/
        "buildParameters": function () {
            var grid = kg.getGrid(this.gridId);
            var params = grid.paginator().toParameters();
            params.sort = grid.getSortedParameters();
            params.filter = grid.getFilteredParameters();
            return params;
        },
        
        /**
         * @desc Store an url inside the internal query repository.
         * @param {string} - Identifier for repository storage.
         * @param {string} - Url to be stored.
         * @return {Query}
         **/
        "addUrl": function(urlKey, url) {
            this.urls.addToRepository(urlKey, url);
            return this;
        },

        /**
         * @desc Grab an url from the repository.
         * @param {string} - Key to look up.
         * @return {string} - Matching repository value.
         **/
        "getUrl": function(urlKey) {
            var url = this.urls.getFromRepository(urlKey, null);
            if (url === null) {
                throw new Error("The requested url could not be found"
                                + " in the repository");
            }
            return url;
        },
        
        /**
         * @desc Build an url from a key and parameters.
         * @param {string} - Url key
         * @param {Array} - Url parameters to be attached.
         **/
        "buildUrl": function(urlKey, urlParams, separator) {
            var url = this.getUrl(urlKey);
            if (typeof separator === 'undefined') {
                separator = '/';
            }
            
            if (typeof urlParams !== 'undefined' && (urlParams.length > 0)){
                url = url +  separator + urlParams.join(separator);
            }
            return url;
        },
        
        /**
         * @desc Redirect browers to a repository location.
         * @param {string} - Url key
         * @param {Array} - Url params
         **/
        "redirect": function(urlKey, urlParams, record) {
            var url = this.buildUrl(urlKey, urlParams);
            if (typeof record !== 'undefined') {
                url = url.replace('__recordId__', record.id());
            }
            window.location.href = url;
        }, 
        
        /**
         * @desc Verify that all required urls are set.
         * @this {Query}
         **/
        "validate": function() {
            var self = this;
            ko.utils.arrayForEach(
                self.requiredUrlKeys,
                function(key) {
                    self.getUrl(key);
                }
            );
        }
    };

    
    //Register the component in the kg namespace.
    kg.addComponent('Query', Query);
})(kg);
