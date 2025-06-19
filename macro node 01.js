// * * * Fonction d'initialisation automatique * * *
let affich, clog, routines ;
let init = async function(context, affichFn, clogFn, routinesFn) {
    if (affichFn   != undefined)  { affich = affichFn ; }
    if (clogFn     != undefined)  { clog   = clogFn ; }
    if (routinesFn != undefined)  { routines = routinesFn ; }
}

// * * * Exemple de fonction * * * 
let gros_COUCOU = async function(context, affich, clog, routines) {
    affich('GROS COUCOU') ;
    affich(routines.dossierWorkspace()) ;
    affich(routines.resolutionChemin('./TOTO')) ;
    affich(await routines.ouvrirEditeurATraiter()) ;
    affich(await routines.choisirFichier('Choisir un fichier...',{'Images': ['png', 'jpg', 'gif']})),
    affich(await routines.choisirDossier('Choisir un Dossier...')),
    affich(routines.dateHeureDuJour('SSAA-MM-JJ hh:mm:ss')) ;
    affich(routines.execCmd('ls -al')) ;
    routines.show() ;
}
// * * * Exemple de fonction * * * 
let petit_Coucou = async function(context, affich) {
    affich('petit coucou') ;
}
// * * * Export des fonctions * * * 
module.exports = {
    init, gros_COUCOU, petit_Coucou
}