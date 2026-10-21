
from pathlib import Path

from google_auth_oauthlib.flow import InstalledAppFlow

BASE_DIR = Path(__file__).resolve().parent

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets.readonly"
]

CLIENT_FILE = BASE_DIR / "oauth-client.json"
TOKEN_FILE = BASE_DIR / "oauth-token.json"

if not CLIENT_FILE.is_file():
    raise FileNotFoundError(
        f"OAuth client configuration not found: {CLIENT_FILE}"
    )

print("Starting Google Sheets authorization...")

flow = InstalledAppFlow.from_client_secrets_file(
    str(CLIENT_FILE),
    scopes=SCOPES,
)

credentials = flow.run_local_server(
    host="localhost",
    port=8080,
    access_type="offline",
    prompt="consent",
    open_browser=True,
    success_message="Google authorization completed. You may close this window.",
)

if not credentials.refresh_token:
    raise RuntimeError(
        "Google did not provide a refresh token. "
        "The existing token file has not been replaced."
    )

TOKEN_FILE.write_text(
    credentials.to_json(),
    encoding="utf-8",
)

print("Google authorization successful.")
print("Refresh token available:", bool(credentials.refresh_token))
print("OAuth credentials saved.")
