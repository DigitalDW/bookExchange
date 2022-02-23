import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const LivresDB = new Mongo.Collection('livresDB');

if(Meteor.isServer){
    Meteor.methods({
        "livre.add": function(isbn, titre, auteur, editeur, 
            collection, parution, format, genre, prix, etat, faculte, enseignant, vendeurID, vendeurMail, img){
            check(isbn, String);
            check(titre, String);
            check(auteur, String);
            check(editeur, String);
            check(collection, String);
            check(parution, String);
            check(format, String);
            check(genre, String);
            check(prix, String);
            check(etat, String);
            check(faculte, String);
            check(enseignant, String);
            check(vendeurID, String);
            check(vendeurMail, String);
            if(img!=null){
                check(img, String);
            }else{
                img=""
            }
            
            //fonction de la DB méthode livres.add
            return LivresDB.insert( { 
                isbn: isbn,
                title: titre,
                author: auteur,
                editor: editeur,
                collection: collection,
                release: parution,
                format: format,
                genre: genre,
                price: prix,
                condition: etat,
                faculty: faculte,
                teacher: enseignant,
                sellerID: vendeurID,
                sellerMail: vendeurMail,
                img: img,
                createdAt: new Date()
            } )
        },
        "livre.getInfo": function(livreID){
            check(livreID, String);
            return LivresDB.findOne(livreID)
        },

        "livre.getAll": function(){
            return LivresDB.find({}).fetch()
        },

        "livre.getFromUser": function(userId){
            return LivresDB.find({ sellerID: userId }).fetch()
        },

        "livre.getQuery": function(queryParam, query, querySection){
            check(query, String);
            let vals = LivresDB.find({})
            if (querySection == "Indifférent") {
                let results = [];
                if (queryParam == "Titre") {
                    let valeurTest = query.toLowerCase()
                    let reg = new RegExp("\\b" + valeurTest + "\\b")
                    vals.forEach(elem => {
                        let elemTest = elem.title.toLowerCase()
                        if (elemTest.match(reg) != null) {
                            results.push(elem);
                        }
                    })
                    return results
                } else if (queryParam == "Auteur/e") {
                    let valeurTest = query.toLowerCase()
                    let reg = new RegExp("\\b" + valeurTest + "\\b")
                    vals.forEach(elem => {
                        let elemTest = elem.author.toLowerCase()
                        if (elemTest.match(reg) != null) {
                            results.push(elem);
                        }
                    })
                    return results
                } else if (queryParam == "Professeur/e") {
                    let valeurTest = query.toLowerCase()
                    let reg = new RegExp("\\b" + valeurTest + "\\b")
                    vals.forEach(elem => {
                        let elemTest = elem.teacher.toLowerCase()
                        if (elemTest.match(reg) != null) {
                            results.push(elem);
                        }
                    })
                    return results
                }
            } else {
                let results = [];
                if (queryParam == "Titre") {
                    let valeurTest = query.toLowerCase()
                    let reg = new RegExp("\\b" + valeurTest + "\\b")
                    vals.forEach(elem => {
                        let elemTest = elem.title.toLowerCase()
                        console.log(elem.faculty)
                        if (elemTest.match(reg) != null && elem.faculty == querySection) {
                            results.push(elem);
                        }
                    })
                    return results
                } else if (queryParam == "Auteur/e") {
                    let valeurTest = query.toLowerCase()
                    let reg = new RegExp("\\b" + valeurTest + "\\b")
                    vals.forEach(elem => {
                        let elemTest = elem.author.toLowerCase()
                        if (elemTest.match(reg) != null && elem.faculty == querySection) {
                            results.push(elem);
                        }
                    })
                    return results
                } else if (queryParam == "Professeur/e") {
                    let valeurTest = query.toLowerCase()
                    let reg = new RegExp("\\b" + valeurTest + "\\b")
                    vals.forEach(elem => {
                        let elemTest = elem.teacher.toLowerCase()
                        if (elemTest.match(reg) != null && elem.faculty == querySection) {
                            results.push(elem);
                        }
                    })
                    return results
                }
            }    
        },

        "livre.remove": function(livreID){
            check(livreID, String);
            LivresDB.remove( {_id: livreID} )
        },

        "livre.modify": function(livreID, newPrice, newCondition, newTeacher, newFaculty){
            check(livreID, String);
            LivresDB.update( {_id: livreID}, {$set: {
                price: newPrice,
                condition: newCondition, 
                teacherName: newTeacher,
                faculty: newFaculty,
            }} )
        },
    })
}