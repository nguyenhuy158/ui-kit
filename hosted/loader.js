// The Tailwind browser runtime ignores a remote @import, so fetch the tokens and inject them.
(() => {
  const tokensUrl = document.currentScript?.dataset.tokens;
  if (!tokensUrl) {
    console.error("ui-kit loader: set data-tokens to the tokens.css URL");
    return;
  }
  fetch(tokensUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.text();
    })
    .then((css) => {
      const style = document.createElement("style");
      style.type = "text/tailwindcss";
      style.textContent = css;
      document.head.append(style);
    })
    .catch((error) => {
      console.error(`ui-kit loader: cannot load ${tokensUrl}`, error);
    });
})();
