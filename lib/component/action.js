(function(kg) {
    "use strict";
    
    /**
     * @constructor
     * @this {Action}
     **/
    var Action = function(ownerId) {
        var self = this;

        /**
         * @desc Action identifier
         * @type {String}
         **/
        self.id = null; 

        /**
         * @desc Main handler.
         * @type {?function} 
         **/
        self.gridId = ownerId;

        /**
         * @desc Pre processing function.
         * @type {?function} 
         **/
        self.preProcess = null;


        /**
         * @desc Main handler.
         * @type {?function} 
         **/
        self.run = null;

        /**
         * @desc Post processing function
         * @type {?function} 
         **/
        self.postProcess = null;
        
        /**
         * @desc Main handler.
         * @type {?function} 
         * @return {boolean}
         **/
        self.validate = null;
       
        /**
         * @desc Execute an action's main call from a grid context.
         * @param {Array}
         **/
        self.execute = function(parameters) {
            var actionResult = null;
            var grid = kg.getGrid(this.gridId);
            if ((typeof this.validate !== 'function') ||
                this.validate.call(grid)) {
                actionResult = this.run.apply(grid, parameters);
            } 
            return actionResult;
        };
    };
    
    Action.prototype = {
        "constructor": Action
    };

    kg.addComponent('Action', Action);
})(kg);
