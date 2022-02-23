import { Template } from "meteor/templating";
import { Session } from 'meteor/session';
import Swal from 'sweetalert2';

import "../templates/livre.html";

Template.livre.onCreated(function(){
    Meteor.call("livre.getInfo", FlowRouter.getParam("id"), function(err, val){
        if(err){
            console.log(err)
        }else{
            Session.set("resultat", val)
        }
    })
})

Template.livre.events({
    "click #returnToCatalogueButton": function(event){
        event.preventDefault();
        if (typeof Session.get("accessedBook") == "undefined") {
            FlowRouter.go("/uniBooks");
        } else {
            FlowRouter.go(Session.get("accessedBook"));
        }
    },
    "click #purchaseButton": function(event){
        event.preventDefault();
        let vendeur = Session.get("resultat").sellerMail;

        Swal.fire(
            {
            type: "info",
            background: "#3A3F44",
            showConfirmButton: false,
            html:
                `<p style="color:#e9ecef">
                    Votre demande est en cours de traitement, veuillez patienter.
                </p>
                <div class="loader"></div>`,
            }
        )

        Meteor.call(
            'sendEmail',
            vendeur,
            'noreply@unibook.com',
            'Demande d\'achat !',
            `
            Bonjour,

            ${Meteor.users.findOne(Meteor.userId()).emails[0].address} souhaite acheter votre livre: "${Session.get("resultat").title}".
            Nous vous laissons prendre contact avec cette personne pour que l'achat puisse se réaliser.

            Pour rappel, si la transaction a lieu, il vous est demandé d'aller supprimer manuellement l'offre: localhost:3000/mes_annonces.

            Merci d'avoir utilisé notre service !
            
            Cordialement,
            L'équipe UniBooks`,
            function(err){
                if(err){
                    Swal.fire({
                        type: "error",
                        background: "#3A3F44",
                        confirmButtonColor: "rgb(156, 164, 170)",
                        html: `<h2 style="color:#e9ecef">Erreur lors de l'envoi de l'email</h2>
                        <p> ${err.message} </p>`,
                    })
                }else{
                    Swal.fire({
                        type: "success",
                        background: "#3A3F44",
                        confirmButtonColor: "rgb(156, 164, 170)",
                        html: `<h2 style="color:#e9ecef">Succès !</h2>
                        <p style="color:#e9ecef"> Le mail a bien été envoyé à ${vendeur} ! </p>`,
                    })
                }
            }
        );
    }
})

Template.livre.helpers({
    "titre": function(){
        return Session.get("resultat").title
    },
    "auteur": function(){
        return Session.get("resultat").author
    },
    "prix": function(){
        return Session.get("resultat").price
    },
    "etat": function(){
        return Session.get("resultat").condition
    },
    "faculte": function(){
        return Session.get("resultat").faculty
    },
    "enseignant": function(){
        return Session.get("resultat").teacher
    },
    "vendeur": function(){
        return Session.get("resultat").sellerMail
    },
    "isbn": function(){
        return Session.get("resultat").isbn
    },
    "editeur": function(){
        return Session.get("resultat").editor
    },
    "collection": function(){
        return Session.get("resultat").collection
    },
    "parution": function(){
        return Session.get("resultat").release
    },
    "format": function(){
        return Session.get("resultat").format
    },
    "genre": function(){
        return Session.get("resultat").genre
    },
    "postee": function(){
        let date = Session.get("resultat").createdAt
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
    },
    "mesAnnonces": function(){
        if (Session.get("accessedBook") == "/mes_annonces") {
            return true
        } else {
            return false
        }
    },
    "couverture": function(){
        return Session.get("resultat").img
    },
    "vendeurIsHere": function(){
        setTimeout(() => {
            if (Session.get("resultat").sellerID == Meteor.userId()) {
                return true
            } else {
                return false
            }
        }, 200);
    }
})