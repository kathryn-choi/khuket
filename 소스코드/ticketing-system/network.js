const AdminConnection = require('composer-admin').AdminConnection;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const { BusinessNetworkDefinition, CertificateUtil, IdCard } = require('composer-common');

//declate namespace
const namespace = 'org.ticketing.system';

//in-memory card store for testing so cards are not persisted to the file system
const cardStore = require('composer-common').NetworkCardStoreManager.getCardStore( { type: 'composer-wallet-inmemory' } );

//admin connection to the blockchain, used to deploy the business network
let adminConnection;

//this is the business network connection the tests will use.
let businessNetworkConnection;

let businessNetworkName = 'ticketing-system';
let factory;


/*
 * Import card for an identity
 * @param {String} cardName The card name to use for this identity
 * @param {Object} identity The identity details
 */
async function importCardForIdentity(cardName, identity) {

  //use admin connection
  adminConnection = new AdminConnection();
  businessNetworkName = 'ticketing-system';

  //declare metadata
  const metadata = {
      userName: identity.userID,
      version: 1,
      enrollmentSecret: identity.userSecret,
      businessNetwork: businessNetworkName
  };

  //get connectionProfile from json, create Idcard
  const connectionProfile = require('./local_connection.json');
  const card = new IdCard(metadata, connectionProfile);

  //import card
  await adminConnection.importCard(cardName, card);
}


/*
* Reconnect using a different identity
* @param {String} cardName The identity to use
*/
async function useIdentity(cardName) {

  //disconnect existing connection
  await businessNetworkConnection.disconnect();

  //connect to network using cardName
  businessNetworkConnection = new BusinessNetworkConnection();
  await businessNetworkConnection.connect(cardName);
}


//export module
module.exports = {

  /*
  * Create Buyer participant and import card for identity
  * @param {String} user_id Import user id for buyer & as identifier on network
  * @param {String} user_name Buyer name
  */
 register_buyer: async function (user_id, user_name) {
    try {

      //connect as admin
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect('admin@ticketing-system');

      //get the factory for the business network
      var factory = businessNetworkConnection.getBusinessNetwork().getFactory();

      //create buyer participant
      const buyer = factory.newResource(namespace, 'Buyer', user_id);
      buyer.user_name = user_name;

      //add buyer participant
      const participantRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Buyer');
      await participantRegistry.add(buyer);

      //issue identity
      const identity = await businessNetworkConnection.issueIdentity(namespace + '.Buyer#' + user_id, user_id);

      //import card for identity
      await importCardForIdentity(user_id, identity);

      //disconnect
      await businessNetworkConnection.disconnect('admin@ticketing-system');

      return true;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }

  },

  /*
  * Create Ticket Admin participant and import card for identity
  * @param {String} user_id Import user id for admin & as identifier on network
  * @param {String} user_name Ticket Admin name
  */
  register_admin: async function (user_id, user_name) {
    try {

      //connect as admin
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect('admin@ticketing-system');

      //get the factory for the business network.
      var factory = businessNetworkConnection.getBusinessNetwork().getFactory();

      //create partner participant
      const ticket_admin = factory.newResource(namespace, 'TicketAdmin', user_id);
      ticket_admin.user_name = user_name;

      //add partner participant
      const participantRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.TicketAdmin');
      await participantRegistry.add(ticket_admin);

      //issue identity
      const identity = await businessNetworkConnection.issueIdentity(namespace + '.TicketAdmin#' + user_id, user_id);

      //import card for identity
      await importCardForIdentity(user_id, identity);

      //disconnect
      await businessNetworkConnection.disconnect('admin@ticketing-system');

      return true;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }

  },

 /*
  * Create Organizer participant and import card for identity
  * @param {String} user_id Import user id for organizer & as identifier on network
  * @param {String} user_name Organizer name
  */
 register_organizer: async function (user_id, user_name) {
  try {

    //connect as admin
    businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.connect('admin@ticketing-system');

    //get the factory for the business network.
    var factory = businessNetworkConnection.getBusinessNetwork().getFactory();

    //create partner participant
    const ticket_admin = factory.newResource(namespace, 'Organizer', user_id);
    ticket_admin.user_name = user_name;

    //add partner participant
    const participantRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Organizer');
    await participantRegistry.add(ticket_admin);

    //issue identity
    const identity = await businessNetworkConnection.issueIdentity(namespace + '.Organizer#' + user_id, user_id);

    //import card for identity
    await importCardForIdentity(user_id, identity);

    //disconnect
    await businessNetworkConnection.disconnect('admin@ticketing-system');

    return true;
  }
  catch(err) {
    //print and return error
    console.log(err);
    var error = {};
    error.error = err.message;
    return error;
  }

},
  create_ticket: async function (user_id,ticket_id,section_id,row_id,seat_id,ticket_price,gig_id,gig_datetime, gig_name, gig_venue, callback) {
    try {
      //connect to network with user_id
      var businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect('admin@ticketing-system');

      //get the factory for the business network.
      var factory = businessNetworkConnection.getBusinessNetwork().getFactory();

      //create transaction
      const createTicket = factory.newTransaction(namespace, 'CreateTicket');
      createTicket.ticket_id = ticket_id;
      createTicket.section_id = section_id;
      createTicket.row_id = row_id;
      createTicket.seat_id = seat_id;
      createTicket.gig_id = gig_id;
      createTicket.ticket_price = ticket_price;
      createTicket.gig_datetime = gig_datetime;
      createTicket.gig_name = gig_name;
      createTicket.gig_venue = gig_venue;
      createTicket.owner = factory.newRelationship(namespace, 'TicketAdmin', user_id);

      console.log("before submit transaction")
      //submit transaction
      await businessNetworkConnection.submitTransaction(createTicket);
      console.log("complete submit transaction")
      //disconnect
      await businessNetworkConnection.disconnect('admin@ticketing-system');
      result=true;
      callback(result);
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      result=false;
      callback(result);
    }

  },

  update_ticket_owner: async function (user_id, ticket_id) {
    try {

      //connect to network with user_id
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect('admin@ticketing-system');
    
    //   const ticketRegistry = await getAssetRegistry('org.ticketing.system.Ticket')
    //   ticket = await carRegistry.get(ticket_id)

      //get the factory for the business network.
      var factory = businessNetworkConnection.getBusinessNetwork().getFactory();
      
      //create transaction
      const update_owner = factory.newTransaction(namespace, 'ChangeOwner');
      update_owner.ticket = factory.newRelationship(namespace, 'Ticket', ticket_id);

      if(user_id == 'admin'){
         update_owner.newOwner = factory.newRelationship(namespace, 'TicketAdmin', user_id);
      }
      else{
        update_owner.newOwner = factory.newRelationship(namespace, 'Buyer', user_id);
      }

      //submit transaction
      await businessNetworkConnection.submitTransaction(update_owner);

      //disconnect
      await businessNetworkConnection.disconnect('admin@ticketing-system');

      return true;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }

  },

  delete_ticket: async function (user_id,ticket_id) {
    try {
      //connect to network with user_id
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect('admin@ticketing-system');

      //get the factory for the business network.
      var factory = businessNetworkConnection.getBusinessNetwork().getFactory();

      //create transaction
      const deleteTicket = factory.newTransaction(namespace, 'DeleteTicket');


      //submit transaction
      await businessNetworkConnection.submitTransaction(deleteTicket);
      deleteTicket.ticket = factory.newRelationship(namespace, 'Ticket', ticket_id);

      //disconnect
      await businessNetworkConnection.disconnect('admin@ticketing-system');

      return true;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }

  },

  get_buyer_data: async function (user_id) {

    try {

      //connect to network with user_id
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect('admin@ticketing-system');

      //get buyer from the network
      const buyerRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Buyer');
      const buyer = await buyerRegistry.get(user_id);

      //disconnect
      await businessNetworkConnection.disconnect('admin@ticketing-system');

      //return buyer object
      return buyer;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error;
    }

  },

  get_admin_data: async function (user_id) {

    try {

      //connect to network with user_id
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect('admin@ticketing-system');

      //get admin from the network
      const adminRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.TicketAdmin');
      const ticket_admin = await adminRegistry.get(user_id);

      //disconnect
      await businessNetworkConnection.disconnect('admin@ticketing-system');

      //return admin object
      return ticket_admin;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }

  },
  
  get_ticket_info_by_id : async function (user_id,ticket_id) {

    try {
      //connect to network with user_id
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(user_id);

      //query ticket from the network
      const ticket = await businessNetworkConnection.query('select_ticket', {inputValue: ticket_id});

      //disconnect
      await businessNetworkConnection.disconnect(user_id);

      //return ticket object
      return ticket;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }
  },

  get_ticket_info_by_gig_id : async function (user_id,gig_id) {

    try {
      //connect to network with user_id
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(user_id);

      //query all tickets from the network
      const allTickets = await businessNetworkConnection.query('select_ticket_by_gig', {inputValue: gig_id});

      //disconnect
      await businessNetworkConnection.disconnect(user_id);

      //return all tickets object
      return allTickets;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }
  },

  get_ticket_info_by_user : async function (user_id) {

    try {
      //connect to network with user_id
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(user_id);
    
      //get buyer from the network
      // const buyerRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Buyer');
      // const buyer = await buyerRegistry.get(user_id);

      //query all tickets from the network
      const allTickets = await businessNetworkConnection.query('select_ticket_by_user', {inputValue: user_id});

      //disconnect
      await businessNetworkConnection.disconnect(user_id);

      //return all tickets object
      return allTickets;
    }
    catch(err) {
      //print and return error
      console.log(err);
      var error = {};
      error.error = err.message;
      return error
    }
  }
}
