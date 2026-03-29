/* =============================================
   SUPABASE CLIENT — Trini Carnival Rentals
   ============================================= */

const SUPABASE_URL = 'https://woppniakmwiwwrrlmdzy.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvcHBuaWFrbXdpd3dycmxtZHp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MDM5MjMsImV4cCI6MjA5MDM3OTkyM30.wWp9b3ucbQH7WgAIvBtbEPCMqtaETeitqklUGzFSwP8';

// Lightweight Supabase REST helper (no SDK needed — pure fetch)
const supabase = {
  from(table) {
    let url = `${SUPABASE_URL}/rest/v1/${table}`;
    let headers = {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };
    
    return {
      // SELECT
      async select(columns = '*') {
        const params = new URLSearchParams({ select: columns });
        const res = await fetch(`${url}?${params}`, { headers });
        if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
        return { data: await res.json(), error: null };
      },

      // SELECT with filters
      async selectWhere(column, value, columns = '*') {
        const params = new URLSearchParams({ select: columns });
        params.append(column, `eq.${value}`);
        const res = await fetch(`${url}?${params}`, { headers });
        if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
        return { data: await res.json(), error: null };
      },

      // SELECT with ordering
      async selectOrdered(columns = '*', orderCol = 'createdAt', ascending = false) {
        const params = new URLSearchParams({ select: columns, order: `${orderCol}.${ascending ? 'asc' : 'desc'}` });
        const res = await fetch(`${url}?${params}`, { headers });
        if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
        return { data: await res.json(), error: null };
      },

      // INSERT
      async insert(body) {
        const res = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
        return { data: await res.json(), error: null };
      },

      // UPDATE with filter
      async update(body, column, value) {
        const params = new URLSearchParams();
        params.append(column, `eq.${value}`);
        const res = await fetch(`${url}?${params}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify(body)
        });
        if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
        return { data: await res.json(), error: null };
      },

      // COUNT via HEAD
      async count(column, value) {
        const h = { ...headers, 'Prefer': 'count=exact', 'Range-Unit': 'items', 'Range': '0-0' };
        let fetchUrl = url;
        if (column && value !== undefined) {
          const params = new URLSearchParams();
          params.append(column, `eq.${value}`);
          fetchUrl = `${url}?${params}`;
        }
        const res = await fetch(fetchUrl, { method: 'HEAD', headers: h });
        const range = res.headers.get('content-range');
        if (range) {
          const total = range.split('/')[1];
          return parseInt(total, 10) || 0;
        }
        return 0;
      }
    };
  }
};
