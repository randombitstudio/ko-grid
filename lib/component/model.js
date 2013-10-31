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
                "children",
                "dataLanguage",
                "hasChildren"
            ]
        );
        
        /**
         * @desc Record ID,
         * @type {ko.observable} - unique
         **/
        self.id = ko.observable();

        /**
         * @desc Record data language..
         * @type {ko.observable}
         **/
        self.dataLanguage = ko.observable();

        /**
         * @desc Record index in the current ordering.
         * @type {ko.observable} - unique
         **/
        self.page = ko.observable();
        
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
         * @type {ko.observable}
         **/
        self.childModel = ko.observable(null);

        /**
         * @desc Shadow container for all child records.
         * @type {ko.observableArray}
         **/
        self._children = ko.observableArray([]);
        
        /**
         *
         **/
        self.children = ko.computed(
            {
                "read": self._children,
                "write": function (definitions) {
                    self._children.removeAll();
                    ko.utils.arrayForEach(
                        definitions,
                        function(childData) {
                            var child = kg.record(
                                childData,
                                self.childModel()
                            );
                            child.dataLanguage(self.dataLanguage());
                            child.isChild(true);
                            self._children.push(child);
                        }
                    );

                },
                "deferEvaluation": true
            }
        );

        /**
         * @desc Indiciates if a record has any children.
         * @type {ko.observable}
         **/
        self.hasChildren = ko.observable(false);

        /**
         * @desc Indiciates if a record's depdendants are visible.
         * @type {ko.observable}
         **/
        self.visibleChildren = ko.observable(false);

        /**
         * @desc Indiciates if a record has any children.
         * @type {ko.observable}
         **/
        self.isLastChild = ko.observable(false);

        self.load(recordData);
    }; 
    
    Model.prototype = {
        "constructor": Model
    };
    
    kg.addModel('Model', Model);
})(kg);
