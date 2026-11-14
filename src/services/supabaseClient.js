/**
 * Erphan Alam Enterprises (EAP)
 * Supabase Client Integration Service
 * 
 * Provides direct connection to Supabase PostgreSQL REST, Auth & RPC endpoints
 * using standard native fetch API (zero additional package dependencies required).
 * 
 * Automatically activates when VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
 * are defined in .env.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Checks if Supabase credentials have been configured
 */
export const isSupabaseConfigured = () => {
  return Boolean(
    SUPABASE_URL && 
    SUPABASE_ANON_KEY && 
    !SUPABASE_URL.includes('your-project-id') &&
    !SUPABASE_ANON_KEY.includes('your-anon-key-here')
  );
};

export const getSupabaseConfig = () => ({
  url: SUPABASE_URL,
  isConfigured: isSupabaseConfigured()
});

/**
 * Session storage helpers
 */
export function getStoredSession() {
  try {
    const raw = localStorage.getItem('eap_supabase_session');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getStoredUser() {
  const session = getStoredSession();
  return session?.user || null;
}

export function isSessionValid() {
  const session = getStoredSession();
  if (!session || !session.access_token || !session.user) {
    return false;
  }
  if (session.expires_at) {
    const now = Math.floor(Date.now() / 1000);
    return session.expires_at > (now + 30);
  }
  return true;
}

export async function refreshSession() {
  const session = getStoredSession();
  if (!session?.refresh_token || !isSupabaseConfigured()) {
    return null;
  }

  const cleanUrl = SUPABASE_URL.replace(/\/$/, '');
  const url = `${cleanUrl}/auth/v1/token?grant_type=refresh_token`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refresh_token: session.refresh_token })
    });

    if (response.ok) {
      const data = await response.json();
      setStoredSession(data);
      return data;
    } else {
      setStoredSession(null);
      return null;
    }
  } catch (err) {
    console.warn('Session refresh error:', err);
    return null;
  }
}

export function setStoredSession(session) {
  if (session) {
    localStorage.setItem('eap_supabase_session', JSON.stringify(session));
  } else {
    localStorage.removeItem('eap_supabase_session');
    localStorage.removeItem('eap_admin_auth');
  }
}

// =============================================================================
// SUPABASE AUTHENTICATION API
// =============================================================================

/**
 * Sign in user with email and password via Supabase Auth
 */
export async function signInWithEmail(email, password) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Please add your credentials to the .env file.');
  }

  const cleanUrl = SUPABASE_URL.replace(/\/$/, '');
  const url = `${cleanUrl}/auth/v1/token?grant_type=password`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email.trim(), password })
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.error_description || data.msg || data.message || 'Invalid email or password';
      return { success: false, error: errorMessage };
    }

    setStoredSession(data);
    return { success: true, user: data.user, session: data };
  } catch (err) {
    return { success: false, error: err.message || 'Network error connecting to Supabase Auth' };
  }
}

/**
 * Create a new user with email and password via Supabase Auth
 */
export async function signUpWithEmail(email, password) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured.');
  }

  const cleanUrl = SUPABASE_URL.replace(/\/$/, '');
  const url = `${cleanUrl}/auth/v1/signup`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email.trim(), password })
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.error_description || data.msg || data.message || 'Registration failed';
      return { success: false, error: errorMessage };
    }

    if (data.session) {
      setStoredSession(data.session);
    }

    return { 
      success: true, 
      user: data.user, 
      requiresConfirmation: !data.session 
    };
  } catch (err) {
    return { success: false, error: err.message || 'Network error registering user' };
  }
}

/**
 * Sign out current user
 */
export async function signOut() {
  const session = getStoredSession();
  if (isSupabaseConfigured() && session?.access_token) {
    try {
      const cleanUrl = SUPABASE_URL.replace(/\/$/, '');
      await fetch(`${cleanUrl}/auth/v1/logout`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${session.access_token}`
        }
      });
    } catch {
      // Continue cleanup locally even if network fails
    }
  }
  setStoredSession(null);
  return { success: true };
}

// =============================================================================
// LOW-LEVEL HTTP REQUESTERS
// =============================================================================

/**
 * Low-level HTTP requester to Supabase PostgREST endpoints
 */
async function supabaseRequest(endpoint, { method = 'GET', body = null, headers = {} } = {}) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
  }

  const cleanUrl = SUPABASE_URL.replace(/\/$/, '');
  const url = `${cleanUrl}/rest/v1/${endpoint.replace(/^\//, '')}`;
  
  // Use authenticated user's token if available, otherwise anon key
  const session = getStoredSession();
  const bearerToken = session?.access_token || SUPABASE_ANON_KEY;

  const reqHeaders = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${bearerToken}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
    ...headers
  };

  const response = await fetch(url, {
    method,
    headers: reqHeaders,
    body: body ? JSON.stringify(body) : undefined
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase API error (${response.status}): ${errorText}`);
  }

  if (response.status === 204) {
    return null;
  }

  return await response.json();
}

/**
 * Call a Supabase Stored Procedure (RPC)
 */
async function supabaseRpc(functionName, params = {}) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured.');
  }

  const cleanUrl = SUPABASE_URL.replace(/\/$/, '');
  const url = `${cleanUrl}/rest/v1/rpc/${functionName}`;
  const session = getStoredSession();
  const bearerToken = session?.access_token || SUPABASE_ANON_KEY;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${bearerToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase RPC error (${response.status}): ${errorText}`);
  }

  return await response.json();
}

// =============================================================================
// APP SETTINGS API
// =============================================================================

export async function fetchAppSettings() {
  const data = await supabaseRequest('app_settings?select=*&limit=1');
  return data?.[0] || null;
}

export async function updateAppSettings(id, updates) {
  const data = await supabaseRequest(`app_settings?id=eq.${id}`, {
    method: 'PATCH',
    body: updates
  });
  return data?.[0];
}

// =============================================================================
// DIVISIONS CMS API
// =============================================================================

export async function fetchDivisions() {
  return await supabaseRequest('divisions?select=*&order=number.asc');
}

export async function updateDivision(id, updates) {
  const data = await supabaseRequest(`divisions?id=eq.${id}`, {
    method: 'PATCH',
    body: updates
  });
  return data?.[0];
}

// =============================================================================
// INQUIRIES & RFPS API
// =============================================================================

export async function fetchInquiries() {
  return await supabaseRequest('inquiries?select=*&order=created_at.desc');
}

export async function createInquiry(lead) {
  const data = await supabaseRequest('inquiries', {
    method: 'POST',
    body: lead
  });
  return data?.[0];
}

export async function updateInquiry(id, updates) {
  const data = await supabaseRequest(`inquiries?id=eq.${id}`, {
    method: 'PATCH',
    body: updates
  });
  return data?.[0];
}

export async function deleteInquiry(id) {
  await supabaseRequest(`inquiries?id=eq.${id}`, {
    method: 'DELETE'
  });
  return true;
}

// =============================================================================
// INVOICES & QUOTATIONS API
// =============================================================================

export async function fetchInvoices() {
  return await supabaseRequest('invoices?select=*&order=date.desc');
}

export async function createInvoice(invoice) {
  const data = await supabaseRequest('invoices', {
    method: 'POST',
    body: invoice
  });
  return data?.[0];
}

export async function updateInvoice(id, updates) {
  const data = await supabaseRequest(`invoices?id=eq.${id}`, {
    method: 'PATCH',
    body: updates
  });
  return data?.[0];
}

export async function deleteInvoice(id) {
  await supabaseRequest(`invoices?id=eq.${id}`, {
    method: 'DELETE'
  });
  return true;
}

// =============================================================================
// MANPOWER ATTENDANCE RECORDS API
// =============================================================================

export async function fetchAttendanceRecords() {
  return await supabaseRequest('attendance_records?select=*&order=date_created.desc');
}

export async function createAttendanceRecord(record) {
  const data = await supabaseRequest('attendance_records', {
    method: 'POST',
    body: record
  });
  return data?.[0];
}

export async function updateAttendanceRecord(id, updates) {
  const data = await supabaseRequest(`attendance_records?id=eq.${id}`, {
    method: 'PATCH',
    body: updates
  });
  return data?.[0];
}

export async function deleteAttendanceRecord(id) {
  await supabaseRequest(`attendance_records?id=eq.${id}`, {
    method: 'DELETE'
  });
  return true;
}

/**
 * Atomic 1-Click Attendance to Tax Invoice Conversion via Supabase Stored Procedure
 */
export async function convertAttendanceToInvoice(attendanceId, taxRate = 18.0) {
  return await supabaseRpc('convert_attendance_to_invoice', {
    p_attendance_id: attendanceId,
    p_tax_rate: taxRate
  });
}

// =============================================================================
// INVENTORY METRICS API
// =============================================================================

export async function fetchInventoryMetrics() {
  const rows = await supabaseRequest('inventory_metrics?select=*');
  const inventory = {};
  rows.forEach((row) => {
    inventory[row.section] = row.metrics;
  });
  return inventory;
}

export async function updateInventoryMetricSection(section, metrics) {
  const data = await supabaseRequest(`inventory_metrics?section=eq.${section}`, {
    method: 'PATCH',
    body: { metrics, updated_at: new Date().toISOString() }
  });
  return data?.[0];
}

// =============================================================================
// DASHBOARD KPIS ANALYTICAL VIEW
// =============================================================================

export async function fetchDashboardKpis() {
  const data = await supabaseRequest('v_dashboard_kpis?select=*&limit=1');
  return data?.[0] || null;
}
