/* eslint-disable no-undef */
// Runner page for the screenshot tests. Fonts are served from node_modules so that
// rendering does not depend on the network.
export const visualRunnerHtml = testFramework => `
<html>
  <head>
    <link rel="stylesheet" href="/node_modules/@fontsource/roboto/300.css">
    <link rel="stylesheet" href="/node_modules/@fontsource/roboto/400.css">
    <link rel="stylesheet" href="/node_modules/@fontsource/roboto/500.css">
    <link rel="stylesheet" href="/node_modules/@fontsource/material-symbols-outlined/400.css">
  </head>
  <body>
    <style class="deanimator">
    *, *::before, *::after {
     -moz-transition: none !important;
     transition: none !important;
     -moz-animation: none !important;
     animation: none !important;
    }
    </style>
    <style>
    * { -webkit-font-smoothing: none; 
     font-kerning: none; 
     text-rendering: geometricPrecision;
     font-variant-ligatures: none;
     letter-spacing: 0.01em;}
    </style>
    <script>window.process = { env: ${JSON.stringify(process.env)} }</script>
    <script type="module" src="${testFramework}"></script>
    <script>
    function descendants(parent) {
      return (Array.from(parent.childNodes)).concat(
        ...Array.from(parent.children).map(child => descendants(child))
      );
    }
    const deanimator = document.querySelector('.deanimator');
    function deanimate(element) {
      if (!element.shadowRoot) return;
      if (element.shadowRoot.querySelector('.deanimator')) return;
      const style = deanimator.cloneNode(true);
      element.shadowRoot.appendChild(style);
      descendants(element.shadowRoot).forEach(deanimate);
    }
    const observer = new MutationObserver((mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type === 'childList') {
          descendants(document.body).forEach(deanimate);
        }
      }
    });
    observer.observe(document.body, {childList: true, subtree:true});
    </script>
    <style>
    * {
      margin: 0px;
      padding: 0px;
    }

    body {
      background: white;
      font-family: Roboto, sans-serif;
    }
    </style>
  </body>
</html>
`;
