# bo Macro Node.js

Cette extension permet d'activer un module node.js présent dans l'éditeur de code, et de choisir une des fonctions présentes pour la lancer.

Ce qui correspond ni plus ni moins qu'à executer des macros node.js.

En paramètre des fonctions, on rencontre les paramètres suivants : 
- context : Le contexte vscode
- affich : une fonction qui permet d'ecrire dans la sortie "Macro Node.js"
- clog : une fonction pour écrire dans la console.
- routines : qui contient des fonctions complémentaires :
    - routines.dossierWorkspace() : Pour récupérer l'adresse du workspace en cours.
    - routines.resolutionChemin() : Pour résoudre un chemin relatif dans le workspace.
    - await routines.ouvrirEditeurATraiter() : Qui demande à ouvrir un nouveau fichier pour en récupérer l'adresse.
    - await routines.choisirFichier('Choisir un fichier...',{'Images': ['png', 'jpg', 'gif']}) : Choix d'un fichier
    - await routines.choisirDossier('Choisir un Dossier...') : choix d'un dossier
    - routines.dateHeureDuJour('SSAA-MM-JJ hh:mm:ss') : Pour récupérer une date du jour formatée.
    - routines.execCmd('Sgit status') : Pour passer une commande terminal.
    - routines.fs : le module fs
    - routines.path : le module path
    - routines.iconv : le module iconv-lite
    - routines.readFileSync(fichier, encodage) : pour lire un fichier avec tout les encodages possibles.
    - routines.writeFileSync(fichier, contenu, encodage) : pour écrire un fichier avec tout les encodages possibles.

On peut aussi déclarer une fonction "init" qui sera directement executé sans choix préalable.

## Exemples de fichier macro :

Exemple 1 :

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
        affich(routines.execCMD('ls -al')) ;
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

Exemple 2 :

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
        affich(await routines.ouvrirEditeurATraiter()) ;
        affich(routines.dateHeureDuJour('SSAA-MM-JJ hh:mm:ss')) ;
        affich(routines.execCMD('ls -al')) ;
    }

    // * * * Export des fonctions * * * 
    module.exports = {
        init
    }
