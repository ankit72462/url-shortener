function getApiBase() {
  if (typeof window !== "undefined") return "";
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
}

// Auth helpers
export function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

export function setToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
}

export function removeToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}

export function getAuthHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Types
export interface ShortenResponse {
  short_code: string;
  short_url: string;
  long_url: string;
  created_at: string;
  is_active?: boolean;
}

export interface User {
  id: number;
  email: string;
  is_active: boolean;
  is_admin: boolean;
}

export interface Link {
  id: number;
  short_code: string;
  long_url: string;
  is_active: boolean;
  clicks: number;
  created_at: string;
  short_url?: string;
  has_password?: boolean;
}

// API functions
export async function shortenUrl(longUrl: string, customAlias?: string, password?: string): Promise<ShortenResponse> {
  const body: any = { long_url: longUrl };
  if (customAlias) {
    body.custom_alias = customAlias;
  }
  if (password) {
    body.password = password;
  }
  
  const res = await fetch(`${getApiBase()}/api/v1/links`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to shorten URL");
  }

  return res.json();
}

export async function login(email: string, password: string): Promise<{ access_token: string }> {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const res = await fetch(`${getApiBase()}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Login failed");
  }

  const data = await res.json();
  setToken(data.access_token);
  return data;
}

export async function unlockLink(shortCode: string, password: string): Promise<{ long_url: string }> {
  const res = await fetch(`${getApiBase()}/api/v1/links/${shortCode}/unlock`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to unlock link");
  }

  return res.json();
}

export async function signup(
  username: string,
  email: string, 
  password: string, 
  firstName?: string, 
  lastName?: string, 
  mobileNumber?: string
): Promise<User> {
  const res = await fetch(`${getApiBase()}/api/v1/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 
      username, 
      email, 
      password, 
      first_name: firstName, 
      last_name: lastName, 
      mobile_number: mobileNumber 
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Signup failed");
  }

  return res.json();
}

export async function getMe(): Promise<User> {
  const res = await fetch(`${getApiBase()}/api/v1/auth/me`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    removeToken();
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Not authenticated");
  }

  return res.json();
}

export async function listUserLinks(): Promise<Link[]> {
  const res = await fetch(`${getApiBase()}/api/v1/links`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to fetch links");
  }

  return res.json();
}

export async function updateLink(shortCode: string, isActive: boolean): Promise<Link> {
  const res = await fetch(`${getApiBase()}/api/v1/links/${shortCode}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ is_active: isActive }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to update link");
  }

  return res.json();
}

export async function deleteLink(shortCode: string): Promise<void> {
  const res = await fetch(`${getApiBase()}/api/v1/links/${shortCode}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to delete link");
  }
}

export interface AnalyticsData {
  total_clicks: number;
  clicks_by_date: Array<{ date: string; count: number }>;
  browsers: Record<string, number>;
  os: Record<string, number>;
  devices: Record<string, number>;
  referrers: Record<string, number>;
}

export async function getAnalytics(shortCode: string): Promise<AnalyticsData> {
  const res = await fetch(`${getApiBase()}/api/v1/links/${shortCode}/analytics`, {
    method: "GET",
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to fetch analytics");
  }

  return res.json();
}

export async function checkHealth() {
  const res = await fetch(`${getApiBase()}/api/v1/health`);
  return res.json();
}

export interface LogEntry {
  id: number;
  user_id: number | null;
  action?: string;
  error_type?: string;
  details: any;
  ip_address: string;
  created_at: string;
}

export async function getActivityLogs(): Promise<LogEntry[]> {
  const res = await fetch(`${getApiBase()}/api/v1/admin/logs/activity`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch activity logs");
  return res.json();
}

export async function getFailureLogs(): Promise<LogEntry[]> {
  const res = await fetch(`${getApiBase()}/api/v1/admin/logs/failures`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch failure logs");
  return res.json();
}
