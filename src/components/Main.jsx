import { useEffect, useState } from "react";
import * as nearAPI from "near-api-js";
import { ReactNotifications, Store } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
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
      "near_nft.testnet",
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
    const wl_time1 = new Date("Apr 29, 2022 19:00:00 UTC").getTime();
    const wl_time2 = new Date("Apr 29, 2022 20:00:00 UTC").getTime();
    const currentTime = new Date().getTime();

    const near = await connect(config);
    const wallet =  new WalletConnection(near);
    const contract = await new nearAPI.Contract(
      wallet.account(),
      "near_nft.testnet",
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

          const mine_total = await contract.nft_tokens_for_owner({account_id: wallet.getAccountId()});
          if(mine_total < 1 || props.accountId == "vandammefc.near") {
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
            Store.addNotification({
              title: "Warning!",
              message: "Whitelist accounts can mint only one NFT.",
              type: "danger",
              insert: "top-right",
              container: "top-right",
              animationIn: ["animate__animated", "animate__fadeIn"],
              animationOut: ["animate__animated", "animate__fadeOut"],
              dismiss: {
                duration: 5000,
                onScreen: true
              }
            });
          }
        }
        else {
          Store.addNotification({
            title: "Warning!",
            message: "All NFTs are sold out.",
            type: "default",
            insert: "top-right",
            container: "top-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: true
            }
          });
        }
      }
      else {
        Store.addNotification({
          title: "Warning!",
          message: "You are not whitelist account. From 19:00 to 20 is for whitelist account",
          type: "warning",
          insert: "top-right",
          container: "top-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true
          }
        });
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
        Store.addNotification({
          title: "Warning!",
          message: "All NFTs are sold out.",
          type: "default",
          insert: "top-right",
          container: "top-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true
          }
        });
      }
    }
  }

  return (
    <div className='main text-center'>
      <ReactNotifications />
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
            <p style = {{fontSize: '45px'}}>Your NFT collection</p><br/><br/><br/><br/><br/>
            </div>
            {isLoading1 == false ? <></> :
              nft_list.map((v, i) => 
                <div className='col-sm-12 col-md-6 col-lg-4' key = {i}>
                    <p>{v.metadata.title}</p>
                    <img src = {v.metadata.media} alt = "Flipping Coin" width = "100%" />
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}
