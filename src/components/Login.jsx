export const Login = (props) => {
    return (
        <div className="main-login text-center">
            <div className='container'>
                <div className='section-title'>
                    {props.days * 24 * 3600 + props.hours * 3600 + props.minutes * 60 + props.seconds > 0 ?
                        <>
                            <h1>Mint is not live now</h1>
                            <h1>{props.days}d : {props.hours}h: {props.minutes}m: {props.seconds}s</h1>
                        </> :
                        <h2>Connect to Near Wallet</h2>
                    }
                </div>
            </div>
        </div>
    )
}