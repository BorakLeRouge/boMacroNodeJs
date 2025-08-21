"use strict";
 
const vscode  = require('vscode') ;
const path    = require('path') ;
const fs      = require('fs') ;
const iconv   = require('iconv-lite') ;
const relance = '* * * Relancer VsCode * * *' ;
const outputMngr = require('./outputMngr.js') ;
const clog       = require('./clog.js').clog ;
 
const referenceModule = [] ;
 
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
    outputMngr.setContext(context) ;
    outputMngr.clear(true) ;
 
    // * * Récupération Macro * *
    let fichier = vscode.window.activeTextEditor.document.uri.fsPath ;
    let nomModule = path.basename(fichier, path.extname(fichier)) ;
    outputMngr.affich('Macro    : "' + path.basename(fichier) + '"') ;
    clog('Macro    : ' + fichier) ;
   
    // * * Lecture * *
    let contenu   = fs.readFileSync(fichier, 'utf8') ;
    let lastPos   = contenu.lastIndexOf('module.exports') ;
    let fonctions = contenu.substring(lastPos).split('{')[1].split('}')[0] ;
    fonctions = fonctions.replaceAll(' ', '').replaceAll("\r", '').replaceAll("\n", '') ;
    let listeFonctions = fonctions.split(',') ;
 
    // * * Require Node * *
    if (referenceModule[nomModule] == undefined) {
        outputMngr.affich('Importation de la macro.') ;
        referenceModule[nomModule] = contenu ;
    } else if(referenceModule[nomModule] != contenu) {
        outputMngr.affich('Ré-importation de la macro.') ;
        referenceModule[nomModule] = contenu ;
        delete require.cache[require.resolve(fichier)];
    }
    const module = require(fichier) ;
 
    // * * Routines à passer * *
    let routines = {
        show: outputMngr.show,
        dossierWorkspace,
        resolutionChemin,
        ouvrirEditeurATraiter,
        choisirFichier,
        choisirDossier,
        dateHeureDuJour,
        execCmd,
        iconv, fs, path,
        readFileSync, writeFileSync
    }
 
    // * * Preparation selecteur * *
    let listeOptions = [] ;
    let initPresent  = false ;
    for (let mc of listeFonctions) {
        if (mc == 'init') {
            try {
                clog('Init     : présent') ;
                outputMngr.affich('Init     : présent') ;
                initPresent = true ;
                await module.init(context, outputMngr.affich, clog, routines) ;
            } catch(e) {
                vscode.window.showErrorMessage("Erreur d'execution de la macro init !") ;
                outputMngr.affich("Erreur d'execution de la macro init !") ;
                outputMngr.affich(e) ;
                return ;
            }
        } else {
            listeOptions.push({label: 'fonction : '+ mc, value: mc}) ;
        }
    }
    if (listeOptions.length > 0) {
        // listeOptions.push({label: relance, value: relance}) // Option pour relancer VsCode (plus nécéssaire)
 
        // * * Liste déroulante : Le plus simple * *
        let result = await vscode.window.showQuickPick(listeOptions, {title: 'Choisisser la macro :', ignoreFocusOut: true});
        if (result != undefined) {
            let choix = result.value ;
            if (choix == relance) {
                vscode.commands.executeCommand('workbench.action.reloadWindow');
            } else {
                try {
                    vscode.window.showInformationMessage('Execution : ' + nomModule + ' / ' + choix) ;
                    outputMngr.affich('Fonction : "'+ choix + '"') ;
                    outputMngr.affich('********************************************************************') ;
                    clog('Fonction : '+ choix) ;
                    await module[choix](context, outputMngr.affich, clog, routines) ;
                    outputMngr.affich('* * * Retour Appel "'+choix+'" * * *') ;
                    clog('* * * Retour Appel "'+choix+'" * * *') ;
                } catch(e) {
                    vscode.window.showErrorMessage("Erreur d'execution de la macro !") ;
                    outputMngr.affich("Erreur d'execution de la macro "+choix+" !") ;
                    outputMngr.affich(e) ;
                }
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
// Fonction ExecSync    
const execCmd = function(cmd, timeLimit=180000) {
    try {
        let cmdResult = require('child_process').execSync(
            cmd, { timeout: timeLimit
                , cwd: vscode.workspace.workspaceFolders[0].uri.fsPath
                , encoding: 'utf8' }
        ).toString() ;
        return cmdResult ;
    } catch(err) {
        clog('Erreur execCmd', err) ;
        outputMngr.affich('erreur Cmd :') ;
        outputMngr.affich(err) ;
        return ;
    }
}
// Lecture / Ecriture avec Encodage iconv
const readFileSync = function(file, encod='utf8') {
    if (['utf8', 'utf-8'].includes(encod.toLowerCase()))       { encod = 'utf8' ;}
    if (['latin15', 'latin-15'].includes(encod.toLowerCase())) { encod = 'ISO-8859-15' ;}
    if (['latin1', 'latin-1'].includes(encod.toLowerCase()))   { encod = 'ISO-8859-1' ;}
    let cont = fs.readFileSync(file) ;
    return iconv.decode(cont, encod) ;
}
const writeFileSync = function(file, contenu, encod='utf8') {
    if (['utf8', 'utf-8'].includes(encod.toLowerCase()))       { encod = 'utf8' ;}
    if (['latin15', 'latin-15'].includes(encod.toLowerCase())) { encod = 'ISO-8859-15' ;}
    if (['latin1', 'latin-1'].includes(encod.toLowerCase()))   { encod = 'ISO-8859-1' ;}
    let cont = iconv.encode(contenu, encod) ;
    fs.writeFileSync(file, cont) ;
}