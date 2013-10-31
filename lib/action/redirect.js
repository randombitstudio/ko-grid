(function(kg) {
    "use strict";
    
    var KgActionRedirect = function(ownerId) {
        var self = this;

        //Extend the default initializer class for json loading.
        ko.utils.extend(self, new (kg.getComponent('Action'))(ownerId));        
        
        /**
         * @desc Action identifier
         * @type {String}
         **/
        self.id = "KgActionRedirect";
        
        /**
         * @desc Redirect to add form.
         * @param {Array} 
         * @this {Grid}
         **/
        self.run = function(urlKey, urlParams, record) {
            this.query().redirect(urlKey, urlParams, record);
        };
    };

    KgActionRedirect.prototype = {
        "constructor": KgActionRedirect
    };
    
    kg.addAction('KgActionRedirect', KgActionRedirect);
})(kg);
