(function(kg) {
    "use strict";
    
    /**
     * @constructor
     * @this {Action}
     **/
    var Action = function(definition) {
        var self = this;

        //Extend the default initializer class for json loading.
        ko.utils.extend(self, new (kg.getComponent('KgInitializer'))());
        
        //List of properties that will be loaded from json.
        self.addInitProperties(
            [
                "id"
            ]
        );

        /**
         * @desc Column identifier
         * @type {String}
         **/
        self.id = null; 

        /**
         * @desc Main handler.
         * @type {?function} 
         **/
        self.run = null;

        /**
         * @desc Main handler.
         * @type {?function} 
         **/
        self.run = null;
       
        /**
         * @desc Execute an action's main call from a grid context.
         * @param {Array}
         **/
        self.execute = function(options) {
            var actionResult = null;
            if (self.validate.call(kg.getGrid(self.gridId))) {
                actionResult = self.run.call(kg.getGrid(), options);
            } 
            return actionResult;
        };
    };
    
    Action.prototype = {
        "constructor": Action
    };

    kg.addComponent('Action', Action);
})(kg);
