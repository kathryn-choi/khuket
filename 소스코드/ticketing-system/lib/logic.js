/* global getAssetRegistry getFactory emit request */

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

