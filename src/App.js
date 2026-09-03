import React, { useEffect, useRef, useState } from 'react';
import ToggleButton from './components/ToggleButton';
import symbols from './symbols';

let lastPrice = 0;

const Loader = () => (
    <div className="flex justify-center items-center p-8">
        <img src={'/loader.gif'} alt="Loading..." className="w-16 h-16 opacity-80" />
    </div>
);

function f(x) {
    return parseFloat(x).toFixed(Math.log10(x) < -2 ? 8 : 2);
}

// alert audio
let alert = new Audio('you-suffer-alert.mp3');

function App() {
    const webSocket = useRef(null);
    const [price, setPrice] = useState(0);
    const [state, setState] = useState('');
    const [alertWhen, setAlertWhen] = useState(false);
    const [isPlayed, setIsPlayed] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
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
    }, [symbol]);

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
            alert?.play().catch((e) => console.log('Audio play failed', e));
            setTimeout(() => {
                setIsPlaying(true);
            }, 500);
            setTimeout(() => {
                setIsPlaying(false);
            }, 1800);
            // mark as played
            setIsPlayed(true);
        }
    }, [price, alertWhen, compare, isPlayed]);

    const isLoading = !price || symbols.length <= 0;

    return (
        <div className="min-h-screen font-sans">
            <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300 flex flex-col">
                {/* Header */}
                <header className="p-4 sm:p-6 flex justify-end items-center max-w-5xl mx-auto w-full">
                    {!isLoading && (
                        <div>
                            <select
                                className="block w-full rounded-md border-gray-300 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 px-3 outline-none"
                                value={symbol}
                                onChange={(e) => {
                                    window.open('/?symbol=' + e?.target?.value, '_self');
                                }}>
                                {symbols.map((data) => (
                                    <option key={data.symbol} value={data.symbol?.toLowerCase()}>
                                        {data.symbol}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </header>

                <main className="flex-grow flex flex-col items-center justify-center p-4">
                    <div className="w-full max-w-md rounded-2xl overflow-hidden p-6 sm:p-8 transition-colors duration-300">
                        <div
                            className="text-center mb-8 cursor-pointer select-none"
                            onClick={() => (window.location = '/')}>
                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 flex justify-center items-center space-x-3">
                                <span>Crypto Alert</span>
                                <span className="text-4xl">
                                    {isLoading
                                        ? '🚀'
                                        : isPlaying
                                        ? '👹'
                                        : state === 'up'
                                        ? '😀'
                                        : '🙁'}
                                </span>
                            </h1>
                        </div>

                        {isLoading ? (
                            <Loader />
                        ) : (
                            <div className="space-y-8">
                                <div className="text-center">
                                    <div
                                        className={`text-5xl sm:text-6xl font-black tracking-tighter transition-colors duration-300 ${
                                            state === 'up' ? 'text-green-500' : 'text-red-500'
                                        }`}>
                                        ${f(price)}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <ToggleButton
                                        leftLabel="Less than"
                                        rightLabel="Greater than"
                                        toggle={compare}
                                        onToggle={() => {
                                            setCompare(
                                                'less-than' !== compare
                                                    ? 'less-than'
                                                    : 'greater-than'
                                            );
                                        }}
                                    />

                                    <div>
                                        <input
                                            className="block w-full rounded-xl border-gray-900 bg-white px-4 py-3 text-center text-lg shadow-inner focus:border-indigo-500 focus:ring-indigo-500 outline-none transition-colors"
                                            type="number"
                                            placeholder="Enter target price..."
                                            onBlur={(event) => {
                                                const val = event.target.value;
                                                setTimeout(() => {
                                                    setAlertWhen(val ? parseFloat(val) : false);
                                                    setIsPlayed(false);
                                                }, 500);
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.target.blur();
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
                <footer className="p-6 text-center text-sm text-gray-500 space-y-2">
                    <div>
                        Alert music:{' '}
                        <a
                            href="https://www.youtube.com/watch?v=_aOlMEWu-9s"
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-600 hover:underline">
                            Napalm Death - You Suffer
                        </a>
                    </div>
                    <div>Prices might not be accurate, use at your own risk.</div>
                    {/*<div>*/}
                    {/*    <a*/}
                    {/*        href="https://github.com/emgk/crypto-coin-alert"*/}
                    {/*        target="_blank"*/}
                    {/*        rel="noreferrer"*/}
                    {/*        className="hover:underline">*/}
                    {/*        GitHub source code*/}
                    {/*    </a>*/}
                    {/*</div>*/}
                </footer>
            </div>
        </div>
    );
}

export default App;
