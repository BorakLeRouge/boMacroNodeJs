"use strict";

const vscode  = require('vscode') ;
const path    = require('path') ;
const fs      = require('fs') ;
const { interfaces } = require('mocha');
const relance = '* * * Relancer VsCode * * *' ;

exports.macro = async function macro(context) { 
    // * * Sorties * * 
    const clog       = require('./clog.js').clog ;
    const outputMngr = require('./outputMngr.js') ;
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

    // * * Preparation selecteur * * 
    let listeOptions = [] ;
    let initPresent  = false ;
    for (let mc of listeFonctions) {
        if (mc == 'init') {
            clog('Init     : présent') ;
            outputMngr.affich('Init     : présent') ;
            initPresent = true ;
            await module.init(context, outputMngr.affich, clog, outputMngr.show) ; 
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
                await module[choix](context, outputMngr.affich, clog) ;
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