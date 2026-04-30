import React, { createContext, useContext, useEffect, useState } from "react";

const ClientContext = createContext(null);

function readStoredToken() {
  const raw = localStorage.getItem("token");

  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function readStoredProfile() {
  const raw = localStorage.getItem("profile");

  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function storeToken(token) {
  if (token) {
    localStorage.setItem("token", JSON.stringify(token));
  } else {
    localStorage.removeItem("token");
  }
}

function storeProfile(profile) {
  if (profile) {
    localStorage.setItem("profile", JSON.stringify(profile));
  } else {
    localStorage.removeItem("profile");
  }
}

// helper function for isTokenStillValid(token) and isRefreshTokenStillValid(token)
function parseUtcDateSafe(raw) {
  if (!raw) return null;

  const date = new Date(
    raw.endsWith("Z") || raw.includes("+") ? raw : raw + "+00:00",
  );

  if (isNaN(date.getTime())) {
    console.warn("Invalid token expiry or refresh token expiry date:", raw);
    return null;
  }

  return date;
}

function isTokenStillValid(token) {
  const expiresAt = parseUtcDateSafe(token?.access_token_valid_until);

  if (!expiresAt) return false;

  return expiresAt > new Date();
}

function isRefreshTokenStillValid(token) {
  const expiresAt = parseUtcDateSafe(token?.refresh_token_valid_until);

  if (!expiresAt) return false;

  return expiresAt > new Date();
}

export function ClientProvider({ children }) {
  const [token, setToken] = useState(readStoredToken);
  const [profile, setProfile] = useState(readStoredProfile);
  const [openApi, setOpenApi] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [logoutReason, setLogoutReason] = useState(null)

  async function login(email, password, rememberMe) {
    // call login endpoint
    // receive token
    // optionally strip refresh token if rememberMe is false
    // save token in state + localStorage
    // fetch profile
    // set logged in state

    const response = await fetch(
      process.env.REACT_APP_API + "user/login/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      },
    );

    const tokenData = await response.json();

    if (tokenData.status !== 200) {
      throw new Error(tokenData.message || "Login failed");
    }

    if (!rememberMe) {
      delete tokenData.refresh_token;
      delete tokenData.refresh_token_valid_until;
    }

    setToken(tokenData);
    storeToken(tokenData);

    const fetchedProfile = await loadProfile(tokenData);

    setIsLoggedIn(true);

    return {
      token: tokenData,
      profile: fetchedProfile,
    };
  }

  async function logout(reason = null) {
    // optionally call backend logout endpoint
    // clear token and profile from state
    // clear localStorage entries
    // mark user as logged out
    try {
      if (token?.access_token) {
        await fetch(process.env.REACT_APP_API + "user/logout", {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token.access_token,
          },
        });
      }
    } catch (error) {
      console.error("Logout request failed", error);
    }

    setToken(null);
    setProfile(null);
    setIsLoggedIn(false);
    setNotifications([]);

    storeToken(null);
    storeProfile(null);
    if (reason) {
      setLogoutReason(reason);
    }
  }

  async function loadProfile(currentToken = token) {
    if (!currentToken?.access_token) {
      setProfile(null);
      storeProfile(null);
      return null;
    }

    const response = await fetch(process.env.REACT_APP_API + "user/profile", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + currentToken.access_token,
      },
    });

    const data = await response.json();

    if (data?._account_status === "active") {
      setProfile(data);
      storeProfile(data);
      return data;
    }

    setProfile(null);
    storeProfile(null);
    return null;
  }

  async function refreshSession(currentToken = token) {
    // if access token still valid, no need to refresh
    // if expired but refresh token is valid, ask backend for new access token
    // save the new token
    // if refresh fails, log out

    if (!currentToken) {
      setIsLoggedIn(false);
      return null;
    }

    if (isTokenStillValid(currentToken)) {
      return currentToken;
    }

    if (
      !currentToken.refresh_token ||
      !isRefreshTokenStillValid(currentToken)
    ) {
      await logout("expired");
      return null;
    }

    const response = await fetch(
      process.env.REACT_APP_API + "user/login/refresh",
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + currentToken.refresh_token,
        },
      },
    );

    const refreshed_token = await response.json();

    if (refreshed_token?.status !== 200) {
      await logout("expired");
      return null;
    }

    const nextToken = {
      ...refreshed_token,
      refresh_token: currentToken.refresh_token,
      refresh_token_valid_until: currentToken.refresh_token_valid_until,
    };

    setToken(nextToken);
    storeToken(nextToken);

    return nextToken;
  }

  async function checkLoginStatus(currentToken = token) {
    // validate token
    // maybe refresh if needed
    // call /user/is_logged_in
    // update isLoggedIn

    let usableToken = currentToken;

    if (!usableToken) {
      setIsLoggedIn(false);
      return false;
    }

    if (!isTokenStillValid(usableToken)) {
      usableToken = await refreshSession(usableToken);
    }

    if (!usableToken?.access_token) {
      setIsLoggedIn(false);
      return false;
    }

    const response = await fetch(
      process.env.REACT_APP_API + "user/is_logged_in",
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + usableToken.access_token,
        },
      },
    );

    const data = await response.json();
    const ok = data?.status === 200;

    setIsLoggedIn(ok);

    if (!ok) {
      await logout("expired");
      return false;
    }

    return true;
  }

  async function clientFetch(path, options = {}) {
    // ensure session is valid first
    // attach Authorization header when token exists
    // call fetch with base API url + path
    // return response

    let usableToken = token;

    if (usableToken && !isTokenStillValid(usableToken)) {
      usableToken = await refreshSession(usableToken);
    }

    const headers = {
      ...(options.headers || {}),
    };

    if (usableToken?.access_token) {
      headers.Authorization = "Bearer " + usableToken.access_token;
    }

    return fetch(process.env.REACT_APP_API + path, {
      ...options,
      headers,
    });
  }

  async function loadOpenApi() {
    // fetch openapi.json
    // save in openApi state

    const response = await fetch(process.env.REACT_APP_API + "openapi.json");
    const data = await response.json();
    setOpenApi(data);
    return data;
  }

  // TODO: for now only reads from the endpoint notifications/all, there is also notifications/unread and notifications/dismiss
  async function loadNotifications() {
    // only if user is logged in
    // fetch notifications endpoint
    // save to notifications state

    if (!isLoggedIn) {
      setNotifications([]);
      return [];
    }

    const response = await clientFetch("notifications/all", {
      method: "GET",
    });

    const data = await response.json();
    setNotifications(Array.isArray(data) ? data : []);
    return data;
  }

  useEffect(() => {
    async function bootstrap() {
      // on app startup:
      // load openapi
      // restore token/profile from localStorage
      // check if session is still valid
      // maybe refresh token
      // maybe reload profile from server
      // finish loading

      try {
        setIsLoading(true);

        await loadOpenApi();

        const loggedIn = await checkLoginStatus(readStoredToken());

        if (loggedIn) {
          await loadProfile(readStoredToken());
        } else {
          setProfile(null);
          storeProfile(null);
          setNotifications([]);
        }
      } catch (error) {
        console.error("Bootstrap failed:", error);
      } finally {
        setIsLoading(false);
      }
    }

    bootstrap();
  }, []);

  useEffect(() => {
    // optional polling:
    // every few minutes, check login status
    // maybe also fetch notifications

    if (!token) return;

    let running = false;

    const intervalId = setInterval(
      async () => {
        if (running) return;
        running = true;

        try {
          const loggedIn = await checkLoginStatus();
          if (loggedIn) await loadNotifications();
        } finally {
          running = false;
        }
      },
      5 * 60 * 1000,
    );

    return () => clearInterval(intervalId);
  }, [token]);

  const value = {
    token,
    profile,
    openApi,
    isLoggedIn,
    isLoading,
    notifications,
    logoutReason,
    login,
    logout,
    refreshSession,
    loadProfile,
    clientFetch,
    checkLoginStatus,
    loadNotifications,
    setLogoutReason,
  };

  return (
    <ClientContext.Provider value={value}>{children}</ClientContext.Provider>
  );
}

export function useClient() {
  const context = useContext(ClientContext);

  if (!context) {
    throw new Error("useClient must be used inside ClientProvider");
  }

  return context;
}
