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
                "label",
                "trigger",
                "params",
                "toolbar",
                "dropdown",
                "visible"
            ]
        );        
        
        /**
         * @desc Button identifier
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

        /**
         * @desc ID of the registered grid action trigger.
         * @type {ko.observable} - string
         **/
        self.trigger = ko.observable('');

        /**
         * @desc Defines if a button is currently visible or not.
         * @type {ko.observable}
         **/
        self.visible = ko.observable(true);
        
        /**
         * @desc Parameters that will be passed to each trigger call.
         * @type {ko.observableArray}
         **/
        self.params = ko.observableArray([]);

        /**
         * @desc Dropdown items attached to this button
         * @type {ko.observableArray}
         **/
        self.dropdown = ko.observableArray([]);

        /**
         * @desc Dropdown class for modal attributes.
         * @type {ko.observable}
         **/
        self.buttonClass = ko.computed(
            function() {
                var bc = 'btn btn-default';
                if (this.dropdown().length > 0) {
                    bc += ' dropdown-toggle';
                }
                return bc;
            },
            this,
            {
                "deferEvaluation": true
            }
        );
        
        self.dropdownToggle = ko.computed(
            function() {
                var toggle = '';
                if (this.dropdown().length > 0) {
                    toggle = 'dropdown';
                }
                return toggle;
            },
            this,
            {
                "deferEvaluation": true
            }
        );

        /**
         * @desc Determines visibility in the toolbar.
         * @type {ko.observable} - boolean
         **/
        self.toolbar = ko.observable(false);
    
        self.load(definition);
    }; 

    Button.prototype = {
        "constructor": Button
    };

    kg.addComponent('Button', Button);
})(kg);
