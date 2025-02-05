import { useState, useEffect } from "react";

export default function useWebSocket() {
    const [price, setPrice] = useState(null);

    useEffect(() => {
        const ws = new WebSocket("wss://stream.binance.com:9443/ws/solusdt@kline_1m");

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                const open = parseFloat(data.k.o);
                const close = parseFloat(data.k.c);
                const high = parseFloat(data.k.h);
                const low = parseFloat(data.k.l);

                const avg = Math.trunc(((open + close + high + low) / 4) * 100) / 100;
                setPrice(avg);
            } catch (error) {
                console.error("Error parsing WebSocket data:", error);
            }
        };

        return () => ws.close(); // Cleanup on unmount
    }, []);

    return price;
}