(function(kg) {
    "use strict";
    
    var KgActionModal = function(ownerId) {
        var self = this;

        //Extend the default initializer class for json loading.
        ko.utils.extend(self, new (kg.getComponent('Action'))(ownerId));        
        
        /**
         * @desc Action identifier
         * @type {String}
         **/
        self.id = "KgActionModal";
        
        /**
         * @desc Set grid state to loading.
         **/
        self.preProcess = function() {
        };
        
        /**
         * @desc Refresh a grid view by collection all parameters
         *       and sending them to the refresh URL.
         * @param {Array} 
         **/
        self.run = function(modalId, methodIdentifier, parameters) {
            var grid = this;
            var modal = null;
            
            if (typeof modalId !== 'undefined') {
                modal = grid.getModalById(modalId);
            } 
            
            if (typeof parameters === 'undefined') {
                parameters = [];
            }
            
            if (modal && (typeof modal[methodIdentifier] === 'function')) {
                modal[methodIdentifier].apply(modal, [grid].concat(parameters));
            } else {
                throw new Error("Trying to dispatch to unrecognized"
                                + " modal action.");
            } 
        };
        
        /**
         * @desc Post process a request.
         **/
        self.postProcess = function(data) {
            
        };
    };

    KgActionModal.prototype = {
        "constructor": KgActionModal
    };
    
    kg.addAction('KgActionModal', KgActionModal);
})(kg);
