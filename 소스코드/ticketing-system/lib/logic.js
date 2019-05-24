/* global getAssetRegistry getFactory emit request */
'use strict';

/**
 * CreateTicket transaction
 * @param {org.ticketing.system.CreateTicket} createTicket
 * @transaction
 */
async function CreateTicket(createTicket) {
    const ticketRegistry = await getAssetRegistry('org.ticketing.system.Ticket')
    const factory = getFactory()
    const ticket = factory.newResource('org.ticketing.system', 'Ticket', createTicket.ticket_id)
  	ticket.section_id = createTicket.section_id
    ticket.row_id = createTicket.row_id
    ticket.seat_id = createTicket.seat_id
  	ticket.gig_id = createTicket.gig_id
  	ticket.owner = createTicket.owner
    ticket.ticket_price = createTicket.ticket_price
    ticket.gig_datetime = createTicket.gig_datetime
    ticket.gig_name = createTicket.gig_name 
    ticket.gig_venue = createTicket.gig_venue
    await ticketRegistry.add(ticket)

}

/**
 * ChangeOwner transaction
 * @param {org.ticketing.system.ChangeOwner} changeOwner
 * @transaction
 */
async function ChangeOwner(changeOwner) {
    const ticketRegistry = await getAssetRegistry('org.ticketing.system.Ticket')

    //update ticket owner
    changeOwner.ticket.owner = changeOwner.newOwner;

    await ticketRegistry.update(changeOwner.ticket)

}

/**
 * DeleteTicket transaction
 * @param {org.ticketing.system.DeleteTicket} deleteTicket
 * @transaction
 */
async function DeleteTicket(deleteTicket) {
    const ticketRegistry = await getAssetRegistry('org.ticketing.system.Ticket')

    await ticketRegistry.remove(deleteTicket.ticket)

}

