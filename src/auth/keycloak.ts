import Keycloak from "keycloak-js";

export const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL || "http://localhost",
  realm: import.meta.env.VITE_KEYCLOAK_REALM || "none",
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || "none",
});