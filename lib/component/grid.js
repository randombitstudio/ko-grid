(function(kg) {
    "use strict";
    
    var Grid = function(definition) {
        var self = this;
        
        ko.utils.extend(self, new (kg.getComponent('KgInitializer'))());
        
        self.addInitProperties(
            [
                "actions",
                "buttons",
                "columns",
                "container",
                "dataLanguage",
                "modals",
                "paginator",
                "query",
                "records",
                "readonly"
            ]
        );

        /**
         * @desc Shadow property for actions.
         * @type {ko.observableArray} - Array of {Action} types.
         **/
        self._actions = ko.observableArray([]);

        /**
         * @desc Buttons getter & setter.
         * @type {ko.computed}
         **/        
        self.actions = ko.computed(
            {
                "read": self._actions,
                "write": function(definitions) {
                    var gridId = self.id();
                    self._actions.removeAll();
                    ko.utils.arrayForEach(
                        definitions,
                        function(actionId) {
                            self._actions.push(kg.action(actionId, gridId));
                        }
                    );
                }
            }
        ); 
                
        /**
         * @desc Shadow property for buttons.
         * @type {ko.observableArray} - Array of {Button} types.
         **/
        self._buttons = ko.observableArray([]);

        /**
         * @desc Buttons getter & setter.
         * @type {ko.computed}
         **/
        self.buttons = ko.computed(
            {
                "read": self._buttons,
                "write": function(definitions) {
                    var  gridId = self.id();

                    ko.utils.arrayForEach(
                        definitions,
                        function(buttonDefinition) {
                            buttonDefinition.gridId = gridId;
                            self._buttons.push(
                                kg.button(buttonDefinition)
                            );
                        }
                    );
                } 
            }
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
         * @desc Data language for multilingual grid data.
         *       Propagated to records.
         * @type {ko.observable}
         **/
        self.dataLanguage = ko.observable();

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
        self.model = ko.observable('Model');
        
        /**
         * @desc Template id for records from within this grid.
         * @type {string}
         **/
        self.recordTemplate = ko.computed(
            function() {
                var template = 'kg-record';
                
                if (this.readonly()) {
                    template += '-pick';
                } 
                return template;
            },
            self,
            {
                "deferEvaluation": true
            }
        );
        
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
                    var modelKey = self.model();
                    var dataLanguage = self.dataLanguage();
                    var initialOffset = self.paginator().getOffsetFirst();
                    self._records.removeAll();
                    ko.utils.arrayForEach(
                        definitions,
                        function(recordData) {
                            var record = null;

                            recordData.dataLanguage = self.dataLanguage();
                            record = kg.record(recordData, modelKey);
                            record.page(initialOffset +
                                        self._records().length);
                            self._records.push(record);
                        }
                    );
                },
                "deferEvaluation": true
            }
        );
        
        /**
         * @desc Shadow for all modal intances.
         * @type {ko.observableArray}
         **/
        self._modals = ko.observableArray([]);
               
        /**
         * @desc Setter/Getter for all grid modals.
         **/
        self.modals = ko.computed(
            {
                "read": self._modals,
                "write": function (definitions) {
                    self._modals.removeAll(),
                    ko.utils.arrayForEach(
                        definitions,
                        function(definition) {
                            var modal = kg.modal(definition);
                            modal.buttons(
                                ko.utils.arrayFilter(
                                    self.buttons(),
                                    function(button) {
                                        return (definition.buttons.indexOf(button.id) !== -1);
                                    }
                                )
                            );
                            self._modals.push(modal);
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
                //self.container = document.getElementById(self.model().toLowerCase()  + '-grid');
                self.container = document.getElementById('kg-default');
            }
            ko.applyBindings(self, self.container);
        }; 

        /**
         * @desc Show only visible columns.
         * @return {Array}
         **/
        self.visibleColumns = ko.computed(
            function () {
                return ko.utils.arrayFilter(
                    this.columns(),
                    function(column) {
                        return column.visible() && (!self.readonly()
                                                    ||
                                                    column.readonly());
                    }
                );
            },
            this,
            {
                "deferEvaluation": true
            }
        );
        
        /**
         * @desc Determines if a grid is in readonly mode.
         * @type {ko.observable}
         **/
        self.readonly = ko.observable(false);

        /**
         * @desc Function called at grid creation to confirm valid
         *       grid initialization.
         **/
        self.validate = function() {
            if (!kg.hasModel(self.model())) {
                throw new Error("Invalid record model registered with"
                                + " grid:" + self.model());
            }
        }; 
        
        //Set the id before any kind of initialization is done
        self.id((typeof definition.id !== 'undefined') && definition.id);

        //Set the record model before initialization
        if (typeof definition.model === 'string') {
            self.model(definition.model);
        }
        
        //Add the kg default actions to the list of available grid actions.
        if (typeof definition.actions === 'undefined') {
            definition.actions = self.defaults.actions;
        } else {
            definition.actions = definition.actions.concat(self.defaults.actions);
        }
        
        //Initialize the grid according to the definition
        self.dataLanguage(definition.dataLanguage);
        self.load(definition);
        
        self.validate();
    };

    Grid.prototype = {
        "constructor": Grid,

        //Defaults to be used in the initialization
        "defaults": {
            "actions": [
                "KgActionAjax",
                "KgActionChildren",
                "KgActionModal",
                "KgActionModalAjax",
                "KgActionRedirect"
            ]
        },
        
        /**
         * @desc Call an specific grid action providing an array of
         *       parameters.
         * @param {string}
         * @param {Array}
         **/
        "trigger": function(actionId, parameters) {
            var action = this.getActionById(actionId);
            return action.execute(parameters);
        },
        
        /**
         * @desc Get the current grid selection.
         * @return {Array} of {Model} types
         * @this {Grid}
         **/
        "getSelectedRecords": function() {
            return ko.utils.arrayFilter(
                this.records(),
                function(record) {
                    return record.selected();
                }
            );
        },

        /**
         * @desc Get all columns that supporting sorting.
         * @return {Array} of {Column} objects
         * @this {Grid}
         **/
        "getSortableColumns": function() {
            return ko.utils.arrayFilter(
                this.columns(),
                function(column) {
                    return column.sortable();
                }
            );
        }, 

        /**
         * @desc Get all columns that supporting filtering.
         * @return {Array} of {Column} objects
         * @this {Grid}
         **/
        "getFilterableColumns": function() {
            return ko.utils.arrayFilter(
                this.columns(),
                function(column) {
                    return column.filterable();
                }
            );
        },
        
        /**
         * @desc Get a specific grid column by ID.
         * @param {string} - Id of the column to look for.
         * @return {?Column}
         **/
        "getColumnById": function(id) {
            return ko.utils.arrayFirst(
                this.columns(),
                function(column) {
                    return column.id === id;
                }
            );
        },

        /**
         * @desc Get a specific record by ID.
         * @param {string} - Id of the record to look for.
         * @return {?Model}
         **/       
        "getRecordById": function(id) {
            return ko.utils.arrayFirst(
                this.records(),
                function(record) {
                    return record.id() === id;
                }
            );            
        },

        /**
         * @desc Get a grid modal by its ID.
         * @param {string} - Id of the modal we are manipulating.
         * @return {?Modal}
         **/       
        "getModalById": function(id) {
            return ko.utils.arrayFirst(
                this.modals(),
                function(modal) {
                    return modal.id === id;
                }
            );            
        },
        
        /**
         * @desc Get a specific action by ID.
         * @param {string} - Id of the action to look for.
         * @return {?Action}
         **/       
        "getActionById": function(id) {
            return ko.utils.arrayFirst(
                this.actions(),
                function(action) {
                    return action.id === id;
                }
            );            
        },
        
        /**
         * @desc Convert all currently sorted columns to a single
         *       serializable object.
         * @return {Object}
         **/
        "getSortedParameters": function() {
            var sorted = {};
            ko.utils.arrayForEach(
                this.columns(),
                function(column) {
                    if (column.sortable() && column._sorted()) {
                        ko.utils.arrayForEach(
                            column.sortId(),
                            function(sortId) {
                                sorted[sortId] = column._sorted();
                            }
                        );
                    }
                }
            );
            return sorted;
        },
        
        /**
         * @desc Convert all currently filtered columns to a single
         *       serializable object.
         * @return {Object}
         **/
        "getFilteredParameters": function() {
            var filtered = {};
            return filtered;
        },

        /**
         * @desc Set the grid state to loading.
         **/ 
        "setStateLoading": function () {
            $(this.container).addClass('kg-state-loading');
        },

        /**
         * @desc Set the grid state to clean.
         **/        
        "setStateClean": function() {
            $(this.container).removeClass('kg-state-loading');
        },

        /**
         * @desc Opens a modal.
         * @param {string} - ID of the modal that needs to be opened.
         **/ 
        "openModal": function(modalId) {
            
        },

        /**
         * @desc Reload grid records & paginator state.
         * @param {Object} - Holding a complete grid configuration.
         **/
        "reload": function(data) {
            if (typeof data.records !== 'undefined') {
                this.records(data.records);
            }

            if (typeof data.paginator !== 'undefined') {
                this.paginator().reload(data.paginator);
            }
        },
        
        /**
         * @desc Show the child records of a grid row.
         * @param {Model}
         **/
        "showChildren": function(record) {
            var self = this;
            var recordIndex = this.records().indexOf(record) + 1;
            var lastChild = null;
            
            ko.utils.arrayForEach(
                record.children(),
                function(child) {
                    lastChild = child;
                    self._records.splice(recordIndex, 0, child);
                    recordIndex++;
                }
            );
            
            if (lastChild) {
                lastChild.isLastChild(true);
            }
            record.visibleChildren(true);
        },
        
        /**
         * @desc Hide  the visible children of a specific record.
         * @param {Model}
         **/
        "hideChildren": function(record) {
            var self = this;
            ko.utils.arrayForEach(
                record.children(),
                function(child) {
                    self._records.remove(child);
                }
            );
            record.visibleChildren(false);
        },
        
        /**
         * @desc Get all buttons visible in the toolbar.
         * @return {Array}
         **/
        "getToolbarButtons": function() {
            return ko.utils.arrayFilter(
                this.buttons(),
                function(button) {
                    return button.toolbar(); 
                } 
            );
        }
    };

    //Register the main grid component in the kg namespace.
    kg.addComponent('Grid', Grid);
})(kg);
