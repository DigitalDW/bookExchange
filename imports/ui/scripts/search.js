import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
// import "../../api/scraping.js";
import Swal from 'sweetalert2';

import '../templates/formulaireVente.html';
import { LivresDB } from '../../api/livresDB';

Template.formVente.onCreated(function(){
    let isbn = FlowRouter.getParam('isbn');
    if(isbn.legnth == 10 || isbn.length == 13){
        Session.set("isbn", isbn);
        $.getJSON(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`)
        .then(res => {
            if(typeof res.items !== "undefined"){
                console.log(res.items[0])
                Session.set("titleGB", res.items[0].volumeInfo.title);
                Session.set("authorGB", res.items[0].volumeInfo.authors[0]);
                Session.set("publishedAtGB", res.items[0].volumeInfo.publishedDate.split("-")[0]);
                Session.set("imgGB", res.items[0].volumeInfo.imageLinks.thumbnail)
                console.log(Session.get("imgGB"))
            }
        })

        Meteor.call('scrapeBook', `https://www.goodreads.com/search/index.xml?key=qAcYmYvPix9QPfBwUXOoQ&q=${isbn}`, (error, result) => {
            if (result) {
                console.log(result)
                Session.set("titleGR", result[0]);
                Session.set("authorGR", result[1]);
                Session.set("publishedAtGR", result[2]);
                Session.set("imgGR", result[3]);
            }
            if (error) {
                Swal.fire({
                    type: 'error',
                    title: "Une erreur s'est produite",
                    text: error.message,
                });
            }
        })
    }
})

Template.formVente.helpers({
    title: () => Session.get("method") == "gb" ? Session.get("titleGB") : Session.get("method") == "gr" ? Session.get("titleGR") : typeof Session.get("titleGB") != "undefined" ? Session.get("titleGB") : Session.get("titleGR") != "" ? Session.get("titleGR") : "",
    author: () => Session.get("method") == "gb" ? Session.get("authorGB") : Session.get("method") == "gr" ? Session.get("authorGR") : typeof Session.get("authorGB") != "undefined" ? Session.get("authorGB") : Session.get("authorGR") != "" ? Session.get("authorGR") : "",
    parution: () => Session.get("method") == "gb" ? Session.get("publishedAtGB") : Session.get("method") == "gr" ? Session.get("publishedAtGR") : typeof Session.get("publishedAtGB") != "undefined" ? Session.get("publishedAtGB") : Session.get("publishedAtGR") != "" ? Session.get("publishedAtGR") : "",
    ean: () => Session.get("isbn"),
    isbn: () => Session.get("isbn"),
    anneeMax: () => {
        date = new Date
        return date.getFullYear()
    }
})

Template.formVente.events({
    "click #returnToScan": (e, i) => {
        e.preventDefault();
        Session.set("accessedScan", "/vente/0")
        FlowRouter.go("/scanner")
    },
    "click #scanMyId": (e, i) => {
        e.preventDefault();
        let isbn = document.getElementById("inputEAN").value;

        Session.set("isbn", isbn)

        if(isbn.legnth == 10 || isbn.length == 13){
            Swal.fire(
                {
                type: "info",
                background: "#3A3F44",
                showConfirmButton: false,
                html:
                    `<p style="color:#e9ecef">
                        Nous interrogeons nos bases de données, veuillez patienter.
                    </p>
                    <div class="loader"></div>`,
                }
            )
            $.getJSON(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`)
            .then(res => {
                if(typeof res.items !== "undefined"){
                    Swal.fire({
                        type: 'success',
                        background: "#3A3F44",
                        confirmButtonColor: "rgb(156, 164, 170)",
                        cancelButtonColor: "rgb(92, 98, 102)",
                        html:
                            `<h2 style="color:#e9ecef">Nous avons trouvé un livre</h2>
                            <p style="color:#e9ecef">
                                Le livre trouvé est: "${res.items[0].volumeInfo.title}" <br>
                                Est-ce bien votre livre ?
                            </p>`,
                        showCancelButton: true,
                        confirmButtonText: "Oui !",
                        cancelButtonText: "Non !",
                        preConfirm: () => {
                            Session.set("titleGB", res.items[0].volumeInfo.title);
                            Session.set("authorGB", res.items[0].volumeInfo.authors[0]);
                            Session.set("publishedAtGB", res.items[0].volumeInfo.publishedDate.split("-")[0]);
                        }
                    }).then(res => {
                        if(res.dismiss === Swal.DismissReason.cancel){
                            Swal.fire(
                                {
                                type: "info",
                                background: "#3A3F44",
                                showConfirmButton: false,
                                html:
                                    `<p style="color:#e9ecef">
                                        Nous interrogeons une autre base de données, veuillez patienter.
                                    </p>
                                    <div class="loader"></div>`,
                                }
                            )
                            Meteor.call('scrapeBook', `https://www.goodreads.com/search/index.xml?key=qAcYmYvPix9QPfBwUXOoQ&q=${isbn}`, (error, result) => {
                                if (result) {
                                    if(result[0] != ""){
                                        Swal.fire({
                                            type: 'success',
                                            background: "#3A3F44",
                                            confirmButtonColor: "rgb(156, 164, 170)",
                                            cancelButtonColor: "rgb(92, 98, 102)",
                                            html:
                                                `<h2 style="color:#e9ecef">Nous avons trouvé un autre livre !</h2>
                                                <p style="color:#e9ecef">
                                                    Nous avons trouvé: "${result[0]}" <br/>
                                                    Est-ce bien votre livre ?
                                                </p>`,
                                            confirmButtonText: "Oui !",
                                            showCancelButton: true,
                                            cancelButtonText: "Non...",
                                            preConfirm: () => {
                                                Session.set("titleGB", result[0]);
                                                Session.set("authorGB", result[1]);
                                                Session.set("publishedAtGB", result[2]);
                                            }
                                        }).then(res => {
                                            if(res.dismiss === Swal.DismissReason.cancel){
                                                Swal.fire({
                                                    type: "info",
                                                    background: "#3A3F44",
                                                    confirmButtonColor: "rgb(156, 164, 170)",
                                                    html:
                                                        `<h2 style="color:#e9ecef">Désolé !</h2>
                                                        <p style="color:#e9ecef">
                                                            Nous n'avons pas trouvé votre livre <br/>
                                                            Il faudra entrer ses informations à la main... <br/>
                                                            Nous nous excusons pour le dérangement et nous travaillerons pour
                                                            résoudre ce problème !
                                                        </p>`,
                                                })
                                            }
                                        })
                                    }else{
                                        Swal.fire({
                                            type: 'error',
                                            background: "#3A3F44",
                                            confirmButtonColor: "rgb(156, 164, 170)",
                                            cancelButtonColor: "rgb(92, 98, 102)",
                                            html:
                                                `<h2 style="color:#e9ecef">Aucun livre n'a été trouvé !</h2>
                                                <p style="color:#e9ecef">
                                                    Aucune nos bases de données ne contient votre livre. 
                                                    Ou alors, votre ISBN est erroné. <br/>
                                                    Essayez de retaper votre ISBN.
                                                </p>`,
                                            confirmButtonText: "Réessayer",
                                        })
                                    }
                                }
                                if (error) {
                                    Swal.fire({
                                        type: 'error',
                                        title: "Une erreur s'est produite",
                                        text: error.message,
                                    });
                                }
                            })
                        }
                    })
                } else {
                    Meteor.call('scrapeBook', `https://www.goodreads.com/search/index.xml?key=qAcYmYvPix9QPfBwUXOoQ&q=${isbn}`, (error, result) => {
                        if (result) {
                            Swal.fire({
                                type: 'success',
                                background: "#3A3F44",
                                confirmButtonColor: "rgb(156, 164, 170)",
                                cancelButtonColor: "rgb(92, 98, 102)",
                                html:
                                    `<h2 style="color:#e9ecef">Nous avons trouvé un livre !</h2>
                                    <p style="color:#e9ecef">
                                        Nous avons trouvé: "${result[0]}" <br/>
                                        Est-ce bien votre livre ?
                                    </p>`,
                                confirmButtonText: "Oui !",
                                showCancelButton: true,
                                cancelButtonText: "Non...",
                                preConfirm: () => {
                                    Session.set("titleGB", result[0]);
                                    Session.set("authorGB", result[1]);
                                    Session.set("publishedAtGB", result[2]);
                                }
                            }).then(res => {
                                if(res.dismiss === Swal.DismissReason.cancel){
                                    Swal.fire({
                                        type: 'error',
                                        background: "#3A3F44",
                                        confirmButtonColor: "rgb(156, 164, 170)",
                                        cancelButtonColor: "rgb(92, 98, 102)",
                                        html:
                                            `<h2 style="color:#e9ecef">Aucun livre n'a été trouvé !</h2>
                                            <p style="color:#e9ecef">
                                                Aucune nos bases de données ne contient votre livre. 
                                                Ou alors, votre ISBN est erroné. <br/>
                                                Essayez de retaper votre ISBN.
                                            </p>`,
                                        confirmButtonText: "Réessayer",
                                    })
                                }
                            })
                        }
                        if (error) {
                            Swal.fire({
                                type: 'error',
                                title: "Une erreur s'est produite",
                                text: error.message,
                            });
                        }
                    })
                }
            })
        }else{
            Swal.fire({
                type: 'error',
                background: "#3A3F44",
                confirmButtonColor: "rgb(156, 164, 170)",
                html:
                    `<h2 style="color:#e9ecef">Code EAN invalide</h2>
                    <p style="color:#e9ecef">
                        Veuillez vous vérifier votre EAN (soit 10, soit 13 caractères).
                    </p>`,
            })
        }
    },
    "submit form": function(event){
        event.preventDefault();
        let isbn = event.target.inputISBN.value;
        const titre = event.target.inputTitre.value;
        const auteur = event.target.inputAuteur.value;
        let editeur = event.target.inputEditeur.value;
        let collection = event.target.inputCollection.value;
        let parution = event.target.inputParution.value;
        let format = event.target.inputFormat.value;
        let genre = event.target.inputGenre.value;
        const prix = event.target.inputPrix.value;
        let etat = event.target.inputEtat.value;
        let faculte = event.target.inputFaculte.value;
        let enseignant = event.target.inputEnseignant.value;

        if(titre == "" || auteur == "" || prix == ""){
            Swal.fire({
                type: "error",
                background: "#3A3F44",
                confirmButtonColor: "rgb(156, 164, 170)",
                html:
                    `<h2>Attention !</h2>
                    <p style="color:#e9ecef">
                        Veuillez renseigner un titre, un auteur et un prix.
                    </p>`,
            })
        }else{
            Meteor.call(
                "livre.add", 
                isbn, 
                titre, 
                auteur, 
                editeur == "" ? editeur = "-" : editeur, 
                collection == "" ? collection = "-" : collection, 
                parution, 
                format, 
                genre, 
                prix, 
                etat, 
                faculte, 
                enseignant,
                Meteor.userId(),
                Meteor.users.findOne(Meteor.userId()).emails[0].address,
                Session.get("method") == "gb" ? Session.get("imgGB") : Session.get("imgGR"),
                function(err, val){
                    if(err){
                        Swal.fire({
                            type: "error",
                            title: err.message
                        })
                    }else{
                        event.target.inputISBN.value = ""
                        event.target.inputTitre.value = ""
                        event.target.inputAuteur.value = ""
                        event.target.inputEditeur.value = ""
                        event.target.inputCollection.value = ""
                        event.target.inputParution.value = ""
                        event.target.inputFormat.value = "Autre"
                        event.target.inputGenre.value = "Autre"
                        event.target.inputEtat.value = "Neuf"
                        event.target.inputPrix.value = ""
                        event.target.inputFaculte.value = "Autre"
                        event.target.inputEnseignant.value = ""
                        let pathAccessBook = "/livre/" + val;
                        FlowRouter.go(pathAccessBook);
                    }
                }
            );
        }
    },
    "click #button-cancel": function(event){
        event.preventDefault();
        Swal.fire({
            type: "warning",
            background: "#3A3F44",
            confirmButtonColor: "rgb(156, 164, 170)",
            cancelButtonColor: "rgb(92, 98, 102)",
            html:
                `<h2 style="color:#e9ecef">Attention !</h2>
                <p style="color:#e9ecef">
                    Êtes-vous sûr de vouloir annuler ?
                </p>`,
            showCancelButton: true,
            confirmButtonText: "Oui",
            cancelButtonText: "Non",
            preConfirm: () => {
                FlowRouter.go("/uniBooks");
            }
        })
    },
})