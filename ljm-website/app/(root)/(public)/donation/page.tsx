"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function DonatePage() {
  useEffect(() => {
    const initResizer = () => {
      if (typeof window !== "undefined" && (window as any).iFrameResize) {
        (window as any).iFrameResize(
          {
            checkOrigin: false,
            onScroll: function () {
              const element = document.getElementById("cause10462");
              if (element) {
                const offsetBonus = element.getAttribute("data-offset-bonus");
                if (offsetBonus !== null) {
                  const offset =
                    element.getBoundingClientRect().top -
                    document.body.getBoundingClientRect().top;
                  window.scrollTo({
                    top: offset - Number(offsetBonus),
                    behavior: "smooth",
                  });
                  return false;
                }
              }
            },
          },
          "#cause10462",
        );
      }
    };

    // Try to initialize after a short delay to ensure script is loaded
    const timer = setTimeout(initResizer, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-background min-h-screen py-10">
      <Script
        src="https://www.givenow.com.au/js/iframe-resizer/iframeResizer.min.js?version=4.3.2.1"
        strategy="afterInteractive"
      />

      <div className="mx-auto max-w-4xl px-4 pt-10">
        <h1 className="font-chillax text-foreground mb-6 text-center text-3xl font-bold">
          Make a Difference Today
        </h1>

        <div style={{ padding: "1px" }}>
          <iframe
            id="cause10462"
            className="gn-iframe"
            src="https://www.givenow.com.au/embed/Y2F1c2VpZD0xMDQ2MiZkb21haW49aHR0cHM6Ly9sam1tZW1vcmlhbGhvc3BpY2UuY29tJnRva2VuPTEwNDYyOjNiZWQyMjFlNmY1MGFhMw=="
            style={{
              width: "1px",
              minWidth: "100%",
              border: 0,
              height: "882px",
            }}
            data-offset-bonus="0"
            title="Donation Form"
          />
        </div>
      </div>
    </div>
  );
}
