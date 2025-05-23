"use strict";

const vscode  = require('vscode') ;
const path    = require('path') ;
const fs      = require('fs') ;
const relance = '* * * Relancer VsCode * * *' ;
const outputMngr = require('./outputMngr.js') ;

// ===================================================================================
//  M   M   OOO   DDD    U   U  L      EEEEE       M   M    A     CCC   RRRR    OOO
//  MM MM  O   O  D  D   U   U  L      E           MM MM   A A   C   C  R   R  O   O
//  M M M  O   O  D   D  U   U  L      EEE         M M M  A   A  C      R   R  O   O
//  M   M  O   O  D   D  U   U  L      E           M   M  AAAAA  C      RRRR   O   O
//  M   M  O   O  D  D   U   U  L      E           M   M  A   A  C   C  R  R   O   O
//  M   M   OOO   DDD     UUU   LLLLL  EEEEE       M   M  A   A   CCC   R   R   OOO
// ===================================================================================
// * * * Module Macro

exports.macro = async function macro(context) { 
    // * * Sorties * * 
    const clog       = require('./clog.js').clog ;
    outputMngr.setContext(context) ;
    outputMngr.clear(true) ;

    // * * Récupération Macro * * 
    let fichier = vscode.window.activeTextEditor.document.uri.fsPath ;
    let nomModule = path.basename(fichier, path.extname(fichier)) ;
    outputMngr.affich('Macro    : "' + fichier + '"') ;
    clog('Macro    : ' + fichier) ;
    
    // * * Lecture * *
    let contenu = fs.readFileSync(fichier, 'utf8') ;
    let lastPos = contenu.lastIndexOf('module.exports') ;
    contenu = contenu.substring(lastPos).split('{')[1].split('}')[0] ;
    contenu = contenu.replaceAll(' ', '').replaceAll("\r", '').replaceAll("\n", '') ;
    let listeFonctions = contenu.split(',') ;

    // * * Require Node * *
    const module = require(fichier) ;

    // * * Routines à passer * *
    let routines = {
        show: outputMngr.show,
        dossierWorkspace,
        resolutionChemin,
        ouvrirEditeurATraiter,
        choisirFichier,
        choisirDossier,
        dateHeureDuJour
    }

    // * * Preparation selecteur * * 
    let listeOptions = [] ;
    let initPresent  = false ;
    for (let mc of listeFonctions) {
        if (mc == 'init') {
            clog('Init     : présent') ;
            outputMngr.affich('Init     : présent') ;
            initPresent = true ;
            await module.init(context, outputMngr.affich, clog, routines) ; 
        } else {
            listeOptions.push({label: 'fonction : '+ mc, value: mc}) ;
        }
    }
    if (listeOptions.length > 0) {
        listeOptions.push({label: relance, value: relance})

        // * * Liste déroulante : Le plus simple * *
        let result = await vscode.window.showQuickPick(listeOptions, {title: 'Choisisser la macro :', ignoreFocusOut: true});
        if (result != undefined) {
            let choix = result.value ;
            if (choix == relance) {
                vscode.commands.executeCommand('workbench.action.reloadWindow');
            } else {
                vscode.window.showInformationMessage('Execution : ' + nomModule + ' / ' + choix) ;
                outputMngr.affich('Fonction : "'+ choix + '"') ;
                outputMngr.affich('********************************************************************') ;
                clog('Fonction : '+ choix) ;
                await module[choix](context, outputMngr.affich, clog, routines) ;
                outputMngr.affich('* * * Retour Appel "'+choix+'" * * *') ;
                clog('* * * Retour Appel "'+choix+'" * * *') ;
            }
        }
    }
    else if(initPresent) {
        outputMngr.affich('* * * Retour Appel "init" * * *') ;
        clog('* * * Retour Appel "init" * * *') ;
    }

}


// ==============================================================
//  FFFFF   OOO   N   N   CCC   TTTTT  III   OOO   N   N   SSS
//  F      O   O  NN  N  C   C    T     I   O   O  NN  N  S
//  FFF    O   O  N N N  C        T     I   O   O  N N N   SSS
//  F      O   O  N  NN  C        T     I   O   O  N  NN      S
//  F      O   O  N   N  C   C    T     I   O   O  N   N      S
//  F       OOO   N   N   CCC     T    III   OOO   N   N  SSSS
// ==============================================================
// * * * Fonctions

// Le dossier principal du workspace
const dossierWorkspace = function() {
    return vscode.workspace.workspaceFolders[0].uri.fsPath ;
} 
// Calcul d'un chemin à partir d'une adresse relative
const resolutionChemin = function(chemin) {
    if (chemin.substring(0,2) == './' || chemin.substring(0,3) == '../') {
        return path.join(dossierWorkspace() + '/' + chemin) ;
    } else {
        return path.join(chemin) ;
    }
}
// Ouvrir un autre editeur pour traitement
const ouvrirEditeurATraiter = async function() {
    let base = vscode.window.activeTextEditor.document.uri.fsPath ;
    let result = await vscode.window.showQuickPick([
            { label: "Oui, un nouveau fichier est édité", value: 'Oui' },
            { label: "Annuler", value: 'Annuler' }
        ],
        {title: 'Editer le fichier à traiter :', ignoreFocusOut: true}
    );

    if (result.value == 'Annuler' || base == vscode.window.activeTextEditor.document.uri.fsPath) {
        outputMngr.affich('Pas de fichier ouvert !')
        return undefined ;
    } else {
        return vscode.window.activeTextEditor.document.uri.fsPath ;
    }
}
// Choisir un fichier
const choisirFichier = async function(libelle, filtre) {
    const options = {
        canSelectMany: false,
        canSelectFiles: true,
        canSelectFolders: false,
        defaultUri: vscode.workspace.workspaceFolders[0].uri,
        openLabel: libelle,
        filters: filtre
    };
    const fileUri = await vscode.window.showOpenDialog(options);
    if (fileUri && fileUri[0]) {
        return fileUri[0].fsPath ;
    } else {
        return undefined ;
    }
}
// Choisir un dossier
const choisirDossier = async function(libelle) {
    const options = {
        canSelectMany: false,
        canSelectFiles: false,
        canSelectFolders: true,
        defaultUri: vscode.workspace.workspaceFolders[0].uri,
        openLabel: libelle
    };
    const fileUri = await vscode.window.showOpenDialog(options);
    if (fileUri && fileUri[0]) {
        return fileUri[0].fsPath ;
    } else {
        return undefined ;
    }
}
// Date et Heure du jour
const dateHeureDuJour = function(format) {
    let dt = new Date() ;
    let hh = (''+dt.getHours()).padStart(2,'0') ;
    let mm = (''+dt.getMinutes()).padStart(2,'0') ;
    let ss = (''+dt.getSeconds()).padStart(2,'0') ;
    let JJ = (''+dt.getDate()).padStart(2,'0') ;
    let MM = (''+(1+dt.getMonth())).padStart(2,'0') ;
    let SSAA = (''+dt.getFullYear()).padStart(2,'0') ;
    let AA = SSAA.slice(2) ;
    format = format.replace('SSAA', SSAA).replace('AA', AA).replace('MM', MM).replace('JJ', JJ)
    format = format.replace('hh', hh).replace('mm', mm).replace('ss', ss) ;
    return format ;
}