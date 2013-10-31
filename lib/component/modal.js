(function(kg) {
    "use strict";

    var Modal = function(definition) {
        var self = this;

        //Extend the default initializer class for json loading.
        ko.utils.extend(self, new (kg.getComponent('KgInitializer'))());
        
        self.addInitProperties(
            [
                "id",
                "gridId",
                "label",
                "content"
            ]
        );

        /**
         * @desc Modal identifier
         * @type {String}
         **/
        self.id = null;

        /**
         * @desc Owner grid identifier
         * @type {String}
         **/
        self.gridId = null;
        
        /**
         * @desc Context of execution if applicable.
         * @type {Model}
         **/
        self.context = null;
        
        /**
         * @desc Display title of a modal.
         * @type {ko.observable}
         **/
        self.title = ko.observable("");
        
        /**
         * @desc HTML Content of a modal.
         * @type {ko.observable}
         **/
        self.content = ko.observable("");

        /**
         * @desc Array holding all buttons show in the modal's footer.
         * @type {ko.observableArray}
         **/
        self.buttons = ko.observableArray([]);
        
        /**
         * @desc Get a jQuery object of the modal container.
         * @return {jQuery}
         **/
        self.getContainer = function() {
            return $('#' + self.id);
        };

        /**
         * @desc Close a modal without doing any clean up or other
         *       actions.
         **/
        self.dismiss = function() {
            this.getContainer().modal('hide');
            this.content("");
            this.context = null;
        };
        
        /**
         * @desc Set the grid state to loading.
         **/ 
        self.setStateLoading = function () {
            self.getContainer().addClass('kg-state-loading');
        },

        /**
         * @desc Set the modal state to clean.
         **/        
        self.setStateClean = function() {
            self.getContainer().removeClass('kg-state-loading');
        };

        /**
         * @desc Get a specific modal button by ID.
         * @param {string} - Id of the button to look for.
         * @return {?Column}
         **/
        self.getButtonById = function(id) {
            return ko.utils.arrayFirst(
                this.buttons(),
                function(button) {
                    return button.id === id;
                }
            );
        };
   
        self.load(definition);
    };
    
    Modal.prototype = {
        "constructor": Modal
    };

    kg.addComponent('Modal', Modal);
})(kg);
