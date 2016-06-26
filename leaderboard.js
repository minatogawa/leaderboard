Players = new Mongo.Collection('players');

if (Meteor.isClient) {

  Template.header.helpers({
    profileURL: function() {
      var user = Meteor.user(); 
      if (user) {
        return user.services.google.picture; 
      } 
    }
  });

  Template.insertPlayer.events({
    'submit form':function(event){
      event.preventDefault();
      var newPlayer = $('[name=newPlayer]').val()
      Players.insert({
        name:newPlayer,
        goals: 0,
      });
      $('[name=newPlayer]').val('');
    }
  });

  Template.playersList.helpers({
    'player':function(){
      return Players.find({},{sort:{goals:-1}});  
    },

    'selectedPlayer':function(){
      var currentPlayerId = Session.get("currentPlayerId");
      if(this._id == currentPlayerId){
        return 'selected'
      }
    },
  });
  
  Template.playersList.events({
    /*'click .deletePlayer':function(){
      Players.remove({
        _id:this._id
      })
    },*/

    'click .playerId':function(){
      Session.set("currentPlayerId", this._id);
    }
  });

  Template.featuredPlayer.helpers({
    'clickedPlayer':function(){
      var currentPlayerId = Session.get("currentPlayerId");
      return Players.findOne({_id:currentPlayerId});
    }
  });

  Template.featuredPlayer.events({
    'click .deletePlayer':function(){
      var currentPlayerId = Session.get("currentPlayerId");
      Players.remove({
        _id:currentPlayerId,
      });
    },
    'click .addGoal':function(){
      var currentPlayerId = Session.get("currentPlayerId");
      Players.update({_id:currentPlayerId}, {$inc:{goals:1}});
    },

    'click .decreaseGoal':function(){
      var currentPlayerId = Session.get("currentPlayerId");
      Players.update({_id:currentPlayerId}, {$inc:{goals:-1}});
    }  
  });

  Accounts.ui.config({
    requestPermissions:{
      facebook:['email', 'user_about_me', 'user_photos', 'public_profile'],
      google:['email', 'profile']
    }
  });
}

if (Meteor.isServer) {
  ServiceConfiguration.configurations.remove({
    service:'facebook',
  });
  ServiceConfiguration.configurations.insert({
    service:'facebook',
    appId: '934461996644808',
    secret: 'e3a9819063f65996b096f85d96d1a7a2',
  });

  ServiceConfiguration.configurations.remove({
    service:'google',
  });
  ServiceConfiguration.configurations.insert({
    service:'google',
    clientId: '93788968957-r4t4fa15j1c4hfbdojj35uspk64vv8bn.apps.googleusercontent.com',
    secret: 'I8RalInExB6atte5SV46RTcu',
  });

}

