# bo Macro Node.js

Cette extension permet d'activer un module node.js présent dans l'éditeur de code, et de choisir une des fonctions présentes pour la lancer.

Ce qui correspond ni plus ni moins qu'à executer des macros node.js.

En paramètre des fonctions, on rencontre les paramètres suivants : 
- context : Le contexte vscode
- affich : une fonction qui permet d'ecrire dans la sortie "Macro Node.js"
- clog : une fonction pour écrire dans la console.

On peut aussi déclarer une fonction "init" qui sera directement executé sans choix préalable.
Avec un paramètre supplémentaire :
- show : Fonction qui permet d'afficher la sortie "Macro Node.js"

## Exemples de fichier macro :

Exemple 1 :


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
        gros_COUCOU, petit_Coucou
    }

Exemple 2 :

    // * * * Fonction d'execution automatique * * *
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
