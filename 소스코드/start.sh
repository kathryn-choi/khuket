#!/bin/bash

composer card delete -c ticketadmin
composer card delete -c PeerAdmin@hlfv1 
composer card delete -c admin@ticketing-system

cd fabric-dev-servers

sudo ./downloadFabric.sh
sudo ./startFabric.sh
./createPeerAdminCard.sh

cd ..

cd ticketing-system

composer network install --card PeerAdmin@hlfv1 --archiveFile ticketing-system@0.0.3.bna

composer network start --networkName ticketing-system --networkVersion 0.0.3 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card


composer card import --file networkadmin.card

composer network ping --card admin@ticketing-system

cd ..
