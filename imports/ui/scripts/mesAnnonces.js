import { Template } from "meteor/templating";
import { Session } from 'meteor/session';
import Swal from 'sweetalert2';

import "../templates/mesAnnonces.html";

Template.mesAnnonces.onCreated(function(){
    Meteor.call("livre.getFromUser", Meteor.userId(), function(err, val){
         if(err){
              console.log(err)
         }else{
              console.log(val)
              Session.set("livres", val)
         }
    })
}),

Template.mesAnnonces.helpers({
    "elements": function(){
        return Session.get("livres")
    },
    "prix": function() {
        
    }
})

Template.mesAnnonces.events({
    //supprimer annonce
    "click .deleteButton": function(event){
        console.log(this._id)
        event.preventDefault();
        event.stopPropagation();
        Swal.fire({
            //Message d'alerte pour confirmer la suppression
            type: "warning",
            background: "#3A3F44",
            confirmButtonColor: "rgb(156, 164, 170)",
            cancelButtonColor: "rgb(92, 98, 102)",
            html:
                `<h2 style="color:#e9ecef">Attention !</h2>
                <p style="color:#e9ecef">
                    Êtes-vous sûr de vouloir supprimer votre annonce ?
                </p>`,
            showCancelButton: true,
            confirmButtonText: "Oui",
            cancelButtonText: "Non",
            preConfirm: () => {
                Meteor.call("livre.remove", this._id, function(err){
                    if(err){
                        console.log(err);
                    }
                })
                //recharger les annonces pour que l'annonce supprimée ne soit plus là
                Meteor.call("livre.getFromUser", Meteor.userId(), function(err, val){
                    if(err){
                         console.log(err)
                    }else{
                         console.log(val)
                         Session.set("livres", val)
                    }
               })
            }
        })
        
    
        
    },
    //envoie vers l'annonce lorsqu'on clique sur la ligne du tableau correspondante
    'click .item-row': function(evt) {
        evt.preventDefault();
        let pathAccessBook = "/livre/" + this._id;
        Session.set("accessedBook", "/mes_annonces")
        FlowRouter.go(pathAccessBook);
    },

    //modification d'une annonce
    "click .changeButton": function(event){
        event.preventDefault();
        event.stopPropagation(); //éviter que de cliquer sur le bouton Modifier active aussi l'événement click. item-row
        Meteor.call("livre.getInfo", this._id, function(err, val){
            if(err){
                console.log(err)
            }else{
                console.log(val)
                Swal.fire({
                    type: "info",
                    background: "#3A3F44",
                    confirmButtonColor: "rgb(156, 164, 170)",
                    cancelButtonColor: "rgb(92, 98, 102)",
                    html:
                        `
                        <div style="color:#e9ecef">
                            <h2>Modifier l'annonce</h2>
                            <form id="changeForm">
                                <div class="form-group">
                                <label>Prix</label>
                                <input type="number" id="changePrix" class="form-control-sm" step="any" placeholder="Prix de vente" min="1" max="999" name="inputChangePrix" value="${val.price}">
                                </div>
                                <div class="form-group">
                                    <label>Etat</label>
                                    <select name="inputEtat" id="changeEtat" class="form-control-sm">
                                        <option ${val.condition == "Neuf" ? "selected" : ""}>Neuf</option>
                                        <option ${val.condition == "Comme Neuf" ? "selected" : ""}>Comme Neuf</option>
                                        <option ${val.condition == "Surligné" ? "selected" : ""}>Surligné</option>
                                        <option ${val.condition == "Légèrement annoté" ? "selected" : ""}>Légèrement annoté</option>
                                        <option ${val.condition == "Annoté" ? "selected" : ""}>Annoté</option>
                                        <option ${val.condition == "Mauvais état" ? "selected" : ""}>Mauvais état</option>
                                        <option ${val.condition == "Que partiellement lisible" ? "selected" : ""}>Que partiellement lisible</option>
                                    </select>
                                </div>
        
                                <div class="form-group">
                                    <label>Section UNIL</label>
                                    <select name="inputFaculte" id="changeSection" class="form-control-sm">
                                    <option selected ${val.faculty == "Que partiellement lisible" ? "selected" : ""}>Autre</option>
                                    <option ${val.faculty == "Allemand" ? "selected" : ""}>Allemand</option>
                                    <option ${val.faculty == "Anglais lisible" ? "selected" : ""}>Anglais</option>
                                    <option ${val.faculty == "Archéologie et sciences de l'Antiquité" ? "selected" : ""}>Archéologie et sciences de l'Antiquité</option>
                                    <option ${val.faculty == "Biologie" ? "selected" : ""}>Biologie</option>
                                    <option ${val.faculty == "Comportement organisationnel" ? "selected" : ""}>Comportement organisationnel</option>
                                    <option ${val.faculty == "Comptabilité et contrôle" ? "selected" : ""}>Comptabilité et contrôle</option>
                                    <option ${val.faculty == "Droit" ? "selected" : ""}>Droit</option>
                                    <option ${val.faculty == "Droit des affaires et fiscalité" ? "selected" : ""}>Droit des affaires et fiscalité</option>
                                    <option ${val.faculty == "Economie" ? "selected" : ""}>Economie</option>
                                    <option ${val.faculty == "Espagnol" ? "selected" : ""}>Espagnol</option>
                                    <option ${val.faculty == "Etudes politiques, historiques et internationales" ? "selected" : ""}>Etudes politiques, historiques et internationales</option>
                                    <option ${val.faculty == "Etudes théologiques" ? "selected" : ""}>Etudes théologiques</option>
                                    <option ${val.faculty == "Finance" ? "selected" : ""}>Finance</option>
                                    <option ${val.faculty == "Français" ? "selected" : ""}>Français</option>
                                    <option ${val.faculty == "Géographie" ? "selected" : ""}>Géographie</option>
                                    <option ${val.faculty == "Géologie" ? "selected" : ""}>Géologie</option>
                                    <option ${val.faculty == "Histoire" ? "selected" : ""}>Histoire</option>
                                    <option ${val.faculty == "Histoire de l'art" ? "selected" : ""}>Histoire de l'art</option>
                                    <option ${val.faculty == "Histoire et esthétique du cinéma" ? "selected" : ""}>Histoire et esthétique du cinéma</option>
                                    <option ${val.faculty == "Informatique pour les Sciences Humaines" ? "selected" : ""}>Informatique pour les Sciences Humaines</option>
                                    <option ${val.faculty == "Institut de hautes études en administration publique (IDHEAP)" ? "selected" : ""}>Institut de hautes études en administration publique (IDHEAP)</option>
                                    <option ${val.faculty == "Italien" ? "selected" : ""}>Italien</option>
                                    <option ${val.faculty == "Langues et civilisations slaves et de l'Asie du Sud" ? "selected" : ""}>Langues et civilisations slaves et de l'Asie du Sud</option>
                                    <option ${val.faculty == "Linguistique" ? "selected" : ""}>Linguistique</option>
                                    <option ${val.faculty == "Marketing" ? "selected" : ""}>Marketing</option>
                                    <option ${val.faculty == "Médecine" ? "selected" : ""}>Médecine</option>
                                    <option ${val.faculty == "Opérations" ? "selected" : ""}>Opérations</option>
                                    <option ${val.faculty == "Philosophie" ? "selected" : ""}>Philosophie</option>
                                    <option ${val.faculty == "Psychologie" ? "selected" : ""}>Psychologie</option>
                                    <option ${val.faculty == "Sciences actuarielles" ? "selected" : ""}>Sciences actuarielles</option>
                                    <option ${val.faculty == "Sciences criminelles" ? "selected" : ""}>Sciences criminelles</option>
                                    <option ${val.faculty == "Sciences de l'environnement" ? "selected" : ""}>Sciences de l'environnement</option>
                                    <option ${val.faculty == "Sciences des religions" ? "selected" : ""}>Sciences des religions</option>
                                    <option ${val.faculty == "Sciences du sport" ? "selected" : ""}>Sciences du sport</option>
                                    <option ${val.faculty == "Sciences Sociales" ? "selected" : ""}>Sciences Sociales</option>
                                    <option ${val.faculty == "Stratégie, globalisation et société" ? "selected" : ""}>Stratégie, globalisation et société</option>
                                    <option ${val.faculty == "Théologie" ? "selected" : ""}>Théologie</option>
                                    <option ${val.faculty == "Tourisme" ? "selected" : ""}>Tourisme</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Enseignant/e</label>
                                    <input type="text" class="form-control-sm" id="changeEnseignant" value="${val.teacher}" placeholder="Nouvel/le enseignant/e">
        
                                </div>
                            </form>
                        </div>
                        `,
                    showCancelButton: true,
                    confirmButtonText: "Valider",
                    cancelButtonText: "Annuler",
                    preConfirm: () => {
                        let newPrice = document.getElementById("changePrix").value;
                        let newCondition = document.getElementById("changeEtat").value;
                        let newTeacher = document.getElementById("changeEnseignant").value;
                        let newFaculty = document.getElementById("changeSection").value;
                        
                        Meteor.call("livre.modify", val._id, newPrice, newCondition, newTeacher, newFaculty, function(err){
                            if(err){
                                console.log(err);
                            }else{
                                document.getElementById("changePrix").value = "";
                                document.getElementById("changeEtat").value = "Neuf";
                                document.getElementById("changeEnseignant").value = "";
                                document.getElementById("changeSection").value = "Autre";
                                Meteor.call("livre.getFromUser", Meteor.userId(), function(err, val){
                                    if(err){
                                         console.log(err)
                                    }else{
                                         console.log(val)
                                         Session.set("livres", val)
                                    }
                               })
                            }
                        })
                    }
                }
            )}
        })
    }
})