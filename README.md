# Parking SV
## Interplanetary parking system


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
