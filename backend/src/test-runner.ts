import http from 'http';

function request(options: http.RequestOptions, postData?: any): Promise<{ statusCode: number; data: any }> {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const json = body ? JSON.parse(body) : {};
          resolve({ statusCode: res.statusCode || 0, data: json });
        } catch {
          resolve({ statusCode: res.statusCode || 0, data: body });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('=== RUNNING BACKEND HEALTH & API ENDPOINT VERIFICATION ===');
  let failures = 0;

  const tests = [
    {
      name: '1. Health Probe (/health)',
      path: '/health',
      method: 'GET',
      validate: (r: any) => r.statusCode === 200 && r.data.status === 'UP' && r.data.checks?.database === 'CONNECTED',
    },
    {
      name: '2. Readiness Probe (/ready)',
      path: '/ready',
      method: 'GET',
      validate: (r: any) => r.statusCode === 200 && r.data === 'READY',
    },
    {
      name: '3. Hosting Packages Catalog (/api/packages)',
      path: '/api/packages',
      method: 'GET',
      validate: (r: any) => r.statusCode === 200 && r.data.success && Array.isArray(r.data.data) && r.data.data.length >= 3,
    },
    {
      name: '4. Domain Extensions & Pricing (/api/domains)',
      path: '/api/domains',
      method: 'GET',
      validate: (r: any) => r.statusCode === 200 && r.data.success && Array.isArray(r.data.data) && r.data.data.length >= 5,
    },
    {
      name: '5. Domain Availability Check (/api/domains/check)',
      path: '/api/domains/check',
      method: 'POST',
      payload: { domain: 'perusahaansaya', tld: '.id' },
      headers: { 'Content-Type': 'application/json' },
      validate: (r: any) => r.statusCode === 200 && r.data.success && r.data.data.available === true,
    },
    {
      name: '6. Payment Methods List (/api/payment-methods)',
      path: '/api/payment-methods',
      method: 'GET',
      validate: (r: any) => r.statusCode === 200 && r.data.success && Array.isArray(r.data.data) && r.data.data.length > 0,
    },
    {
      name: '7. Frequently Asked Questions (/api/faqs)',
      path: '/api/faqs',
      method: 'GET',
      validate: (r: any) => r.statusCode === 200 && r.data.success && Array.isArray(r.data.data) && r.data.data.length > 0,
    },
    {
      name: '8. Admin Dashboard Stats (/api/admin/stats)',
      path: '/api/admin/stats',
      method: 'GET',
      validate: (r: any) => r.statusCode === 200 && r.data.success && typeof r.data.data.total_orders === 'number',
    },
  ];

  for (const t of tests) {
    try {
      const res = await request(
        {
          hostname: '127.0.0.1',
          port: 5000,
          path: t.path,
          method: t.method,
          headers: t.headers,
        },
        t.payload
      );

      if (t.validate(res)) {
        console.log(`[PASS] ${t.name}`);
      } else {
        console.error(`[FAIL] ${t.name} -> Unexpected response:`, res);
        failures++;
      }
    } catch (err) {
      console.error(`[ERROR] ${t.name} ->`, err);
      failures++;
    }
  }

  if (failures > 0) {
    console.error(`\nFAILED: ${failures} test(s) failed.`);
    process.exit(1);
  } else {
    console.log('\nALL 8 TESTS PASSED! Backend is 100% operational.');
    process.exit(0);
  }
}

runTests();
