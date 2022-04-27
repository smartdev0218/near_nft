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
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
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
      "near_nft.testnet",
      {
        viewMethods: ["nft_total_supply", "nft_tokens_for_owner"],
        changeMethods: ["nft_mint"],
        sender: wallet.getAccountId(),
      }
    );
    setAccount(wallet.getAccountId());

    const interval = setInterval(() => {
        const distance = new Date("Apr 27, 2022 15:00:00 UTC") - new Date().getTime();
        setDays(Math.floor(distance / (1000 * 60 * 60 * 24)));
        setHours(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
        setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
        setSeconds(Math.floor((distance % (1000 * 60)) / 1000));
      return () => clearInterval(interval);
    }, 1000);
  })

  return (
    <div>
      <Navigation days = {days} hours = {hours} minutes = {minutes} seconds = {seconds} />
      {account_id ? <Main accountId = {account_id}/> : <Login days = {days} hours = {hours} minutes = {minutes} seconds = {seconds} />}
    </div>
  )
}

export default App
