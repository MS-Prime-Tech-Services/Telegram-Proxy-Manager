from flask import Flask, render_template, jsonify
import re
from utils import parse_proxy_links

app = Flask(__name__)
app.secret_key = "dev-key-1234"  # For development only

# Store proxies in memory
PROXY_LINKS = []

def load_proxy_links():
    """Load proxy links from file"""
    global PROXY_LINKS
    try:
        with open('attached_assets/Pasted--p-id-mtproto-a-href-tg-proxy-server-157-240-22-2-amp-port-443-amp-secret-ee000000000000000000-1741088608550.txt', 'r', encoding='utf-8') as f:
            content = f.read()
            PROXY_LINKS = parse_proxy_links(content)
            print(f"Loaded {len(PROXY_LINKS)} proxy links")
    except Exception as e:
        print(f"Error loading proxy links: {e}")
        PROXY_LINKS = []

# Load proxies on startup
load_proxy_links()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_proxy')
def get_proxy():
    if not PROXY_LINKS:
        # Reload links if empty
        load_proxy_links()
        if not PROXY_LINKS:
            return jsonify({"error": "No proxy links available"})

    # Get the first proxy and move it to the end for rotation
    proxy = PROXY_LINKS[0]
    PROXY_LINKS.append(PROXY_LINKS.pop(0))

    return jsonify(proxy)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)