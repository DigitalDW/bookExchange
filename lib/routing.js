import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

FlowRouter.route('/', {
    name: 'welcome',
    action(){
        BlazeLayout.render('home', {main: 'welcome'});
    }
});

FlowRouter.route('/sign_in', {
    name: 'signIn',
    action(){
        BlazeLayout.render('home', {main: 'signIn'});
    }
});

FlowRouter.route('/sign_up', {
    name: 'signUp',
    action(){
        BlazeLayout.render('home', {main: 'signUp'});
    }
});

FlowRouter.route('/uniBooks', {
    name: 'mainPage',
    action(){
        BlazeLayout.render('home', {main: 'mainPage'});
    }
});

FlowRouter.route('/mes_annonces', {
    name: 'mesAnnonces',
    action(){
        BlazeLayout.render('home', {main: 'mesAnnonces'});
    }
});

FlowRouter.route('/livre/:id', {
    name: 'livre',
    action(){
        BlazeLayout.render('home', {main: 'livre'});
    }
});

FlowRouter.route('/scanner', {
    name: 'scan',
    action(){
        BlazeLayout.render('home', {main: 'scan'});
    }
});

FlowRouter.route('/vente/:isbn', {
    name: 'formVente',
    action(){
        BlazeLayout.render('home', {main: 'formVente'});
    }
});

