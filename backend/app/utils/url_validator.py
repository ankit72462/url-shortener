import urllib.parse
from fastapi import HTTPException

# Disallowed IP ranges and schemes
DISALLOWED_SCHEMES = {"file", "javascript", "data"}
DISALLOWED_IPS = ["127.", "10.", "192.168.", "169.254."] # Simple prefix check for demo
for i in range(16, 32):
    DISALLOWED_IPS.append(f"172.{i}.")

def validate_url(url: str) -> None:
    if len(url) > 2048:
        raise HTTPException(status_code=400, detail="URL exceeds maximum length of 2048 characters")
    
    parsed = urllib.parse.urlparse(url)
    
    if parsed.scheme not in {"http", "https"}:
        raise HTTPException(status_code=400, detail="Only HTTP and HTTPS schemes are allowed")
        
    if parsed.scheme in DISALLOWED_SCHEMES:
        raise HTTPException(status_code=400, detail="Scheme not allowed")
        
    hostname = parsed.hostname or ""
    for ip_prefix in DISALLOWED_IPS:
        if hostname.startswith(ip_prefix):
            raise HTTPException(status_code=400, detail="Private or loopback IPs are not allowed")
