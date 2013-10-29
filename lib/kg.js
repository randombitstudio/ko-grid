var kg = (function() {
    var kgGlobal = null;
    
    /**
     * @constructor
     * @this {KgRepository}
     **/
    var KgRepository = function() {
        var self = this;
        
        /**
         * @desc Dictionary for all repository data.
         **/
        self.repository = {};
        
        /** 
         * @method
         * @param {String} repositoryKey - Dictionary key to use.
         * @param data - Data that will be associated with the key.
         * @desc Associate a key entry to aset of data. Enforces
         *       string keys.
         **/
        self.addToRepository = function(repositoryKey, data) {
            if (typeof repositoryKey !== 'string') {
                throw new Error('The KgRepository accepts only string keys for data association.');
            }
            self.repository[repositoryKey] = data;
            return self;
        };
        
        /**
         * @method
         * @param {String} - Key to look for in the dictionary.
         * @param defaultReturn - Return value if the key is not found.
         * @desc - Grab a value from the associated repository
         **/
        self.getFromRepository = function(repositoryKey, defaultReturn) {
            if (typeof defaultReturn === 'undefined') {
                defaultReturn = null;
            }
            return typeof self.repository[repositoryKey] !== 'undefined' ? self.repository[repositoryKey] : defaultReturn;
        };
    };
    
    KgRepository.prototype = {
        "constructor": KgRepository
    };

    /**
     * @constructor
     * @this {KgInitializer}
     **/
    var KgInitializer = function() {
        var self = this;
        
        self._initProperties = [];
        
        /**
         * @desc Add properties to be initialized.
         * @param {Array}         
         **/
        self.addInitProperties = function(properties) {
            if (!(properties instanceof Array)) {
                throw new Error('The KgInitializer accepts property'
                                + ' lists in array format only');
            }
            
            ko.utils.arrayForEach(
                properties,
                function (propertyName) {
                    self._initProperties.push(propertyName);
                } 
            );
        };
        
        /**
         * @desc Initialize all properties to the values
         *       stored in definition. Sets missing properties to
         *       false
         * @param {Object} - definition - Dictionary of properties.
         **/
        self.load = function(definition) {
            //Do not override self.
            var context = this;
            
            if (typeof definition !== 'undefined') {
                                ko.utils.arrayForEach(
                    self._initProperties,
                    function (propertyName) {
                        if (typeof definition[propertyName] !== 'undefined') {
                            if (typeof context[propertyName] === 'function') {
                                context[propertyName](definition[propertyName]);
                            } else {
                                context[propertyName] = definition[propertyName];
                            }
                        }
                    } 
                );
            }
        }; 
    }; 
    
    KgInitializer.prototype = {
        "constructor": KgInitializer
    };
    
    /**
     * @constructor
     * @this {KgRepository}
     **/
    var KgPackage = function() {
        var self = this;
    
        /**
         * @desc Contains all components and elements needed by the
         *       grid. Extending the grid can easily be done by
         *       overriding default keys or by registering additional
         *       components.
         * @type KgRepository
         **/
        self.components = new KgRepository();

        /**
         * @desc Grid registry - contains all currently managed grid instances.
         * @type KgRepository
         **/
        self.registry = new KgRepository();

        /**
         * @desc Model repository. Registered models are "known" to
         *       the grid.
         * @type KgRepository
         **/     
        self.models = new KgRepository();        

        /**
         * @desc Action repository. Registered grid actions in here.
         * @type KgRepository
         **/     
        self.actions = new KgRepository();        
    };
    
    KgPackage.prototype = {
        "constructor": KgPackage,

        /**
         * @desc Register an action for instantiation from within
         *       grids.
         * @param {string} - Unique id of the action.
         * @param {Action} - Action object for this id.
         * @return {KgPackage}
         * @this {KgPackage}
         **/      
        "addAction": function(actionId, action) {
            this.actions.addToRepository(actionId, action);
            return this;
        },
        
        /**
         * @desc Get a registered action.
         * @return {Action}
         * @this {KgPackage}
         **/
        "getAction": function(actionId) {
            return this.actions.getFromRepository(actionId, null);
        },
        
        /**
         * @see KgRepository#addToRepository
         * @this {KgPackage}
         * @return {KgPackage}
         **/
        "addComponent": function(key, value) {
            this.components.addToRepository(key, value);
            return this;
        },

        /**
         * @desc Adds a grid to the registry.
         * @return {KgPackage}
         * @this {KgPackage}
         **/
        "addGrid": function(grid) {
            this.registry.addToRepository(grid.id(), grid);
            return this;
        },

        /**
         * @desc Get a grid from the registry
         * @return {Grid}
         * @this {KgPackage}
         **/
        "getGrid": function(gridId) {
            var grid = this.registry.getFromRepository(gridId, null);
            if (grid === null)  {
                throw new Error("Grid with id: " + gridId + " could"
                                + " not be found in the registry.");
            }
            return grid;
        },

        /**
         * @desc Register a model for internal grid use.
         * @return {KgPackage}
         * @this {KgPackage}
         **/      
        "addModel": function(modelKey, model) {
            this.models.addToRepository(modelKey, model);
            return this;
        },
        
        /**
         * @desc Get a registered model.
         * @return {Model}
         * @this {KgPackage}
         **/
        "getModel": function(modelKey) {
            return this.models.getFromRepository(modelKey, null);
        },
       
        /**
         * @desc Check if a specific model key is registered.
         * @return {Boolean}
         * @this {KgPackage}
         **/
        "hasModel": function(modelKey) {
            return (typeof this.getModel(modelKey) === 'function');
        },

        /**
         * @see KgRepository#getFromRepository
         * @this {KgPackage}
         **/
        "getComponent": function(key, defaultData) {
            return this.components.getFromRepository(key, defaultData);
        },

        /**
         * @desc Create an action instance.
         * @return {Button}
         * @this {KgPackage}
         **/
        "action": function(actionId) {
            return new (this.getAction(actionId))();
        },

        /**
         * @desc Create a button instance.
         * @return {Button}
         * @this {KgPackage}
         **/
        "button": function(definition) {
            return new (this.getComponent('Button'))(definition);
        },

        /**
         * @desc Create a column instance.
         * @return {Column}
         * @this {KgPackage}
         **/
        "column": function(definition) {
            return new (this.getComponent('Column'))(definition);
        },

        /**
         * @desc Create a paginator instance.
         * @return {Paginator}
         * @this {KgPackage}
         **/
        "paginator": function(definition) {
            return new (this.getComponent('Paginator'))(definition);
        },
        
        /**
         * @desc Create a record instance for a specific model.
         * @param {object} - Record data
         * @param {string} - Key for the record model.
         * @return {Object}
         **/
        "record": function(definition, modelKey) {
            return new (this.getModel(modelKey))(definition);
        },
        
        /**
         * @desc Get query component object.
         * @param {string} - Query component definition
         * @return {Query}
         **/
        "query": function(definition) {
            return new (this.getComponent('Query'))(definition);
        },
        
        /**
         * @desc Create a grid according to definition.
         * @return {Grid} 
         * @this {KgPackage}
         **/
        "grid": function(definition) {
            var grid = new (this.getComponent('Grid'))(definition);
            this.addGrid(grid);
            return grid;
        }
    };


    /**
     * @desc Integer validation extender for basic ko.js observables.
     * @param {ko.observable}
     **/
    ko.extenders.integer = function (target)  {
        var computedInteger = ko.computed(
            {
                "read": target,
                "write": function(input) {
                    var current = target();
                    var inputInteger = isNaN(input) ? current :
                            parseInt(input, 10);
                    
                    if (inputInteger !== current)  {
                        target(inputInteger);
                    }
                }
            }
        ).extend({"notify": "always"});
        
        computedInteger(target());
        
        return computedInteger;
    };

    kgGlobal = new KgPackage();
    kgGlobal.addComponent('KgRepository', KgRepository);
    kgGlobal.addComponent('KgInitializer', KgInitializer);

    return kgGlobal;
})();
