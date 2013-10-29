(function(kg) {
    "use strict";
    
    var KgActionRefresh = function() {
        var self = this;

        //Extend the default initializer class for json loading.
        ko.utils.extend(self, new (kg.getComponent('Action'))());
        
        /**
         * @see {Action.run}
         **/
        self.validate = function() {
            return true;
        };
        
        self.run = function() {
            console.log('Refreshing')
        };
    };

    KgActionRefresh.prototype = {
        "constructor": KgActionRefresh
    };
    
    kg.addAction('KgActionRefresh', KgActionRefresh);
})(kg);
