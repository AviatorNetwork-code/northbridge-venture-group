type GtmNoScriptProps = {
  gtmId: string;
};

/**
 * GTM noscript fallback — must appear immediately after <body> for users without JavaScript.
 */
export function GtmNoScript({ gtmId }: GtmNoScriptProps) {
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
