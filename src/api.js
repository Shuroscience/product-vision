const ticketCache = {};

export async function loadFromCloud() {
  try {
    const res = await fetch('/api/jsonbin');
    if (!res.ok) throw new Error(`API read: ${res.status}`);
    const data = await res.json();
    return data || {};
  } catch (err) {
    console.error('Cloud load failed:', err);
    return null;
  }
}

export async function saveToCloud(payload) {
  try {
    const res = await fetch('/api/jsonbin', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch (err) {
    console.error('Cloud save failed:', err);
    return false;
  }
}

export async function fetchLinearTicket(ticketId) {
  if (ticketCache[ticketId]) return ticketCache[ticketId];

  const fallback = {
    id: ticketId,
    title: null,
    url: `https://linear.app/nextsense/issue/${ticketId}`,
  };

  try {
    const res = await fetch(`/api/linear?ticket=${encodeURIComponent(ticketId)}`);
    if (!res.ok) throw new Error(`Linear API: ${res.status}`);
    const data = await res.json();
    const result = {
      id: ticketId,
      title: data.title || null,
      url: data.url || fallback.url,
    };
    ticketCache[ticketId] = result;
    return result;
  } catch (err) {
    console.error(`Linear fetch failed for ${ticketId}:`, err);
    ticketCache[ticketId] = fallback;
    return fallback;
  }
}
