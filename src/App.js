import './App.scss';
import React, { useEffect, useRef, useState } from 'react';
import ToggleButton from './components/ToggleButton';

let lastPrice = 0;

const Loader = () => (
    <div className="crypto-alert-loader">
        <img src={'/loader.gif'} alt="Loading..." className="crypto-alert-loader-image" />
    </div>
);

function f(x) {
    return parseFloat(x).toFixed(Math.log10(x) < -2 ? 8 : 2);
}

// alert audio
let alert = new Audio('you-suffer-alert.mp3');

function App() {
    const webSocket = useRef(null);
    const [symbols, setSymbols] = useState([]);
    const [price, setPrice] = useState(0);
    const [state, setState] = useState('');
    const [alertWhen, setAlertWhen] = useState(false);
    const [isPlayed, setIsPlayed] = useState(false);
    const [isDark, setIsDark] = useState(true);
    const [compare, setCompare] = useState('less-than');

    const search = window.location.search;
    const params = new URLSearchParams(search);
    const symbol = params.get('symbol') || 'btcusdt';

    useEffect(() => {
        webSocket.current = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@trade`);
        webSocket.current.onmessage = (message) => {
            const trade = JSON.parse(message.data);

            setState(trade?.p > lastPrice ? 'up' : 'down');
            setPrice(trade?.p);

            lastPrice = trade?.p;
        };
        return () => webSocket.current.close();
    }, []);

    if (symbols?.length <= 0) {
        fetch('https://api.binance.com/api/v3/ticker/price')
            .then((info) => info.json())
            .then((data) => {
                setSymbols(data);
            });
    }

    useEffect(() => {
        // alert not set? return
        if (!alertWhen) {
            return;
        }

        let playMusic = false;

        // eslint-disable-next-line default-case
        switch (compare) {
            case 'less-than':
                playMusic = price <= alertWhen;

                if (price >= alertWhen) {
                    setIsPlayed(false);
                }
                break;
            case 'greater-than':
                playMusic = price >= alertWhen;

                if (price <= alertWhen) {
                    setIsPlayed(false);
                }
                break;
        }

        // price is great or equal to alert value
        if (playMusic && !isPlayed) {
            // play music
            alert?.play();
            // mark as played
            setIsPlayed(true);
        }
    }, [price]);

    const isLoading = !price || symbols.length <= 0;

    return (
        <div className={`crypto-alert crypto-alert--${isDark ? 'dark' : 'light'}`}>
            <div className="crypto-alert-header">
                <div className="crypto-alert-header-section">
                    <div
                        id="toggle"
                        className="crypto-alert-toggle"
                        onClick={() => {
                            setIsDark(!isDark);
                        }}>
                        <div
                            className={`crypto-alert-toggle-inner${
                                isDark ? ' crypto-alert-toggle-inner--active' : ''
                            }`}
                        />
                    </div>
                </div>
                {!isLoading && (
                    <div className="crypto-alert-header-section">
                        <div className="crypto-alert-selector">
                            <select
                                onChange={(e) => {
                                    window.open('/?symbol=' + e?.target?.value, '_self');
                                }}>
                                {symbols.map((data) => (
                                    <option
                                        value={data.symbol?.toLowerCase()}
                                        selected={symbol === data.symbol?.toLowerCase()}>
                                        {data.symbol}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </div>
            <div className="crypto-alert-container">
                <div className="crypto-alert-container__header">
                    <h1
                        onClick={() => {
                            window.location = '/';
                        }}>
                        Crypto Alert
                    </h1>
                </div>
                <div className="crypto-alert-container__content">
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <>
                            <div className={`crypto-alert-price crypto-alert-price--${state}`}>
                                <span>{f(price)}</span>
                            </div>
                            <div className="crypto-alert-threshold">
                                <ToggleButton
                                    leftLabel="Less than"
                                    rightLabel="Greater than"
                                    toggle={compare}
                                    onToggle={() => {
                                        setCompare(
                                            'less-than' !== compare ? 'less-than' : 'greater-than'
                                        );
                                    }}
                                />
                                <input
                                    className="crypto-alert-threshold-input"
                                    type="text"
                                    placeholder="enter price..."
                                    onBlur={(event) => {
                                        setTimeout(() => {
                                            setAlertWhen(event?.target?.value);
                                            setIsPlayed(false);
                                        }, 1000);
                                    }}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className="crypto-alert-footer">
                <div className="crypto-alert-footer-section">
                    Alert music:{' '}
                    <a
                        href="https://www.youtube.com/watch?v=_aOlMEWu-9s"
                        target="_blank"
                        rel="noreferrer">
                        Napalm Death - You Suffer
                    </a>
                </div>
                <div className="crypto-alert-footer-section">
                    Prices provided by{' '}
                    <a href="https://binance.com/" target="_blank" rel="noreferrer">
                        Binance
                    </a>{' '}
                    (might not be accurate, use at your own risk)
                </div>
                <div className="crypto-alert-footer-section">
                    <a href="https://github.com/emgk" target="_blank" rel="noreferrer">
                        contact
                    </a>
                </div>
                <div className="crypto-alert-footer-section">
                    <a href="https://memes.itsnotmy.site" target="_blank" rel="noreferrer">
                        memes
                    </a>
                </div>
            </div>
        </div>
    );
}

export default App;
