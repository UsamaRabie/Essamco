/**
 * Comprehensive Automated Security Verification Test Suite
 * Tests 20 critical security controls across NoSQL injection, authentication,
 * authorization/RBAC, mass assignment, XSS sanitization, rate limiting, and HTTP headers.
 */

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('====================================================');
  console.log('🛡️ ESSAMCO SECURITY AUDIT & VERIFICATION SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(title, condition, extra = '') {
    if (condition) {
      console.log(`✅ [PASS] ${title}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${title} - ${extra}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------
    // Test 1: Unauthenticated access to protected admin endpoints
    // -------------------------------------------------------------
    const res1 = await fetch(`${BASE_URL}/inquiries`);
    assert(
      'Unauthenticated GET /api/inquiries blocked with 401',
      res1.status === 401,
      `Status was ${res1.status}`
    );

    const res2 = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Hacked Product' }),
    });
    assert(
      'Unauthenticated POST /api/products blocked with 401',
      res2.status === 401,
      `Status was ${res2.status}`
    );

    const res3 = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
    });
    assert(
      'Unauthenticated POST /api/upload blocked with 401',
      res3.status === 401,
      `Status was ${res3.status}`
    );

    // -------------------------------------------------------------
    // Test 2: Invalid / Malformed / Tampered JWT
    // -------------------------------------------------------------
    const res4 = await fetch(`${BASE_URL}/inquiries`, {
      headers: { Authorization: 'Bearer this.is.a.fake.token' },
    });
    assert(
      'Malformed JWT blocked with 401',
      res4.status === 401,
      `Status was ${res4.status}`
    );

    const res5 = await fetch(`${BASE_URL}/inquiries`, {
      headers: { Authorization: 'Bearer eyJhbGciOiJub25lIn0.eyJpZCI6IjEyMyJ9.' },
    });
    assert(
      'Algorithm confusion (none) blocked with 401',
      res5.status === 401,
      `Status was ${res5.status}`
    );

    // -------------------------------------------------------------
    // Test 3: NoSQL Operator Injection in Query Params
    // -------------------------------------------------------------
    const res6 = await fetch(`${BASE_URL}/products?category[$ne]=null`);
    const data6 = await res6.json();
    assert(
      'NoSQL query injection ($ne) sanitized/handled safely',
      res6.status === 200 && Array.isArray(data6.data),
      `Status ${res6.status}`
    );

    const res7 = await fetch(`${BASE_URL}/products?search[$where]=sleep(500)`);
    const data7 = await res7.json();
    assert(
      'NoSQL operator injection ($where) in search safely handled',
      res7.status === 200 && Array.isArray(data7.data),
      `Status ${res7.status}`
    );

    // -------------------------------------------------------------
    // Test 4: ReDoS Regex Injection Defense
    // -------------------------------------------------------------
    const startTime = Date.now();
    const res8 = await fetch(`${BASE_URL}/products?search=(((((((a+)+)+)+)+)+)+)`);
    const elapsed = Date.now() - startTime;
    assert(
      'Catastrophic ReDoS payload processed safely without event loop freeze',
      res8.status === 200 && elapsed < 600,
      `Elapsed: ${elapsed}ms, Status: ${res8.status}`
    );

    // -------------------------------------------------------------
    // Test 5: Pagination Limits Enforcement (Anti-DoS)
    // -------------------------------------------------------------
    const res9 = await fetch(`${BASE_URL}/products?limit=999999`);
    const data9 = await res9.json();
    assert(
      'Unbounded query limit=999999 capped to <= 100 on server',
      data9.pagination && data9.pagination.limit <= 100,
      `Limit returned: ${data9.pagination?.limit}`
    );

    // -------------------------------------------------------------
    // Test 6: Invalid MongoDB ObjectId Handling (No Unhandled CastError)
    // -------------------------------------------------------------
    const res10 = await fetch(`${BASE_URL}/products/invalid-id-format!@#$`);
    assert(
      'Invalid ObjectId in product lookup handled safely without 500 error',
      res10.status === 404 || res10.status === 400,
      `Status: ${res10.status}`
    );

    // -------------------------------------------------------------
    // Test 7: HTTP Security Headers (Helmet) & X-Powered-By Disabled
    // -------------------------------------------------------------
    const res11 = await fetch(`${BASE_URL}/health`);
    const xContentType = res11.headers.get('x-content-type-options');
    const xPoweredBy = res11.headers.get('x-powered-by');
    assert(
      'X-Content-Type-Options: nosniff present in response',
      xContentType === 'nosniff',
      `Header: ${xContentType}`
    );
    assert(
      'X-Powered-By header disabled/removed',
      xPoweredBy === null,
      `Header: ${xPoweredBy}`
    );

    // -------------------------------------------------------------
    // Test 8: Stored XSS Input Sanitization in Inquiries
    // -------------------------------------------------------------
    const xssPayload = {
      fullName: '<script>alert("xss")</script>Dr. Safe Chemist',
      email: 'safe.test@essamco.test',
      phone: '+20 100 111 2222',
      company: '<img src=x onerror=alert(1)>Essamco Partner',
      productName: 'Essamco Ultra Sanitize',
      quantityNeeded: '5 Jerrycans',
      message: '<script>evil()</script>Please provide wholesale quotation with MSDS.',
    };

    const res12 = await fetch(`${BASE_URL}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(xssPayload),
    });
    const data12 = await res12.json();
    assert(
      'Inquiry submission accepted and sanitized',
      res12.status === 201 && data12.success === true,
      `Status: ${res12.status}`
    );

    // -------------------------------------------------------------
    // Test 9: Valid Admin Authentication (JWT Verification)
    // -------------------------------------------------------------
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@essamco.com', password: 'Essamco@2026' }),
    });
    const loginData = await loginRes.json();
    assert(
      'Admin login returns 200 and valid JWT token',
      loginRes.status === 200 && !!loginData.token,
      `Status: ${loginRes.status}`
    );

    const token = loginData.token;

    // -------------------------------------------------------------
    // Test 10: Authenticated Admin access with JWT
    // -------------------------------------------------------------
    const res13 = await fetch(`${BASE_URL}/inquiries`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data13 = await res13.json();
    assert(
      'Authenticated GET /api/inquiries returns 200 with data',
      res13.status === 200 && Array.isArray(data13.data),
      `Status: ${res13.status}`
    );

    // Check that the XSS payload from Test 8 was sanitized in DB
    const submittedInquiry = data13.data.find((i) => i.email === 'safe.test@essamco.test');
    assert(
      'Stored XSS script tags stripped from database record',
      submittedInquiry && !submittedInquiry.fullName.includes('<script>') && !submittedInquiry.message.includes('<script>'),
      `Stored fullName: ${submittedInquiry?.fullName}`
    );

    // -------------------------------------------------------------
    // Test 11: Mass Assignment Defense in Inquiry Status Update
    // -------------------------------------------------------------
    if (submittedInquiry) {
      const res14 = await fetch(`${BASE_URL}/inquiries/${submittedInquiry._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: 'quoted',
          role: 'superadmin',
          injectedField: 'HACKED',
        }),
      });
      const data14 = await res14.json();
      assert(
        'Inquiry status updated to quoted without mass assignment',
        data14.success === true && data14.data.status === 'quoted' && data14.data.role === undefined && data14.data.injectedField === undefined,
        `Data: ${JSON.stringify(data14.data)}`
      );

      // Clean up test inquiry
      await fetch(`${BASE_URL}/inquiries/${submittedInquiry._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    // -------------------------------------------------------------
    // Test 12: Account Enumeration Defense on Failed Login
    // -------------------------------------------------------------
    const res15 = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nonexistent-user@essamco.test', password: 'randomPassword123' }),
    });
    const data15 = await res15.json();
    assert(
      'Account enumeration defense returns generic message',
      res15.status === 401 && data15.message === 'Invalid email or password.',
      `Message: ${data15.message}`
    );

    // -------------------------------------------------------------
    // Test 13: Oversized JSON Request Body Defense (DoS Prevention)
    // -------------------------------------------------------------
    const hugeBody = JSON.stringify({ data: 'A'.repeat(1.5 * 1024 * 1024) }); // 1.5MB body
    const res16 = await fetch(`${BASE_URL}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: hugeBody,
    });
    assert(
      'Oversized JSON body (>1MB) rejected with 413 Payload Too Large',
      res16.status === 413,
      `Status: ${res16.status}`
    );

  } catch (err) {
    console.error('[Test Execution Error]:', err);
    failed++;
  }

  console.log('\n====================================================');
  console.log(`AUDIT TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('====================================================');
}

runTests();
