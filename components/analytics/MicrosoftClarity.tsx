import Script from "next/script";

type MicrosoftClarityProps = {
  projectId: string;
};

/**
 * Microsoft Clarity — loaded once from root layout when NEXT_PUBLIC_CLARITY_ID is set.
 * Uses the official bootstrap snippet via next/script (afterInteractive).
 */
export function MicrosoftClarity({ projectId }: MicrosoftClarityProps) {
  const clarityBootstrap = `(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", ${JSON.stringify(projectId)});`;

  return (
    <Script
      id="_microsoft-clarity"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: clarityBootstrap }}
    />
  );
}
