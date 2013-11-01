(function(kg) {
    "use strict";
    
    var KgActionAjax = function(ownerId) {
        var self = this;

        //Extend the default initializer class for json loading.
        ko.utils.extend(self, new (kg.getComponent('Action'))(ownerId));        
        
        /**
         * @desc Action identifier
         * @type {String}
         **/
        self.id = "KgActionAjax";
        
        /**
         * @desc Set grid state to loading.
         **/
        self.preProcess = function() {
            this.setStateLoading();
        };
        
        /**
         * @desc Refresh a grid view by collection all parameters
         *       and sending them to the refresh URL.
         * @param {Array} 
         **/
        self.run = function(urlKey, postData, cb, record) {
            var grid = this;
            var refreshUrl = grid.query().getUrl(urlKey, record);
            var refreshParameters = grid.query().buildParameters();
            
            if (typeof postData === 'undefined') {
                postData = {};
            }
                        
            self.preProcess.call(grid);
            grid.query().request(
                refreshUrl,
                $.extend(postData, refreshParameters),
                function(response) {
                    self.postProcess.call(grid, response);
                    if (typeof cb === 'function') {
                        cb(response);
                    }
                }
            );
        };
        
        /**
         * @desc Post process a request.
         **/
        self.postProcess = function(data) {
            this.reload(data);
            this.setStateClean();
        };
    };

    KgActionAjax.prototype = {
        "constructor": KgActionAjax
    };
    
    kg.addAction('KgActionAjax', KgActionAjax);
})(kg);
