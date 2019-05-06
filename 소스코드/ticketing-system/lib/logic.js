/* global getAssetRegistry getFactory emit request */
'use strict';

/**
 * ChangeOwner transaction
 * @param {org.ticketing.system.CreateTicket} createTicket
 * @transaction
 */
async function CreateTicket(createTicket) {
    const ticketRegistry = await getAssetRegistry('org.ticketing.system.Ticket')

    const factory = getFactory()
    const ticket = factory.newResource('org.ticketing.system', 'Ticket', createTicket.ticket_id)
    

    await carRegistry.add(ticket)

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

