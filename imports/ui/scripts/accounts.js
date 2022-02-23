import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { LivresDB } from '../../api/livresDB.js';
import { Accounts } from 'meteor/accounts-base';
import swal from 'sweetalert2';

import '../templates/signUp.html';
import '../templates/signIn.html';

Template.signUp.events({
	'click #creationCompte': function(event){
		event.preventDefault();

		//récupérer les valeurs des inputs
		let email = document.getElementById("emailUt").value;
		let mdp1 = document.getElementById("mdpUt1").value;
		let mdp2 = document.getElementById("mdpUt2").value;

		if(email == "" || mdp1 == "" || mdp2 == ""){
			swal.fire({
				type: "error",
				title: "Champs manquants",
				text: "Tous les champs sont obligatoire !"
			})
		}else{
			if(checkEmail(email) && checkPassword(mdp1, mdp2)){
				Accounts.createUser({
					email: email,
					password: mdp1
				}, function(error){
					if(error){
						swal.fire({
							type: "error",
							title: `Oops... ${error.reason}`,
							text: "Une erreur s'est produite, veuillez ressayer"
						});
					}else{
						setTimeout(() => {FlowRouter.go('/uniBooks')},200);
						//swal.fire({"Votre compte a été créé !"});
					}
				})
			}
		}
	},
	'click #annuler': function(event){
		event.preventDefault();
		FlowRouter.go('/');
	}
});

Template.signIn.events({
	//Se connecter
	'click #connexion': function(event){
		event.preventDefault();

		//récupérer les valeurs des inputs
		let email = document.getElementById('emailUt').value;
		let mdp = document.getElementById('mdpUt').value;

		//login avec callback
		Meteor.loginWithPassword(email, mdp, function(error){
			if(error){
				swal.fire({
					type: "error",
					title: "Oops...",
					text: `Il y a eu l'erreur suivante: ${error.reason}. Veuillez réessayer.`
				});
			}
			else{
				setTimeout(function(){
					FlowRouter.go('/uniBooks');
				},200);
			}
		});
	},
	'click #cancelConnexion': function(event){
		event.preventDefault();
		
		FlowRouter.go('/');
	}
});

function checkEmail(email){
	let regExp = /(?<=.+?)@\w+\.\w+/
	if(email.match(regExp) == null){
		swal.fire({
			type: "error",
			title: "Email invalide",
			text: "Veuillez entrer une adresse email"
		})
		return false
	}else if(email.match(regExp)[0] != "@unil.ch"){
		swal.fire({
			type: "error",
			title: "Email invalide",
			text: "Vous devez posséder une adresse finissant en \”@unil.ch\""
		})
		return false
	}else{
		return true
	}
}

function checkPassword(mdp1, mdp2){
	if(mdp1 != mdp2){
		swal.fire({
			type: "error",
			title: "Confirmer le mot de passe",
			text: "Veuillez confirmer le mot de passe"
		})
		return false
	}else{
		if(mdp1.length < 6){
			swal.fire({
				type: "warning",
				title: "Longueur du mot de passe",
				text: "Le mot de passe doit faire au moins 6 caractères"
			})
			return false
		}else{
			return true
		}
	}
}