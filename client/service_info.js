import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { HTTP } from 'meteor/http';
import { Session } from 'meteor/session';

import { ServiceInfo,ServiceInfos} from '../imports/api/db/service_info';

Template.serviceInfoTemplate.onCreated(function() {
  console.log("serviceInfoTemplate onCreated");
});

Template.serviceInfoTemplate.helpers({
  serviceInfos:() => ServiceInfos.find()
});

Template.serviceInfoTemplate.events({

});
