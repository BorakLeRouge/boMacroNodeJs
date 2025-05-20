    // * * * Fonction d'initialisation automatique * * *
    let affich, clog, routines ;
    let init = async function(context, affichFn, clogFn, routinesFn) {
        if (affichFn != undefined)        { affich = affichFn ; }
        if (clogFn !=   undefined)        { clog   = clogFn ; }
        if (routinesFn != undefined)      { routines = routinesFn ; }
        affich(' ') ;
        affich('Coucou, execution automatique') ;
        affich(routines.dossierWorkspace()) ;
        affich(routines.resolutionChemin('./TOTO')) ;
    }

    // * * * Export des fonctions * * * 
    module.exports = {
        init
    }