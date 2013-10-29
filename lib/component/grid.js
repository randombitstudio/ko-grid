(function(kg) {
    "use strict";
    
    var Grid = function(definition) {
        var self = this;
        
        ko.utils.extend(self, new (kg.getComponent('KgInitializer'))());
        
        self.addInitProperties(
            [
                "container",
                "columns",
                "paginator",
                "records",
                "query"
            ]
        );

        /**
         * @desc Shadow property for columns.
         * @type {ko.observableArray} - Array of {Column} types.
         **/
        self._columns = ko.observableArray([]);
        
        /**
         * @desc Columns getter & setter.
         *       Creates columns from definitions.
         * @type {ko.computed}
         **/
        self.columns = ko.computed(
            {
                "read": self._columns,
                "write": function(definitions) {
                    var  gridId = self.id();

                    ko.utils.arrayForEach(
                        definitions,
                        function(columnDefinition) {
                            columnDefinition.gridId = gridId;
                            self._columns.push(
                                kg.column(columnDefinition)
                            );
                        }
                    );
                } 
            }
        );       

        /**
         * @desc Node context to which grid bindings will be applied.
         * @type {HtmlElement}
         **/
        self.container = null;

        /**
         * @desc Shadow property for the computed id.
         * @type {ko.observable}
         **/
        self._id = ko.observable();
        
        /**
         * @desc Grid ID used for identifier in the registry and as
         *       owner token for grid components.	
         * @type {ko.computed}
         **/
        self.id = ko.computed(
            {
                "read": self._id,
                "write": function(gridId) {
                    if (gridId === false)  {
                        gridId = new Date().getTime().toString() + '-'
                            + Math.random().toString().substr(2);
                    }
                    self._id(gridId);
                } 
            }
        );
        
        /**
         * @desc Model that will be used to hold record data.
         * @type {?string}
         **/
        self.model = 'Model';
                       
        /**
         * @desc Shadow property for the grid paginator.
         * @type {?Paginator}
         **/
        self._paginator = null;
        
        /**
         * @desc Paginator setter/getter.
         * @type {ko.computed}
         **/
        self.paginator = ko.computed(
            {
                "read": function () {
                    return self._paginator;
                }, 
                "write": function (definition) {
                    definition.gridId = self.id();
                    self._paginator = kg.paginator(definition);
                },
                "deferEvaluation": true
            }
        );
        
        /**
         * @desc Shadow property for the query builder.
         * @type {?Query} 
         **/
        self._query = null;

        /**
         * @desc Query setter/getter.
         * @type {ko.computed}
         **/      
        self.query = ko.computed(
            {
                "read": function () {
                    return self._query;
                }, 
                "write": function (definition) {
                    definition.gridId = self.id();
                    self._query = kg.query(definition);
                },
                "deferEvaluation": true
            }
        );

        /**
         * @desc Shadow property for all records.
         * @type {ko.observableArray}
         **/
        self._records = ko.observableArray([]);
        
        /**
         * @desc Records setter/getter
         * @type {ko.computed}
         **/
        self.records = ko.computed(
            {
                "read": self._records,
                "write": function (definitions) {
                    self._records.removeAll();
                    ko.utils.arrayForEach(
                        definitions,
                        function(recordData) {
                            self._records.push(kg.record(recordData, self.model));
                        }
                    );
                },
                "deferEvaluation": true
            }
        );
               
        /**
         * @desc Apply bindings to the currently set container node.
         **/
        self.deploy = function() {
            if (self.container === null) {
                throw new Error('KgGrid can not be deployed without a'
                                + ' bingding context.');
            }
            ko.applyBindings(self, self.container);
        }; 

        /**
         * @desc Function called at grid creation to confirm valid
         *       grid initialization.
         **/
        self.validate = function() {
            if (!kg.hasModel(self.model)) {
                throw new Error("Invalid record model registered with"
                                + " grid:" + self.model);
            }
        }; 
        
        //Set the id before any kind of initialization is done
        self.id((typeof definition.id !== 'undefined') && definition.id);
        
        if (typeof definition.model === 'string') {
            self.model = definition.model;
        }

        //Initialize the grid according to the definition
        self.load(definition);
        
        self.validate();
    };

    Grid.prototype = {
        "constructor": Grid
    };

    //Register the main grid component in the kg namespace.
    kg.addComponent('Grid', Grid);
})(kg);
