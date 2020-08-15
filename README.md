# Parking SV
## Interplanetary parking system

## Idea
Parking SV is global parking payment decentralised system which simplify paring payment process.  
The system uses Bitcoin SV for global storage for financial transactions. End customer application is developed using React Native, parking owner should run their own nodes for payments processing.

## How it works

1. Customer scans QR code at parking entrance and get node address.  
2. Customer app sends custmer public key to node. Node writes pubkey with timestamp.  
3. Node returns signed timestamp as a proof of time when parking starts and open a barrier.  
4. When customer leaves the parking, it press 'Pay' button, app calculates payment amount, create a signed transaction and sends it to parking node.  
5. Parking node verifys transaction with calculated prices, and open a barrier and submit it to network if its correct.
6. If something is going wrong, a customer has a signed transaction on his devices which could be used as paper ticket to resolve a dispute with parking owner.  
7. System s decentralized and could be installed by parking owners withouut extra agreements.  


## Project repositories

https://github.com/MikaelLazarev/parkingsv-contracts - Project main repository 
https://github.com/MikaelLazarev/parkingsv-mobile - Mobile app  
https://github.com/MikaelLazarev/parkingsv-node - Parking node  
https://github.com/MikaelLazarev/parkingsv-barrier - Simple barrier simulator  

## Token smart contract

### Files

data.scrypt - Data helpers  
token.scrypt - Token contract  
util.scrypt - Utilities

### Data structure

|  Code  |  OP_RETURN | OP_PUSHDATA | DATA |

Data: 
Last byte encodes quanity of array

Each arra element encoded:

| PublicKey[0] | Value[0] | PublicKey[1] | Value[1] | .... | PublicKey[Qty-1] | Value[Qty-1] | Value[0] |

### Typescript interface
contractHelper.ts - class ContractCallHelper - helps for contract methods invocation  
helper.js - helper from scyprt boilerplate  
keyUtil - Key Utilities  
ledger - class Ledger - helper for woring with data structures  
loadContract - helper for compilation contract (NodeJS only)  
privateKey - privateKey constant and helper  
token - Token contract class (main interface)  
tokenContract - Interface for interacting with script contract  
txUtil - transaction utilities (NodeJS only)  
types - types for bsv library  
