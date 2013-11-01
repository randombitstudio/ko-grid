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
                "filterId",
                "visible",
                "readonly",
                "template"
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
         * @desc Defines if a column is currently visible or not.
         * @type {ko.observable}
         **/
        self.visible = ko.observable(true);
        
        /**
         * @desc Determines if a column is available in readonly mode.
         * @type {ko.observable}
         **/
        self.readonly = ko.observable(false);

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
         * @desc Shadow property containing meta ids on which the sort
         *       will apply.
         * @type {ko.observableArray}
         **/
        self._sortId = ko.observableArray([]);

        /**
         * @desc Setter and getter for the sort Id, get he actual
         *       column ID if no explicit sort ID is set.
         * @type {ko.computed}
         **/       
        self.sortId = ko.computed(
            {
                "write": self._sortId,
                "read": function() {
                    if (self._sortId().length === 0) {
                        self._sortId.push(self.id);
                    }
                    return self._sortId();
                },
                "deferEvaluation": true
            }
        );
        

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

        /**
         * @desc Defines the template to be used for rendering the
         *       column. The skin can easily be customized to use
         *       additional templates.
         * @type {ko.observable}
         **/
        self.template = ko.observable('kg-cell-text');

        
        /**
         * @desc Adjust column sort in order - asc/desc/none
         * @return {Column}
         **/
        self.flipSort = function() {
            if (self._sorted() === null) {
                self.sorted('asc');
            } else if (self._sorted() === 'asc') {
                self.sorted('desc');
            } else {
                self.sorted(null);
            }
            return self;
        };
        
        //Call the KgInitializer load method.
        self.load(definition);
    };

    Column.prototype = {
        "constructor": Column
    };
    
    //Register the component in the kg namespace.
    kg.addComponent('Column', Column);
})(kg);
