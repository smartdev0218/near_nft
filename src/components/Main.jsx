import { useEffect, useState } from "react";
import * as nearAPI from "near-api-js";

export const Main = (props) => {
  const { connect, KeyPair, keyStores, WalletConnection} = nearAPI;
  const [nft_mine, setMine] = useState(0);
  const [nft_list, setList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isLoading1, setLoading1] = useState(false);
  const [nft_total_supply, setTotal] = useState(0);

  const config = {
    networkId: "testnet",
    keyStore: new keyStores.BrowserLocalStorageKeyStore(),
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
  };

  useEffect(async () => {
    setLoading(false);
    setLoading1(false);
    const near = await connect(config);
    const wallet =  new WalletConnection(near);
    const contract = await new nearAPI.Contract(
      wallet.account(),
      "nft_app7.testnet",
      {
        viewMethods: ["nft_total_supply", "nft_tokens_for_owner"],
        changeMethods: ["near_mint"],
        sender: wallet.getAccountId(),
      }
    );
    setTotal(await contract.nft_total_supply() - 1);
    const mine = await contract.nft_tokens_for_owner({account_id: wallet.getAccountId()});
    setMine(mine.length);
    for(var i = 0; i < mine.length; i ++) {
      nft_list.push(mine[i]);
    }
    setLoading1(true);
    console.log(mine);
  }, [isLoading])

  const onMint = async () => {
      const near = await connect(config);
      const wallet =  new WalletConnection(near);
      const contract = await new nearAPI.Contract(
        wallet.account(),
        "nft_app7.testnet",
        {
          viewMethods: ["nft_total_supply", "nft_tokens_for_owner"],
          changeMethods: ["near_mint"],
          sender: wallet.account(),
        }
      );
      const links = "https://bafybeiaxy7wpx65llffkqunta527pbbzjs6jkzdip6ikodcl767n4osfsu.ipfs.nftstorage.link/assets/" + (nft_total_supply + 1).toString() + ".gif";
      console.log(links + ", " + props.accountId);
      await contract.near_mint(
        {
          metadata: {
            title: "NFT " + (nft_total_supply + 1).toString(),
            description: "Near Non-Fungible-Token " + (nft_total_supply + 1).toString(),
            media: links,
            copies: 1
          },
          receiver_id: props.accountId
        }, 
        "300000000000000", 
        "5000000000000000000000000"
      );
      setLoading(true);
  }

  return (
    <div className='main text-center'>
      <div className='container'>
        <div className='section-title'>
          <h2>{props.accountId}</h2>
          <p>Total Supply: {nft_total_supply}/500</p>
          <p>Mint Price: 5 Near</p>
          <p>Your NFT: {nft_mine}</p>
        </div>
        <div className='row'>
          <div className='main-items'>
            <div className='col-sm-12 col-md-12 col-lg-12'>
              <button type = 'button' className = 'btn btn-warning btn-block' onClick = {onMint}>Mint</button>
            </div>
            {isLoading1 == false ? <></> :
              nft_list.map(v => 
                <div className='col-sm-12 col-md-6 col-lg-4'>
                  <p>Title: {v.metadata.title}</p>
                  <img src = {v.metadata.media} alt = "" width = "100%" />
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}
