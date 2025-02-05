"use client";
import React, { useEffect, useRef, memo } from "react";

function TradingViewWidget() {
    const container = useRef();

    useEffect(() => {
        if (container.current) {
            container.current.innerHTML = ""; // Prevent script duplication

            const script = document.createElement("script");
            script.src =
                "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
            script.type = "text/javascript";
            script.async = true;
            script.innerHTML = `
      {
        "autosize": true,
        "symbol": "COINBASE:SOLUSD",
        "interval": "1",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "2",
        "locale": "en",
        "backgroundColor": "rgba(0, 0, 0, 0.5)",
        "gridColor": "rgba(238, 238, 238, 0.06)",
        "hide_top_toolbar": true,
        "hide_legend": true,
        "allow_symbol_change": false,
        "calendar": false,
        "hide_volume": true,
        "support_host": "https://www.tradingview.com"
      }`;
            container.current.appendChild(script);
        }
    }, []);

    return (
        <div className="tradingview-widget-container" ref={container}
             style={{
                 height: "100%",
                 width: "100%"
            }}
        >
            <div
                className="tradingview-widget-container__widget"
                style={{
                    height: "calc(100% - 32px)",
                    width: "100%"
                }}
            ></div>
        </div>
    );
}

export default memo(TradingViewWidget);
