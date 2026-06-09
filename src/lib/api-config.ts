/**
 * API Configuration for Brainexa
 * Centralizes backend URLs to support both local and production environments.
 */

// Use environment variables if available, otherwise fallback to local defaults
const isLocal = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || (isLocal ? "http://localhost:3003" : (typeof window !== "undefined" ? window.location.origin : "https://brainexa-node-backend.onrender.com"));
export const PY_API_BASE_URL = import.meta.env.VITE_PY_BACKEND_URL || (isLocal ? "http://localhost:8000" : "https://brainexa-py-backend.onrender.com");

// Derived API endpoints for common services
export const AUTH_API = `${API_BASE_URL}/api/auth`;
export const USER_API = `${API_BASE_URL}/api/user`;
export const KNOWLEDGE_API = `${PY_API_BASE_URL}/knowledge`;

console.log("🚀 Brainexa API Config Loaded:", {
  NodeBackend: API_BASE_URL,
  PythonBackend: PY_API_BASE_URL,
});
