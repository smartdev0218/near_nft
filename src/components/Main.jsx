import { useEffect, useState } from "react";
import * as nearAPI from "near-api-js";
import { Wlaccount } from "./Wlaccount";

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
        changeMethods: ["nft_mint"],
        sender: wallet.getAccountId(),
      }
    );
    setTotal(await contract.nft_total_supply());
    const mine = await contract.nft_tokens_for_owner({account_id: wallet.getAccountId()});
    setMine(mine.length);
    for(var i = 0; i < mine.length; i ++) {
      nft_list.push(mine[i]);
    }
    setLoading1(true);
  }, [isLoading])

  const checkAccount = () => {
    for(var i = 0; i < Wlaccount.length; i++) {
      if(Wlaccount[i] == props.accountId) {
        return true;
      }
    }
    return false;
  }

  const onMint = async () => {
    const wl_time1 = new Date("Apr 26, 2022 18:00:00 UTC").getTime();
    const wl_time2 = new Date("Apr 26, 2022 19:00:00 UTC").getTime();
    const currentTime = new Date().getTime();

    const near = await connect(config);
    const wallet =  new WalletConnection(near);
    const contract = await new nearAPI.Contract(
      wallet.account(),
      "nft_app7.testnet",
      {
        viewMethods: ["nft_total_supply", "nft_tokens_for_owner"],
        changeMethods: ["nft_mint"],
        sender: wallet.getAccountId(),
      }
    );
    const links = "https://bafybeid7bdbmx3g2z27lo6oy6zed5fqhw7slh4ozcupxbncd2bvgwsusme.ipfs.nftstorage.link/assets/" + (parseInt(nft_total_supply) + 1).toString() + ".gif";
    
    if(currentTime >= wl_time1 && currentTime <= wl_time2) {
      if(checkAccount()) {
        if(nft_total_supply <= 500) {
          await contract.nft_mint(
            {
              token_id: (parseInt(nft_total_supply) + 1).toString(),
              metadata: {
                title: "Flipping Coin " + (parseInt(nft_total_supply) + 1).toString(),
                description: "Flipping Coin is a casino project that will share revenue with holders in NEAR (3% out of the 3.5% fees). They have a coin flip ready on the day they opened their discord and plan to build more games in the future. they will collab and build coinflips for the others NEAR projects , the revenue will be split 50/50",
                media: links,
                copies: 1
              },
              receiver_id: props.accountId,
              perpetual_royalties: {
                "coin-flip.testnet": 999
              }
            }, 
            "300000000000000", 
            "5000000000000000000000000"
          );
          setLoading(true);
        }
        else {
          alert("All NFT is sold out.");
        }
      }
      else {
        alert("You are not whitelist account!");
      }
    }
    else if(currentTime > wl_time2) {
      if(nft_total_supply <= 500) {
        await contract.nft_mint(
          {
            token_id: (parseInt(nft_total_supply) + 1).toString(),
            metadata: {
              title: "Flipping Coin " + (parseInt(nft_total_supply) + 1).toString(),
              description: "Flipping Coin is a casino project that will share revenue with holders in NEAR (3% out of the 3.5% fees). They have a coin flip ready on the day they opened their discord and plan to build more games in the future. they will collab and build coinflips for the others NEAR projects , the revenue will be split 50/50",
              media: links,
              copies: 1
            },
            receiver_id: props.accountId,
            perpetual_royalties: {
              "coin-flip.testnet": 999
            }
          }, 
          "300000000000000", 
          "5000000000000000000000000"
        );
        setLoading(true);
      }
      else {
        alert("All NFT is sold out.");
      }
    }
    else {
      alert("Mint is not live now.");
    }
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
            <div className="col text-center">
              <p style = {{fontSize: '45px'}}>Your NFT collection</p><br/><br/><br/><br/>
            </div>
            {isLoading1 == false ? <></> :
              nft_list.map(v => 
                <div className='col-sm-12 col-md-6 col-lg-4'>
                    <p>{v.metadata.title}</p>
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
