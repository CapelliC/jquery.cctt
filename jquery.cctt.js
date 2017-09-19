/*
 * Handle multilevel folding of TABLE
 * 
 * A TR with class 'expanded' or 'collapsed' gets
 *  a fold-state indicator in TD with class 'control'
 *  and related behaviour
 * 
 * There are performance considerations that hint to avoid visibility
 *  tests so this assumption is done: the table need to be entirely
 *  visible, except bodies
 * 
 * author: Capelli Carlo
 * license: MIT
 */

;(function($) {

    const trace = console.log
    
    var methods = {
        
        // defaults augmented by user
        settings: {},
        
        initializeDOM: function(options) {

            methods.settings = $.extend({}, this.cctt.defaults, options)
            
            // apply on each TBODY
            return this.each(function() {
                $(this).children('TBODY').each(function() {
                    methods.init_tbody($(this))
                })
            })
        },

        // get each sub TR on a TR branch
        row_tree: function(TR) {
trace('row_tree', this, TR)
            var TD = TR.children('.cctt-control')
            if (TD.length === 1) {
                // level = index of TD.control (should exists)
                var ic = TD.index()
                var rows = []
                TR.nextAll().each(function() {
                    var RS = $(this)

                    // on a control RS ?
                    var CS = RS.children('.cctt-control')
                    if (CS.length === 1) {
                        
                        // bail out ASAP
                        var csi = CS.index()
                        if (csi <= ic)
                            return false    // we're done
                    }
                    rows.push(RS)
                })
                return rows
            }
        },
        

        // implement (kind of) state machine
        //      
        init_tbody: function(TBODY) {

            var state = { skip: 0, hide: 1, show: 2 }
            
            // use event delegation to deal with toggling classes
            // suggestion by http://stackoverflow.com/a/16547457/874024
            TBODY.on('click', '.cctt-control', function() {

                var TD = $(this)
                var TR = $(TD.parent())

                // action = on expanded ? hide : show
                var ac = TR.is('.cctt-expanded') ? state.hide : state.show
                var a0 = ac
                
                // level = index of TD.control (should exists)
                var ic = TD.index()

                // keep a stack
                var st = [{action: ac, level: ic}]
                function top() { return st[st.length - 1] }

                // foreach sibling RS
                TR.nextAll().each(function() {
                    var RS = $(this)

                    // on a control RS ?
                    var CS = RS.children('.cctt-control')
                    if (CS.length === 1) {
                        
                        // bail out ASAP
                        var csi = CS.index()
                        if (csi <= ic)
                            return false    // we're done

                        // get the current level status
                        while (top().level >= csi)
                            st.pop()
                        
                        ac = top().action
                        if (RS.is('.cctt-collapsed')) {
                            // assume related rows already set
                            st.push({action: state.skip, level: csi})
                        }
                        else {
                            // hide/show are clearly asymmetric
                            if (a0 === state.hide)
                                st.push({action: a0, level: csi})
                            else
                                st.push({action: ac, level: csi})
                        }
                    }
                    
                    // apply current action to current sibling
                    if (ac === state.hide)
                        RS.hide()
                    else if (ac === state.show)
                        RS.show()

                    // next sibling processing
                    ac = top().action
                })
                
                
                TR.toggleClass('cctt-expanded cctt-collapsed')
            })
        },


        // implement (kind of) state machine
        //      
        ____init_tbody: function(TBODY) {

            var state = { skip: 0, hide: 1, show: 2 }
            
            // use event delegation to deal with toggling classes
            // suggestion by http://stackoverflow.com/a/16547457/874024
            TBODY.on('click', 'TR.cctt-expanded,TR.cctt-collapsed',
                function(e) {
trace('in exp')
                    e.preventDefault()
//dont' work - activate the first datepicker
//e.stopPropagation()
//e.stopImmediatePropagation()

                var TR = $(this)
                var TD = TR.children('.cctt-control')
                if (TD.length === 1) {
                    // on a control TR (.expanded || .collapsed)
                    
                    // action = on expanded ? hide : show
                    var ac = TR.is('.cctt-expanded') ? state.hide : state.show
                    var a0 = ac
                    
                    // level = index of TD.control (should exists)
                    var ic = TD.index()

                    // keep a stack
                    var st = [{action: ac, level: ic}]
                    function top() { return st[st.length - 1] }
//trace('in loop', ic)
                    // foreach sibling RS
                    TR.nextAll().each(function() {
                        var RS = $(this)

                        // on a control RS ?
                        var CS = RS.children('.cctt-control')
//trace('in nextAll', RS, CS.length)
                        if (CS.length === 1) {
                            
                            // bail out ASAP
                            var csi = CS.index()
//trace('csi', csi)
                            if (csi <= ic)
                                return false    // we're done

                            // get the current level status
                            while (top().level >= csi)
                                st.pop()
                            
                            ac = top().action
                            if (RS.is('.cctt-collapsed')) {
                                // assume related rows already set
                                st.push({action: state.skip, level: csi})
                            }
                            else {
                                // hide/show are clearly asymmetric
                                if (a0 === state.hide)
                                    st.push({action: a0, level: csi})
                                else
                                    st.push({action: ac, level: csi})
                            }
                        }
                        
                        // apply current action to current sibling
//trace('ac === state.hide', ac, ac === state.hide)
                        if (ac === state.hide)
                            RS.hide()
                        else if (ac === state.show)
                            RS.show()

                        // next sibling processing
                        ac = top().action
                    })
                }
                
                TR.toggleClass('cctt-expanded cctt-collapsed')
            })
        },

        // utility currency
        // from https://stackoverflow.com/a/29347112/874024
        parsePotentiallyGroupedFloat : function(value) {
            if (typeof value === 'string') {
                var result = (value = value.trim()).replace(/[^0-9]/g, '')
                if (/[,\.]\d{2}$/.test(value))
                    result = result.replace(/(\d{2})$/, '.$1')
                return parseFloat(result)
            }
            return parseFloat(value)
        },
        
        currency: function(field) {
            var s = $(field).val().trim()
            if (s.length > 0)
                return $().cctt('parsePotentiallyGroupedFloat', s)
            return 0;
        },
        
        fmtcurrency: function(c) {
            var R = $().cctt('parsePotentiallyGroupedFloat', c).toLocaleString('it-IT', {maximumFractionDigits:2, minimumFractionDigits:2})
            return R
        },
        euros: function(field) {
            var c = $().cctt('currency', field)
            var f = $().cctt('fmtcurrency', c)
            return f + " €"
        },
        setcurrency: function(field, c) {
            $(field).val($().cctt('fmtcurrency', c))
        },
        
    }
    
    // standard dispatch of method
    $.fn.cctt = function(method) {
        if (methods[method]) {
            if (arguments.length == 1)  // 
                return methods[method]
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1))
        }
        if (typeof method === 'object' || !method)  // binding to construct
            return methods.initializeDOM.apply(this, arguments)
        $.error('Method `' + method + '` does not exists for jQuery.cctt')
    }

    $.fn.cctt.defaults = {
    }
    
})(jQuery);
