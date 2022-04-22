import { useState, useEffect } from 'react'
import { Navigation } from './components/navigation'
import { Main } from './components/Main'
import { Login } from './components/Login'
import SmoothScroll from 'smooth-scroll'
import * as nearAPI from 'near-api-js'

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
})

const App = () => {
  const [account_id, setAccount] = useState("");
  const { connect, KeyPair, keyStores, WalletConnection} = nearAPI;

  const config = {
    networkId: "testnet",
    keyStore: new keyStores.BrowserLocalStorageKeyStore(),
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
  };
  useEffect(async () => {
    const near = await connect(config);
    const wallet =  new WalletConnection(near);
    const contract = await new nearAPI.Contract(
      wallet.account(),
      "nft_app7.testnet",
      {
        viewMethods: ["nft_total_supply", "nft_tokens_for_owner"],
        changeMethods: ["nft_mint", "near_mint"],
        sender: wallet.getAccountId(),
      }
    );
    setAccount(wallet.getAccountId());
  })
  return (
    <div>
      <Navigation />
      {account_id ? <Main accountId = {account_id}/> : <Login />}
    </div>
  )
}

export default App
