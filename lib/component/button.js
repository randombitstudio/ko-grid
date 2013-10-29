(function(kg) {
    "use strict";
    
    var Button = function(definition) {
        var self = this;
        
        //Extend the default initializer class for json loading.
        ko.utils.extend(self, new (kg.getComponent('KgInitializer'))());
        
        //List of properties that will be loaded from json.
        self.addInitProperties(
            [
                "id",
                "gridId",
                "label"
            ]
        );        
        
        /**
         * @desc Column identifier
         * @type {String}
         **/
        self.id = null;

        /**
         * @desc Owner grid identifier
         * @type {String}
         **/
        self.gridId = null;
        
        /**
         * @desc Column label to be displayed in the grid.
         * @type {ko.observable} - string
         **/
        self.label = ko.observable('');
        
        self.load(definition);
    }; 

    Button.prototype = {
        "constructor": Button
    };

    kg.addComponent('Button', Button);
})(kg);
