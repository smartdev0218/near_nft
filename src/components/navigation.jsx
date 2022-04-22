import { useEffect, useState } from "react"
import *as nearAPI from "near-api-js";

export const Navigation = (props) => {
  const [account_id, setAccountID] = useState("");
  const { connect, KeyPair, keyStores, WalletConnection} = nearAPI;

  useEffect(async () => {
    const near = await connect(config);
    const wallet =  new WalletConnection(near);
    setAccountID(wallet.getAccountId());
  }, [account_id])

  const config = {
    networkId: "testnet",
    keyStore: new keyStores.BrowserLocalStorageKeyStore(),
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
  };

  const connectButton= async () => {
    const near = await connect(config);
    const wallet = new WalletConnection(near);
    wallet.requestSignIn(
      {contractId: "nft_app7.testnet", methodNames: ["nft_mint"]},
      "App",
      null,
      null
    );
    setAccountID(wallet.getAccountId());
  }

  const disconnectButton = async () => {
    const near = await connect(config);
    const wallet = new WalletConnection(near);
    wallet.signOut();
    setAccountID("");
    window.location.reload();
  }

  return (
    <nav id='menu' className='navbar navbar-default navbar-fixed-top'>
      <div className='container'>
        <div className='navbar-header'>
          <button
            type='button'
            className='navbar-toggle collapsed'
            data-toggle='collapse'
            data-target='#bs-example-navbar-collapse-1'
          >
            {' '}
            <span className='sr-only'>Toggle navigation</span>{' '}
            <span className='icon-bar'></span>{' '}
            <span className='icon-bar'></span>{' '}
            <span className='icon-bar'></span>{' '}
          </button>
          <a className='navbar-brand page-scroll' href='#'>
            NFT
          </a>{' '}
        </div>

        <div
          className='collapse navbar-collapse'
          id='bs-example-navbar-collapse-1'
        >
          <ul className='nav navbar-nav navbar-right'>
            <li>
              {!account_id ?
                <a className='page-scroll' onClick = {connectButton}>Connect</a> : 
                <a className='page-scroll' onClick = {disconnectButton}>Disconnect</a>
              }
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
