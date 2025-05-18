
// * * * Fonction d'initialisation automatique * * *
let affich, clog, show ;
let init = async function(context, affichFn, clogFn, routines) {
    if (affichFn != undefined)        { affich = affichFn ; }
    if (clogFn !=   undefined)        { clog   = clogFn ; }
    if (routines.show !=   undefined) { show = routines.show ; }
    affich(' ') ;
    affich('Coucou, execution automatique') ;
    affich(routines.dossierWorkspace()) ;
    affich(routines.resolutionChemin('./TOTO')) ;
    affich('') ;
}

// * * * Export des fonctions * * * 
module.exports = {
    init
}