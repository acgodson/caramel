# Welcome to Caramel. 
## Traceable and Verifiable distribution of NFTs

> Mint and send private  NFTs such as medical imaging on Flow Blockchain for licensed data consumers or recipients.


👉 Jump to [Video Demo ]() || 
📃 [Pitch Deck]()


## Caramel Workflow

- [x] [Desktop/Hard Wallet]() -- > Recipient
- [x] [Web dAPP]() -- > Publisher or Sender
- [ ]  [JS service]() -- > Developer SDK

![flow](caramel_web/public/flow.png)

1. Sender: Enter recipient's wallet or email  or userID, and upload the image.
2. Sender: Upload image.
3. System: Create or look up the account and retrieve the recipient's public key.
4. System: Retrieve the public key.
5. System: Encrypt the image and upload it to IPFS.
6. System: Mint NFT.
7. Caramel: Validate the recipient's email.
8. Caramel: Combine the recipient's and Caramel's key shares to reconstruct the private key.
9. Recipient: Decrypt the image with the private key.
10. Recipient: Display the decrypted image.


## Flow Blockchain            

| Feature                            | Flow Blockchain                                | Ethereum                                |
|------------------------------------|-----------------------------------------------|----------------------------------------|
| Account Model                      | User-centric, offering enhanced security, safety, and recoverability.           | Ethereum accounts follow the externally owned account (EOA) model.                                                                                       |
| Programming Language           | Cadence, designed for resource-oriented development, enables faster smart contract development and improved on-chain utility.            | Solidity is the primary language used in Ethereum smart contracts. It has a steeper learning curve compared to Cadence.                                                                                              |
| Scalability                            | Flow's unique sharded architecture enables higher throughput and scalability especially for large minting.       | Ethereum faces scalability challenges, leading to network congestion during peak usage.                                                                                                     |
| Gas Fees                              | Flow's gas model uses transaction fees based on computation complexity, making it more predictable and cost-effective for users.  | Ethereum uses a gas fee model that can be volatile, especially during periods of network congestion, resulting in higher fees.                                                                   |
| Consensus Algorithm         | Flow uses a flavour the HotStuff consensus algorithm, ensuring faster block confirmation times.        | Ethereum currently employs a Proof-of-Work (PoW) consensus algorithm, which is resource-intensive.                                             |
| NFT Standard                      | Flow has its own standard for Non-Fungible Tokens (NFTs) called Fungible Token (FT) standard, providing flexibility in token creation and management.   | Ethereum uses the ERC-721 and ERC-1155 standards for NFTs, offering a wide range of tokens but may lack some specific functionalities present in Flow's FT standard. |
| Developer-Friendly               | Flow's developer tools and documentation facilitate a smoother onboarding experience for developers.            | Ethereum has a vast developer community but can be overwhelming for newcomers due to its complexity and extensive ecosystem.                                                             |
| Environmental Impact         | Flow's Proof-of-Stake (PoS) mechanism consumes significantly less energy compared to Ethereum's PoW, making it more environmentally friendly. | Ethereum's PoW consensus consumes substantial amounts of energy, leading to environmental concerns.                                                                                                       |
| Ecosystem Growth               | Flow has a growing ecosystem with partnerships in the entertainment, gaming, and NFT spaces.           | Ethereum's ecosystem is well-established and has the first-mover advantage in the blockchain space.                                                                                                               |




