import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

FlowRouter.route('/', {
    name: 'home',
    action(){
        BlazeLayout.render('home');
    }
});

FlowRouter.route('/vente', {
    name: 'vente',
    action(){
        BlazeLayout.render('vente');
    }
});

FlowRouter.route('/vente/:isbn', {
    name: 'venteInfos',
    action(){
        BlazeLayout.render('search');
    }
});
