"""HTTP endpoint to trigger the nightly property sync from an external cron.

Replaces a separate Railway cron service that wrote to its own volume (which
the public site can't read). Running the sync from within the backend service
guarantees the downloaded files land on the backend's media volume.
"""
import hmac
import logging
import os
import subprocess
import sys

from rest_framework.decorators import api_view
from rest_framework.response import Response


logger = logging.getLogger(__name__)


@api_view(["POST"])
def trigger_sync(request):
    expected = os.environ.get("SYNC_TRIGGER_TOKEN", "")
    if not expected:
        return Response({"error": "sync trigger not configured"}, status=503)

    auth = request.headers.get("Authorization", "")
    if auth.startswith("Bearer "):
        token = auth[len("Bearer "):].strip()
    else:
        token = (request.GET.get("token") or "").strip()

    if not token or not hmac.compare_digest(token, expected):
        return Response({"error": "unauthorized"}, status=401)

    # Spawn a detached subprocess so the HTTP request can return quickly
    # (cron-job.org has a short request timeout) while the sync, which may
    # take a few minutes, runs to completion in the background.
    try:
        subprocess.Popen(
            [sys.executable, "manage.py", "sync_properties", "--force"],
            cwd="/app",
            start_new_session=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
    except Exception as e:
        logger.exception("Failed to spawn sync_properties subprocess")
        return Response({"error": f"spawn failed: {e}"}, status=500)

    return Response({"status": "sync started in background"}, status=202)
