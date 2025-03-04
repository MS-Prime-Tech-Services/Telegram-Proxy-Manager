let proxyLinks = [];
let currentProxy = null;

// Store all proxy HTML data directly in the script
const proxyData = `<p id="mtproto"><a href="tg://proxy?server=157.240.22.2&amp;port=443&amp;secret=ee00000000000000000000000000000000696f2e696f&amp;bot=@mtpro_xyz_bot">157.240.22.2</a>#US<br><a href="tg://proxy?server=103.126.50.25&amp;port=443&amp;secret=ee0000f00f0f775555fffffff5006e2e69612d2d2d2d2d2d2d2d&amp;bot=@mtpro_xyz_bot">103.126.50.25</a>#RO<br><a href="tg://proxy?server=195.201.235.202&amp;port=88&amp;secret=ee0d77db43ee3721f0fcb40a4ff63b5c5c2d7472616e736c6174652e676f6f676c652e636f6d2d&amp;bot=@mtpro_xyz_bot">195.201.235.202</a>#DE</p>`;

// Parse proxy links from HTML content
function parseProxyLinks(content) {
    console.log('Parsing proxy links from content');
    const pattern = /<a href="(tg:\/\/proxy\?[^"]+)">[^<]+<\/a>#(\w+)/g;
    const proxyList = [];
    let match;

    try {
        while ((match = pattern.exec(content)) !== null) {
            try {
                const url = decodeURIComponent(match[1]);
                const country = match[2];

                // Parse URL parameters
                const params = new URLSearchParams(url.split('?')[1]);

                const proxyInfo = {
                    server: params.get('server'),
                    port: params.get('port'),
                    secret: params.get('secret'),
                    country: country,
                    full_url: url
                };

                if (proxyInfo.server && proxyInfo.port && proxyInfo.secret) {
                    console.log('Found valid proxy:', proxyInfo.server);
                    proxyList.push(proxyInfo);
                }
            } catch (e) {
                console.error('Error parsing individual proxy:', e);
            }
        }
    } catch (e) {
        console.error('Error in parseProxyLinks:', e);
    }

    console.log(`Found ${proxyList.length} valid proxies`);
    return proxyList;
}

function generateProxy() {
    console.log('Generating new proxy');

    // Parse proxies if not already parsed
    if (!proxyLinks.length) {
        proxyLinks = parseProxyLinks(proxyData);
    }

    if (!proxyLinks.length) {
        console.error('No proxy links available');
        alert('No proxy links available');
        return;
    }

    try {
        // Get first proxy and rotate
        currentProxy = proxyLinks[0];
        proxyLinks.push(proxyLinks.shift());

        // Update UI with animation
        const elements = {
            server: document.getElementById('server'),
            port: document.getElementById('port'),
            country: document.getElementById('country'),
            secret: document.getElementById('secret')
        };

        // Add fade-out effect
        Object.values(elements).forEach(el => el.style.opacity = '0');

        // Update values after a short delay
        setTimeout(() => {
            elements.server.textContent = currentProxy.server;
            elements.port.textContent = currentProxy.port;
            elements.country.textContent = currentProxy.country;
            elements.secret.value = currentProxy.secret;

            // Fade back in
            Object.values(elements).forEach(el => el.style.opacity = '1');

            // Enable open button
            document.getElementById('open-proxy').disabled = false;

            console.log('UI updated with new proxy data');
        }, 200);
    } catch (e) {
        console.error('Error in generateProxy:', e);
        alert('Failed to generate proxy. Please try again.');
    }
}

function copySecret() {
    const secretInput = document.getElementById('secret');
    const copyBtn = document.querySelector('.copy-btn');

    try {
        // Copy text
        secretInput.select();
        document.execCommand('copy');

        // Add animation class
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = '<i class="bi bi-check2"></i>';

        // Remove animation after delay
        setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = '<i class="bi bi-clipboard"></i>';
        }, 1500);

        console.log('Secret copied successfully');
    } catch (e) {
        console.error('Error copying secret:', e);
    }
}

function openProxy() {
    if (!currentProxy) {
        console.error('No proxy selected');
        return;
    }
    console.log('Opening proxy in Telegram');
    window.location.href = currentProxy.full_url;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, initializing proxy manager');
    generateProxy();
});