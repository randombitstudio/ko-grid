(function(kg) {
    "use strict";
    
    var Paginator = function(definition) {
        var self = this;

        //Easy loading via the default initializer class.
        ko.utils.extend(self, new (kg.getComponent('KgInitializer'))());
        
        //List of properties.
        self.addInitProperties(
            [
                "gridId",
                "itemCountPerPage",
                "totalItems",
                
                "currentPage",
                "totalPages",
                "sorted"
            ]
        );
        
        /**
         * @desc Owner grid identifier
         * @type {String}
         **/
        self.gridId = null;
        
        /**
         * @desc Dictionary list of all currently sorted columns.
         * @type {Object}
         **/
        self.sorted = {};

        /**
         * @desc Current page shadow property.
         * @type {ko.observable}
         **/        
        self.currentPage = ko.observable(1).extend({"integer":""});
        
        /**
         * @desc Number of total pages that the grid has with the
         *       current query parameters.
         * @type {ko.observable} - int
         **/ 
        self.totalPages = ko.observable(0).extend({"integer":""});
        
        /**
         * @desc Number of items that should be displayed per page.
         * @type {ko.observable} - int
         **/
        self.itemCountPerPage = ko.observable(0).extend({"integer":""});
        
        /**
         * @desc Total items that are currently available for the
         *       grid.
         * @type {ko.observable} - int
         **/
        self.totalItems = ko.observable(0).extend({"integer":""});

        /**
         * @desc Return the offset of the first displayed item in the
         *       current grid view/
         * @return {Integer}
         **/
        self.getOffsetFirst = function() {
            return self.currentPage() * self.itemCountPerPage();                
        };

        self.getOffsetLast = function () {
            return self.getOffsetFirst() + Math.max(1, kg.getGrid().records().length);
        };
        
        //Initialize the paginator with the current definition
        self.load(definition);
    };
    
    Paginator.prototype = {
        "constructor": Paginator
    };

    kg.addComponent('Paginator', Paginator);
})(kg);
