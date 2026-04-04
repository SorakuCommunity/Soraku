// _document.tsx
import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="apple-touch-icon"
          href="https://1anime.app/apple-touch-icon.png"
        />
        <meta name="theme-color" content="#000000" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css"
          integrity="sha512-1PKOgIY59xJ8Co8+NE6FZ+LOAZKjy+KY8iq0G4B3CyeY6wYHN3yt9PW0XpSriVlkMXe40PTKnXrLnZ9+fkDaog=="
          crossOrigin="anonymous"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="apple-mobile-web-app-capable" content="yes"></meta>
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        ></meta>
        <Script id="custom-context-menu" strategy="afterInteractive">
          {`
            document.addEventListener('contextmenu', function(e) {
              e.preventDefault();
              
              const customMenu = document.createElement('div');
              customMenu.className = 'bg-secondary';
              customMenu.style.cssText = 'position:fixed;top:' + e.clientY + 'px;left:' + e.clientX + 'px;border:1px solid #ccc;padding:10px;z-index:10000;border-radius:8px;';
              
              const target = e.target;
              let menuContent = '';

              if (target.tagName === 'IMG') {
                menuContent += '<li id="open-image" style="padding:5px 10px;cursor:pointer;display:flex;align-items:center;"><i class="fas fa-image" style="margin-right:8px;"></i>Open Image in New Tab</li>';
              } else if (target.tagName === 'A') {
                menuContent += '<li id="open-link" style="padding:5px 10px;cursor:pointer;display:flex;align-items:center;"><i class="fas fa-link" style="margin-right:8px;"></i>Open Link in New Tab</li>';
              } else if (window.getSelection().toString()) {
                menuContent += '<li id="copy-text" style="padding:5px 10px;cursor:pointer;display:flex;align-items:center;"><i class="fas fa-copy" style="margin-right:8px;"></i>Copy Text</li>';
              }

              menuContent += '<li id="go-to-settings" style="padding:5px 10px;cursor:pointer;display:flex;align-items:center;"><i class="fas fa-cog" style="margin-right:8px;"></i>Go to Settings</li>';
              
              customMenu.innerHTML = '<ul style="list-style:none;margin:0;padding:0;">' + menuContent + '</ul>';
              document.body.appendChild(customMenu);

              if (target.tagName === 'IMG') {
                document.getElementById('open-image').addEventListener('click', function() {
                  window.open(target.src, '_blank');
                  customMenu.remove();
                });
              }

              if (target.tagName === 'A') {
                document.getElementById('open-link').addEventListener('click', function() {
                  window.open(target.href, '_blank');
                  customMenu.remove();
                });
              }

              if (window.getSelection().toString()) {
                document.getElementById('copy-text').addEventListener('click', function() {
                  const selectedText = window.getSelection().toString();
                  navigator.clipboard.writeText(selectedText).then(() => {
                    alert('Text copied to clipboard');
                  });
                  customMenu.remove();
                });
              }

              document.getElementById('go-to-settings').addEventListener('click', function() {
                window.location.href = '/settings/';
                customMenu.remove();
              });

              document.addEventListener('click', function() {
                customMenu.remove();
              }, { once: true });
            });
          `}
        </Script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
