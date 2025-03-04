let proxyLinks = [];
let currentProxy = null;

// Parse proxy links from HTML content
function parseProxyLinks(content) {
    const pattern = /<a href="(tg:\/\/proxy\?[^"]+)">[^<]+<\/a>#(\w+)/g;
    const proxyList = [];
    let match;

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
                proxyList.push(proxyInfo);
            }
        } catch (e) {
            console.error('Error parsing proxy link:', e);
        }
    }
    return proxyList;
}

async function loadProxyLinks() {
    try {
        const response = await fetch('proxy_links.txt');
        const content = await response.text();
        proxyLinks = parseProxyLinks(content);
        console.log(`Loaded ${proxyLinks.length} proxy links`);
        if (proxyLinks.length > 0) {
            generateProxy();
        }
    } catch (error) {
        console.error('Error loading proxy links:', error);
    }
}

function generateProxy() {
    if (!proxyLinks.length) {
        alert('No proxy links available');
        return;
    }

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
    }, 200);
}

function copySecret() {
    const secretInput = document.getElementById('secret');
    const copyBtn = document.querySelector('.copy-btn');

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
}

function openProxy() {
    if (!currentProxy) return;
    window.location.href = currentProxy.full_url;
}

// Load proxies when page loads
document.addEventListener('DOMContentLoaded', loadProxyLinks);
