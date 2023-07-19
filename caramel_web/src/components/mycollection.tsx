import { useTransaction } from "@/contexts/TransactionContext";
import { useEffect, useState } from "react";
import PhotoAlbum from "react-photo-album";
import * as fcl from "@onflow/fcl";
//@ts-ignore
import * as t from "@onflow/types";
import { get_userNFTs } from "@/cadence/scripts/get_files";
import { config } from "@onflow/fcl";

const photos = [
  { src: "https://via.placeholder.com/300/CCCCCC/FFFFFF?", width: 800, height: 600 },
  { src: "https://via.placeholder.com/500/CCCCCC/FFFFFF?", width: 1600, height: 900 },
  { src: "https://via.placeholder.com/400/CCCCCC/FFFFFF?", width: 1600, height: 900 },
  { src: "https://via.placeholder.com/500/CCCCCC/FFFFFF?", width: 1600, height: 900 },
];



export default function MyCollection() {
  const { publisher } = useTransaction();
  const [NFTs, setNFTs] = useState("")




  useEffect(() => {
    if (publisher.addr.length > 2 && !NFTs) {
      const configs = {
        flow_testnet: {
          accessNode: "https://side-still-sanctuary.flow-testnet.quiknode.pro",
          flowNetwork: "testnet",
        },
      };


      const fclConfig = config();
      fclConfig.put("accessNode.api", configs.flow_testnet.accessNode);

      fclConfig.put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn");
      fclConfig.put("discovery.authn.endpoint", "https://fcl-discovery.onflow.org/api/testnet/authn");
      fclConfig.put("discovery.authn.include", "0x33f75ff0b830dcec");
      fclConfig.put("app.detail.title", "Caramel");
      fclConfig.put("app.detail.icon", "https://placekitten.com/g/200/200");



      getuserNFTs()
    }
  },)


  const getuserNFTs = async () => {
    if (!publisher) {
      return
    }

    console.log(publisher)
    return
    const result = await fcl.send([
      fcl.script(get_userNFTs),
      fcl.args([
        fcl.arg(publisher.addr.slice(2), t.Address)
      ]),
      fcl.payer(fcl.authz),
      fcl.authorizations([fcl.authz]),
      fcl.proposer(fcl.authz),
      fcl.limit(9999),
    ]).then((fcl.decode))

    console.log(result)
    setNFTs(result)

  }


  return <PhotoAlbum
    spacing={10}
    layout="rows" photos={photos} />;
}