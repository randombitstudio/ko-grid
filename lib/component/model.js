(function(kg) {
    "use strict";
    
    var Model = function(recordData) {
        var self = this;
        
        //Extend the default initializer class for json loading.
        ko.utils.extend(self, new (kg.getComponent('KgInitializer'))());
        
        self.addInitProperties(
            [
                "id",
                "identifier",
                "children"
            ]
        );
        
        /**
         * @desc Record ID,
         * @type {ko.observable} - unique
         **/
        self.id = ko.observable();
        
        /**
         * @desc Marks if a record is part of the current grid
         *       selection.
         * @type {ko.observable} - boolean
         **/
        self.selected = ko.observable(false);

        /**
         * @desc Marks if a record is considered a child record within the current grid view.
         * @type {ko.observable} - boolean
         **/        
        self.isChild = ko.observable(false);
        
        /**
         * @desc Contains the key of a registered model for child
         *       record instances.
         * @type {String}
         **/
        self.childModel = null;

        /**
         * @desc Shadow container for all child records.
         * @type {ko.observableArray}
         **/
        self._children = ko.observableArray([]);
        
        /**
         *
         **/
        self.children(
            {
                "read": self._children,
                "write": function (definitions) {
                    
                },
                "deferEvaluation": true
            }
        );

        self.load(recordData);
    }; 
    
    Model.prototype = {
        "constructor": Model
    };
    
    kg.addModel('Model', Model);
})(kg);
