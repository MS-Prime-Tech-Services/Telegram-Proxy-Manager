import re
from urllib.parse import parse_qs, urlparse
import html

def parse_proxy_links(content):
    """Parse Telegram proxy links from HTML content."""
    # Find all proxy links with country codes
    pattern = r'<a href="(tg://proxy\?[^"]+)">[^<]+</a>#(\w+)'
    matches = re.finditer(pattern, content)

    proxy_list = []
    for match in matches:
        try:
            # Get URL and country from match groups
            url = html.unescape(match.group(1))  # Handle HTML entities
            country = match.group(2)

            # Parse URL parameters
            parsed = urlparse(url)
            params = parse_qs(parsed.query)

            # Skip if required parameters are missing
            required_params = ['server', 'port', 'secret']
            if not all(param in params for param in required_params):
                continue

            proxy_info = {
                "server": params["server"][0],
                "port": params["port"][0],
                "secret": params["secret"][0],
                "country": country,
                "full_url": url
            }
            proxy_list.append(proxy_info)
        except Exception as e:
            print(f"Error parsing proxy link: {e}")
            continue

    print(f"Found {len(proxy_list)} valid proxy links")
    return proxy_list