// ==UserScript==
// @name        highlighter
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       GM_getValue
// @grant       GM_xmlhttpRequest
// @version     1.0
// @author      spoderx555
// @description 
// ==/UserScript==

const webhooks = GM_getValue("webhooks", []);
const username = GM_getValue("username", "test-bot");

document.addEventListener("selectionchange", debounce(handler, 500));

function send(webhook, text, site, hostname) {
   GM_xmlhttpRequest({
     url: webhook,
     method: 'POST',
     headers: {
      "Content-Type": "application/json",
      },
     data: JSON.stringify({
      username: username,
      embeds: [
        {
          title: "go to",
          description: `\`${text}\``,
          url: site,
          color: 0x000000,
          footer: { text: hostname },
          timestamp: new Date().toISOString(),
        },
      ],
    })
   });
}


function handler(e) {
  const selection = document.getSelection();

  if (selection.isCollapsed) return;

  const range = selection.getRangeAt(0).cloneRange();
  range.collapse(false);
  const rect = range.getBoundingClientRect();

  const tooltip = document.createElement("button");
  tooltip.innerText = "Send to Webhook";
  tooltip.id = "extension-tooltip";
  tooltip.style = `position: absolute;top: ${parseInt(window.scrollY+rect.bottom)}px;left: ${
    parseInt(window.scrollX+rect.right + 5)
  }px;padding: 5px 15px; border-radius: 5px;border: 1px solid black;cursor: pointer;z-index:50;background-color:white;color:black;`;
  tooltip.onclick = () => {
    for (const webhook of webhooks) {
      send(webhook,selection.toString(), location.href, location.hostname);
    }
    tooltip.remove();
  };
  document.body.appendChild(tooltip);
}

function debounce(func, duration) {
      let timeout;

      return function (...args) {
        let tooltip = document.getElementById("extension-tooltip");
        if (tooltip) tooltip.remove();
        const effect = () => {
          timeout = null;
          return func.apply(this, args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(effect, duration);
      };
    }


