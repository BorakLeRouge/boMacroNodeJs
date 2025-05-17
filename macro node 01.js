
// * * * Fonction d'initialisation automatique * * *
let affich, clog, show ;
let init = async function(context, affichFn, clogFn, showFn) {
    if (affichFn != undefined) { affich = affichFn ; }
    if (clogFn !=   undefined) { clog   = clogFn ; }
    if (showFn !=   undefined) { show   = showFn ; }
}

// * * * Exemple de fonction * * * 
let gros_COUCOU = async function(context, affich) {
    affich('GROS COUCOU') ;
}
// * * * Exemple de fonction * * * 
let petit_Coucou = async function(context, affich, clog) {
    affich('petit coucou') ;
    clog('petit coucou') ;
}
// * * * Export des fonctions * * * 
module.exports = {
    init, gros_COUCOU, petit_Coucou
}