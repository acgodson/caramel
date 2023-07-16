// import MedicalNFT from 0x02


// pub contract NFTTransfer  {

 
// pub   resource TransferPool {
//     pub let myMedicalNFTCollection: Capability<&MedicalNFT.Collection>
//     pub let transferPool: {UInt64: UInt64}
//     pub let users: {Address: [UInt64]}

//     access(self) fun isValidAddress (address: Address): Bool {
//         let account = getAccount(address)

//             return account != nil
//     }
        
//         init(_myMedicalNFTCollection: Capability<&MedicalNFT.Collection> ) {
//             self.transferPool = {}
//             self.users = {}
//             self.myMedicalNFTCollection = _myMedicalNFTCollection
//         }

//     pub fun getTransfer(id: UInt64): UInt64? {
//             return self.transferPool[id]
//     }

//     pub fun getTransfersForAddress(address: Address): [UInt64]? {
//             return self.users[address]
//     }


//     pub fun getTransferForAddress(address: Address): [UInt64]? {
//             return self.users[address]
//     }

//     pub fun addForTransfer(id : UInt64, nftID: UInt64, address: Address, keyId: UInt16) {
//     pre {
//       self.isValidAddress(address: address): "This address is not a valid address"
//       self.myMedicalNFTCollection.borrow()!.getIDs().contains(nftID): "This sale collection owner does not have this NFT"
//       self.getTransfer(id: id) != nil: "Transfer already exists"
//      }
//     self.transferPool[id] = nftID

//     if (self.users[address] == nil) {
//         self.users[address] = [nftID]
//     } else {
//         self.users[address]!.append(nftID)
//     }
//   }

//     // init() {
//         // let transferPool <- create TransferPool(_myMedicalNFTCollection: Capability<&MedicalNFT.Collection>)
//         //self.account.save(<-transferPool, to: /storage/transferPool)
//        // self.account.link<&TransferPool>(/public/transferPool, target: /storage/transferPool)
//        // log("TransferPool is created and stored")
//     // }
    
// }

// }