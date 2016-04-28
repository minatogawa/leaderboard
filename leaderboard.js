Players = new Mongo.Collection('players');

if (Meteor.isClient) {

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
}

if (Meteor.isServer) {
  
}

