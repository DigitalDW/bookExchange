# bookExchange
<h1> UniBooks - README </h1>

<h3> <i>UniBooks ver 0.8</i> </h3>

<p><i>DEGONDA Nahuel et RIMAZ Loris</i></p>

<p style="text-align:justify;">
Projet dans le cadre du cours : Projet de développement logiciel de Davide Picca Faculté des Lettres - Université de Lausanne - Février à Mai 2019 Gitlab : https://gitlab.com/ish_unil/students_cl/unibooks
</p>

<h2>Description</h2>

<p style="text-align:justify;">
Le projet UniBooks a pour but de proposer une platerforme sur laquelle les membres de l'Université de Lausanne (UNIL) puissent revendre et acheter des livres de seconde main, tel une bourse aux livres. Il est possible d'utiliser la caméra de l'ordinateur afin de scanner l'EAN du livre pour en récupérer l'ISBN et faire une recherche dans deux API de livres: Google Books et Goodreads. Les utilisateurs peuvent également entrer manuellement les informations de leur livre si le livre n'existe pas dans les API ou si leur caméra n'est pas fonctionnelle. Les utilisateurs peuvent ensuite, modifier les informations spécifiques à leur annonce (prix, état, section, enseignant), supprimer leur annonce, ainsi que chercher dans les offres postées par les utilisateurs à l'aide de filtres de recherche (titre, auteur, section, ...).
</p>

<p style="text-align:justify;">
Le public cible se constitue principalement des étudiants de l'université de Lausanne. En effet, l'UNIL ne propose qu'un seul moyen de bourse aux livres, qui se résume à l'organisation de 2 jours annuels durant lesquels les élèves peuvent amener et acheter des livres d'occasion. Ce moyen est trop limité pour permettre aux étudiants de s'assurer que les livres dont ils n'ont plus besoin puissent être revendus à ceux dans le besoin. Aussi, pour garantir que cette application ne soit exploitable que par la communauté de l'UNIL, la possession d'une adresse email @unil.ch est nécessaire.
</p>

<h2>Interface</h2>

<p style="text-align:justify;">Ci-dessous se trouve les différentes étapes d'utilisation. A savoir que seule la page d'acueil est accessible par un utilisateur qui n'a pas de compte ou n'est pas connecté</p>

<h3>Page d'accueil</h3>
<p style="text-align:justify;">
L'utilisateur arrive sur la page d'accueil, où il a la possibilité de se créer un compte ou de se connecter.
</p>

<h3>Page principale - Catalogue</h3>
<p style="text-align:justify;">
Une fois l'utilisateur connecté, il accède à la page principale dite "catalogue" où il a accès à toutes les annonces en cours, lesquelles peuvent être cliquées pour accéder aux détails de l'annonce. Sur cette page il peut également accéder aux actions suivantes : effectuer une recherche dans le catalogue avec filtrage, vendre un livre, voir ses annonces ou se déconnecter.
<br>
En haut à droite se trouve un bouton dropdown dans lequel se trouve les menus "Mes annonces" et "Déconnexion" pour respectivement permettre à l'utilisateur d'accéder à ses annonces précdemment postées et les modifier/supprimer, et se déconnecter de l'application.
</p>

<h3>Vendre mon livre</h3>
<p style="text-align:justify;">
Lorsque l'utilisateur clique sur "Vendre mon livre" depuis la page principale, il a le choix entre scanner son livre ou passer au formulaire.
<br>
Si l'utilisateur clique sur "Scanner mon ISBN", l'application chercher à accéder à la caméra, qui indique à l'aide d'une alerte si la caméra a été trouvée ou non. Si c'est réussi, la caméra de l'ordinateur s'active et une fenêtre montrant le retour vidéo apparait. L'utilisateur doit montrer le code EAN de son livre à la caméra. Lorsque celui-ci est lu, une recherche est effectuée dans l'API de Google Books, si la recherche ne donne rien, alors une nouvelle recherche est effectuée dans l'API Goodreads. S'il n'y a pas de résultat, l'utilisateur est informé que les bases de données n'ont pas la référence, ou que son ISBN est erroné, puis demande à l'utilisateur s'il souhaite réessayer ou annuler et être renvoyé au formulaire manuel. Si un résultat est trouvé, l'application demande à l'utilisateur s'il est correct. Une fois les données validées, l'utilisateur est renvoyé au formulaire manuel, dans lequel toutes les informations trouvées dans les API sont passées dans les champs du formulaire. Ainsi, l'utilisateur n'a plus qu'à compléter les données manquantes et/ou les informations non-indiquées par les API et spécifiques à son annonce: format, prix, etat, genre, section de l'UNIL dans laquelle ce livre a été utilisé, l'enseignant du cours dans lequel ce livre a été utilisé.
</p>
<h4>Formulaire de vente</h4>
<p style="text-align:justify;">
Le formulaire de vente contient les champs suivants:
<ul>
    <li>Code EAN</li>
    <li>ISBN</li>
    <li>Titre</li>
    <li>Auteur</li>
    <li>Editeur</li>
    <li>Collection</li>
    <li>Parution</li>
    <li>Prix</li>
    <li>Etat</li>
    <li>Format</li>
    <li>Genre</li>
    <li>Section UNIL</li>
    <li>Enseignant</li>
</ul>
Le champ "Code EAN" est accompagné du bouton "Scanner" qui renvoie à la page de scan, et du bouton "Trouver" qui permet à l'utilisateur de faire une rechercher dans les API s'il rentre manuellement le code EAN (10 ou 13 chiffres).
<br>
L'annonce doit au moins contenir les informations sur le titre, l'auteur et le prix pour que l'utilisateur puisse choisir de publier son annonce. Il peut également annuler la création de l'annonce à l'aide d'un bouton.
</p>

<h3>Annonce</h3>
<p style="text-align:justify;">
Une fois l'annonce publiée, l'utilisateur est envoyé vers la page de détails de son annonce.
Cette page est également accessible depuis la page principale si l'utilisateur clique sur une annonce.
Cette page contient toutes les informations documentées lors de la création de l'annonce par l'utilisateur ainsi que toute modification apportée par la suite.
</p>

<h3>Mes annonces</h3>
<p style="text-align:justify;">
Cette page contient toutes les annonces postées par l'utilisateur connecté. Chaque annonce est accompagnée d'un bouton "Supprimer" et d'un bouton "Modifier" afin de permettre à l'utilisateur de respectivement supprimer ou modifier l'annonce concernée.
</p>

<h2>Base de données</h2>

<p style="text-align:justify;">
Il y a une collection: LivresDB. Elle contient toutes les annonces postées par les utilisateurs, en enregistrant les paramètres suivants:
    <ul>
        <li>ISBN</li>
        <li>Titre</li>
        <li>Auteur</li>
        <li>Editeur</li>
        <li>Collection</li>
        <li>Parution</li>
        <li>Format</li>
        <li>Genre</li>
        <li>Prix</li>
        <li>Etat</li>
        <li>Faculte</li>
        <li>Enseignant</li>
        <li>L'ID du vendeur</li>
        <li>L'email du vendeur</li>
        <li>La date de création de l'annonce</li>
    </ul>

A noter que lorsque la méthode "livre.add", qui ajoute une annonce à la base de données, est appelée, la date de création est enregistrée.</p>

<h2>Licence</h2>

<p>Ce programme est un logiciel gratuit.</p>

<p style="text-align:justify;">
UniBooks a été développé avec le framework de développement web en Javascript Meteor dans sa version 1.8.0.2
</p>

<p>Les principaux modules Meteor utilisés dans ce projet sont :</p>

<ul>
	<li>reactiveVar (variables réactives)</li>
	<li>Flow Router (gestion des liens entre les pages)</li>
	<li>Blaze Layout (render des templates)</li>
    <li>Quagga</li>
    <li>SweetAlert2</li>
	<li>JQuery</li>
    <li>Puppeteer</li>
    <li>Accounts-base et mail (packages Meteor basiques)</li>
	<li>Bootstrap (style)</li>
    <li>Slate (Bootstrap theme)</li>
</ul>

<p style="text-align:justify;">Certaines libraries et modules utilisés pour le développement peuvent être soumis à un copyright par leurs auteurs respectifs.</p>

<h2>Les routes</h2>

<p>Ici sont présentées les routes accessible sur l'application:</p>
<ul>
    <li>"/": page d'accueil</li>
    <li>"/sign_in": page de connexion</li>
    <li>"/sign_up": page de création de compte</li>
    <li>"/uniBooks": page principale (catalogue)</li>
    <li>"/mes_annonces": page qui liste les annonces de l'utilisateur</li>
    <li>"/livre/:id": une annonce (renseigner l'id est important puisque le contenu est rempli selon les données de la base de données</li>
    <li>"/scanner": page où l'utilisateur peut, s'il le souhaite, scanner son ISBN</li>
    <li>"/vente/:isbn": formulaire. Si l'utilisateur avait récupéré un ISBN valide lors du scan, l'ISBN est renseigné dans le lien. Sinon, le lien donne sur "vente/0"</li>
</ul>

<p>Pères et Mères fondateurs du concept du projet:</p>
<ul>
    <li>https://github.com/Nahuel40000/LAMA-Co</li>
</ul>


<p style="text-align:justify;">
Copyright © 2019 - l'équipe de développement de UniBooks : DEGONDA Nahuel - RIMAZ Loris</p>