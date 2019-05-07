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
      factory = businessNetworkConnection.getBusinessNetwork().getFactory();

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
  * @param {String} user_id Import user id for buyer & as identifier on network
  * @param {String} user_name Ticket Admin name
  */
  register_admin: async function (user_id, user_name) {
    try {

      //connect as admin
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect('admin@ticketing-system');

      //get the factory for the business network.
      factory = businessNetworkConnection.getBusinessNetwork().getFactory();

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

  create_ticket: async function (user_id,ticket_id,section_id,row_id,seat_id,ticket_pricegig_id,ticket_price) {
    try {
      //connect to network with user_id
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(user_id);

      //get the factory for the business network.
      factory = businessNetworkConnection.getBusinessNetwork().getFactory();

      //create transaction
      const creatTicket = factory.newTransaction(namespace, 'CreateTicket');
      creatTicket.ticket_id = ticket_id;
      creatTicket.section_id = section_id;
      creatTicket.row_id = row_id;
      creatTicket.seat_id = seat_id;
      creatTicket.gig_id = gig_id;
      creatTicket.ticket_price = ticket_price;
      creatTicket.owner = factory.newRelationship(namespace, 'TicketAdmin', user_id);

      //submit transaction
      await businessNetworkConnection.submitTransaction(creatTicket);

      //disconnect
      await businessNetworkConnection.disconnect(user_id);

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

  update_ticket_owner: async function (user_id, ticket_id) {
    try {

      //connect to network with user_id
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(user_id);
    
    //   const ticketRegistry = await getAssetRegistry('org.ticketing.system.Ticket')
    //   ticket = await carRegistry.get(ticket_id)

      //get the factory for the business network.
      factory = businessNetworkConnection.getBusinessNetwork().getFactory();

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
      await businessNetworkConnection.disconnect(user_id);

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

  get_buyer_data: async function (user_id) {

    try {

      //connect to network with user_id
      businessNetworkConnection = new BusinessNetworkConnection();
      await businessNetworkConnection.connect(user_id);

      //get buyer from the network
      const buyerRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Buyer');
      const buyer = await buyerRegistry.get(user_id);

      //disconnect
      await businessNetworkConnection.disconnect(user_id);

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
      await businessNetworkConnection.connect(user_id);

      //get admin from the network
      const adminRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.TicketAdmin');
      const ticket_admin = await adminRegistry.get(user_id);

      //disconnect
      await businessNetworkConnection.disconnect(user_id);

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
      const buyerRegistry = await businessNetworkConnection.getParticipantRegistry(namespace + '.Buyer');
      const buyer = await buyerRegistry.get(user_id);

      //query all tickets from the network
      const allTickets = await businessNetworkConnection.query('select_ticket_by_user', {inputValue: buyer});

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
