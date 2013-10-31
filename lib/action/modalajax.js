(function(kg) {
    "use strict";
    
    var KgActionModalAjax = function(ownerId) {
        var self = this;

        //Extend the default initializer class for json loading.
        ko.utils.extend(self, new (kg.getComponent('Action'))(ownerId));        
        
        /**
         * @desc Action identifier
         * @type {String}
         **/
        self.id = "KgActionModalAjax";
        
        /**
         * @desc Set grid state to loading.
         **/
        self.preProcess = function(grid) {
            this.setStateLoading();
        };
        
        /**
         * @desc Refresh a grid view by collection all parameters
         *       and sending them to the refresh URL.
         * @param {Array} 
         **/
        self.run = function(urlKey, postData, cb, modal, record) {
            var grid = this;
            var refreshUrl = grid.query().getUrl(urlKey, record);
            var refreshParameters = grid.query().buildParameters();
            
            if (typeof record !== 'undefined') {
                modal.context = record;
            }
            
            if (typeof postData === 'undefined') {
                postData = refreshParameters;
            }
            
            self.preProcess.call(modal, grid);
            grid.query().request(
                refreshUrl,
                postData,
                function(response) {
                    self.postProcess.call(modal, response, grid);
                    if (typeof cb === 'function') {
                        cb(response, modal, grid);
                    }
                }
            );
        };
        
        /**
         * @desc Post process a request.
         **/
        self.postProcess = function(data, grid) {
            this.setStateClean();
        };
    };

    KgActionModalAjax.prototype = {
        "constructor": KgActionModalAjax
    };
    
    kg.addAction('KgActionModalAjax', KgActionModalAjax);
})(kg);
