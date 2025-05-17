
// * * * Fonction d'initialisation automatique * * *
let affich, clog, show ;
let init = async function(context, affichFn, clogFn, showFn) {
    if (affichFn != undefined) { affich = affichFn ; }
    if (clogFn !=   undefined) { clog   = clogFn ; }
    if (showFn !=   undefined) { show   = showFn ; }
    affich('Coucou, execution automatique') ;
}

// * * * Export des fonctions * * * 
module.exports = {
    init
}