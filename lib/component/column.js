(function(kg) {
    "use strict";
    
    /**
     * @constructor
     * @this {Column}
     **/
    var Column = function(definition) {
        var self = this;

        //Extend the default initializer class for json loading.
        ko.utils.extend(self, new (kg.getComponent('KgInitializer'))());
        
        //List of properties that will be loaded from json.
        self.addInitProperties(
            [
                "id",
                "gridId",
                "label",
                "headerClass",
                "cellClass",
                "sortable",
                "sortId",
                "filterable",
                "filterId"
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
        
        /**
         * @desc Class added to a column header in the grid.
         * @type {ko.observable} - string
         **/
        self._headerClass = ko.observable('kg-column-header');
        
        /**
         * @desc - Setter/Getter for the header class. Adds
         *         sortable indicator.
         * @type {ko.computed}
         **/
        self.headerClass = ko.computed(
            {
                "write": self._headerClass,
                "read": function() {
                    var headerClass = self._headerClass();
                    if (self.sortable()) {
                        headerClass += ' kg-column-header-sortable';
                    }
                    return headerClass;
                },
                "deferEvaluation": true
            }
        );

        /**
         * @desc Class added to every column cell
         * @type {ko.observabl} - string
         **/   
        self.cellClass = ko.observable('kg-column-cell');

        /**
         * @desc Determines if a column can be filtered.
         * @type {ko.observable} - boolean
         **/
        self.filterable = ko.observable(false);

        /**
         * @desc Contains the field id or meta ids on which a filter
         *       will be executed.
         * @type {ko.observableArray}
         **/
        self.filterId = ko.observableArray([]);
        
        /**
         * @desc Determines if a column can be sorted on.
         * @type {ko.observable} - boolean
         **/
        self.sortable = ko.observable(false);

        /**
         * @desc Contains the field id or meta ids on which the sort
         *       will apply.
         * @type {ko.observableArray}
         **/
        self.sortId = ko.observableArray([]);

        /**
         * @desc Determines if a column us currently being sorted on.
         *       and holds a string representation of the sort type.
         * @type {ko.observable} - string
         **/
        self._sorted = ko.observable(null);


        /**
         * @desc - Setter/Getter for the sorted.
         * @type {ko.computed}
         **/
        self.sorted = ko.computed(
            {
                "write": self._sorted,
                "read": function() {
                    var sortedClass = 'kg-column-header-sort-no';
                    if (self._sorted() === 'asc') {
                        sortedClass = 'kg-column-header-sort-asc';
                    } else if(self._sorted() === 'desc'){
                        sortedClass = 'kg-column-header-sort-desc';
                    }
                }
            }
        );
        
        //Call the KgInitializer load method.
        self.load(definition);
    };

    Column.prototype = {
        "constructor": Column
    };
    
    //Register the component in the kg namespace.
    kg.addComponent('Column', Column);
})(kg);
