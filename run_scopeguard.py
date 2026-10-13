"""Convenience launcher to run ScopeGuard backend and frontend servers together."""

import os
import subprocess
import sys
import time

def main():
    print("=" * 60)
    print("🛡️  Starting ScopeGuard (Local-First Scope Creep Detector)")
    print("=" * 60)
    print("• Backend API:  http://127.0.0.1:8000 (Docs at /docs)")
    print("• Frontend App: http://localhost:5173")
    print("• Ollama Node:  http://localhost:11434")
    print("=" * 60)

    # Start FastAPI backend
    backend_cmd = [
        sys.executable,
        "-m",
        "uvicorn",
        "backend.app.main:app",
        "--host",
        "127.0.0.1",
        "--port",
        "8000",
        "--reload",
    ]
    print("[1/2] Launching FastAPI backend...")
    backend_proc = subprocess.Popen(backend_cmd)

    # Start Vite frontend
    frontend_dir = os.path.join(os.path.dirname(__file__), "frontend")
    frontend_cmd = "npm run dev"
    print("[2/2] Launching Vite React frontend...")
    frontend_proc = subprocess.Popen(frontend_cmd, cwd=frontend_dir, shell=True)

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nStopping ScopeGuard servers...")
        backend_proc.terminate()
        frontend_proc.terminate()
        backend_proc.wait()
        frontend_proc.wait()
        print("ScopeGuard stopped.")

if __name__ == "__main__":
    main()
