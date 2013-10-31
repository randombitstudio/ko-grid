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
        self._currentPage = ko.observable(1).extend({"integer":""});

        /**
         * @desc Current page computed property for validation.
         *       This computed has a side effect of refreshing the
         *       grid on valid values.
         * @type {ko.observable}
         **/        
        self.currentPage = ko.computed(
            {
                "read": self._currentPage,
                "write": function(page) {
                    if (self.isValidPage(page)) {
                        self._currentPage(page);
                    } else {
                        self.currentPageWrap(self._currentPage());
                    } 
                } 
            }
        );
        
        /**
         * @desc Wrapper property for paginator display.
         * @type {ko.observable}
         **/                
        self.currentPageWrap = ko.observable(1).extend({"integer":""});

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
            return Math.max(0, ((self.currentPage() - 1) *
                                self.itemCountPerPage()) + 1);                
        };

        self.getOffsetLast = function () {
            return ((self.currentPage() - 1) *
                    self.itemCountPerPage())
            + Math.max(1, kg.getGrid(self.gridId).records().length);
        };
        
        self.refresh = function(paginator, event) {
            if (event.keyCode === 13) {
                paginator.currentPage(paginator.currentPageWrap());
            }
        }; 

        //Initialize the paginator with the current definition
        self.load(definition);
        self.currentPage(definition.currentPage);
        self.currentPageWrap(self.currentPage());
    };
    
    Paginator.prototype = {
        "constructor": Paginator,
        /**
         * @desc Test the validity of a page input.
         * @param {integer} - Page number to test against.
         * @return {boolean}
         **/
        "isValidPage": function(page) {
            return (page <= this.totalPages()) && (page >= 1);
        },
      
        /**
         * @desc Converts a paginator object ot a parameter one ready
         *       to be serialized.
         * @return {Object}
         **/
        "toParameters": function() {
            return {
                "currentPage": this.currentPage(),
                "itemCountPerPage": this.itemCountPerPage()
            };
        },
        
        /**
         * @desc Reload the paginator data.
         * @param {Object} - Holding the paginator data.
         **/
        "reload": function (definition) {
            this.load(definition);
            this._currentPage(definition.currentPage);
            this.currentPageWrap(this.currentPage());
        }
    };

    kg.addComponent('Paginator', Paginator);
})(kg);
