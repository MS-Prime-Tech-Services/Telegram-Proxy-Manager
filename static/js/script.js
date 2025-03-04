let currentProxy = null;

async function generateProxy() {
    try {
        const response = await fetch('/get_proxy');
        const data = await response.json();

        if (data.error) {
            alert(data.error);
            return;
        }

        currentProxy = data;

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
            elements.server.textContent = data.server;
            elements.port.textContent = data.port;
            elements.country.textContent = data.country;
            elements.secret.value = data.secret;

            // Fade back in
            Object.values(elements).forEach(el => el.style.opacity = '1');

            // Enable open button
            document.getElementById('open-proxy').disabled = false;
        }, 200);

    } catch (error) {
        console.error('Error fetching proxy:', error);
        alert('Failed to generate proxy. Please try again.');
    }
}

function openProxy() {
    if (!currentProxy) return;
    window.location.href = currentProxy.full_url;
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

// Add CSS transition
document.addEventListener('DOMContentLoaded', () => {
    const elements = ['#server', '#port', '#country', '#secret'].forEach(selector => {
        const el = document.querySelector(selector);
        if (el) el.style.transition = 'opacity 0.2s ease-in-out';
    });
    // Generate first proxy
    generateProxy();
});