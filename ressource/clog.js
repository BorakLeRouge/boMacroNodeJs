"use strict";
// * * * Module CLOG à regroupement * * *
//   const {clog} = require('./clog.js') ;
//   const  clog  = function(...tb) { return ; } // Version inactive directe
//   ou
//   const clog = require('./clog.js').clog    //  clog / clogInactif

exports.clog = function clog(...tb) {

    let deb = (tb.length > 1) ;
    for (let ob of tb){
        if(deb) {
            if (typeof ob == 'string') {
                console.groupCollapsed('%c'+ob, 'color: red') ; deb = false ;
            } else {
                console.groupCollapsed(ob) ; deb = false ;
            }
        }
        else    {
            if (typeof ob == 'string') {
                console.log('%c'+ob, 'color: red') ;
            } else  {
                console.log(ob) ;
            }
        }
    }   if(tb.length > 1) console.groupEnd() ;

}
exports.clogInactif = function clog(...tb) { return ; }