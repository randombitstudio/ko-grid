(function(kg) {
    "use strict";
    
    var KgActionChildren = function(ownerId) {
        var self = this;

        //Extend the default initializer class for json loading.
        ko.utils.extend(self, new (kg.getAction('KgActionAjax'))(ownerId));        
        
        /**
         * @desc Action identifier
         * @type {String}
         **/
        self.id = "KgActionChildren";
                
        /**
         * @desc Refresh a grid view by collection all parameters
         *       and sending them to the refresh URL.
         * @param {Array} 
         **/
        self.run = function(urlKey, index, record) {
            var grid = this;
            if (record.children().length === 0) {
                var refreshUrl = grid.query().buildUrl(
                    urlKey,
                    [record.page(), record.id()]
                );
                var refreshParameters = grid.query().buildParameters();
                
                self.preProcess.call(grid);
                grid.query().request(
                    refreshUrl,
                    {},
                    function(response) {
                        self.postProcess.apply(grid, [response, index,
                                                      record]);
                        grid.showChildren(record);
                    }
                );
            }  else if (record.visibleChildren()) {
                grid.hideChildren(record);
            } else {
                grid.showChildren(record);
            } 
        };
        
        /**
         * @desc Post process a request.
         **/
        self.postProcess = function(data, index, record) {
            if (typeof data[index] !== 'undefined') {
                record.children(data[index]);
            }
            this.setStateClean();
        };
    };

    KgActionChildren.prototype = {
        "constructor": KgActionChildren
    };
    
    kg.addAction('KgActionChildren', KgActionChildren);
})(kg);
