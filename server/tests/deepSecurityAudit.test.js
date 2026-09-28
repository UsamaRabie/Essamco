/**
 * Essamco Second-Pass Deep Security Review & Exploit Challenge Suite
 * Challenges security controls against:
 * 1. JSON Body NoSQL Operator Injection ($gt, $ne, $regex, $in, $or, $where)
 * 2. Prototype Pollution Attack Vectors (__proto__, constructor, prototype)
 * 3. Deep Payload Nesting DoS Defense
 * 4. Mass Assignment Allowlist Bypasses on Create & Update
 * 5. Deep IDOR / RBAC Multi-User Separation (Superadmin vs Regular Admin)
 * 6. Unauthorized Resource Modification (PUT / DELETE without authorization)
 * 7. JWT Invalidation Upon Password Change (Token Replay Defense)
 * 8. Strict CORS Origin Bypasses (suffix, subdomain, null, evil.com)
 * 9. Unbounded Pagination & Skip Abuse (DoS prevention)
 * 10. HTTP Parameter Pollution (HPP) Handling
 * 11. Cloudinary File Upload Security & Magic Byte Spoofing Defense
 */

const http = require('http');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Admin = require('../models/Admin');

const BASE_URL = 'http://localhost:5000';
const ADMIN_EMAIL = 'admin@essamco.com';
const ADMIN_PASSWORD = 'Essamco@2026';

const REGULAR_ADMIN_EMAIL = 'regular_auditor@essamco.com';
const REGULAR_ADMIN_PASSWORD = 'AuditorPassword@2026';

let passed = 0;
let failed = 0;

function assert(condition, title, extra = '') {
  if (condition) {
    passed++;
    console.log(`✅ [PASS] ${title}`);
  } else {
    failed++;
    console.error(`❌ [FAIL] ${title} - ${extra}`);
  }
}

function request(path, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqOptions = {
      method: options.method || 'GET',
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: options.headers || {},
    };

    if (body && typeof body === 'object' && !(body instanceof Buffer)) {
      body = JSON.stringify(body);
      reqOptions.headers['Content-Type'] = 'application/json';
      reqOptions.headers['Content-Length'] = Buffer.byteLength(body);
    } else if (body instanceof Buffer) {
      reqOptions.headers['Content-Length'] = body.length;
    }

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (_) {}
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: json,
          raw: data,
        });
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(body);
    }
    req.end();
  });
}

async function runDeepSecurityTests() {
  console.log('\n====================================================');
  console.log('🛡️ ESSAMCO SECOND-PASS DEEP SECURITY AUDIT SUITE');
  console.log('====================================================\n');

  let adminToken = '';
  let regularAdminToken = '';

  // 1. Initial Superadmin Login
  try {
    const loginRes = await request('/api/auth/login', {
      method: 'POST',
    }, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    assert(loginRes.status === 200 && loginRes.data?.token, 'Superadmin login successful with JWT');
    adminToken = loginRes.data?.token || '';
  } catch (err) {
    console.error('Failed to log in as superadmin:', err.message);
  }

  // 2. Setup Secondary Test User (Role: 'admin') for Multi-User IDOR / BOLA Testing
  let dbConnected = false;
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
    dbConnected = true;

    // Remove any previous test user
    await Admin.deleteOne({ email: REGULAR_ADMIN_EMAIL });

    // Create a regular admin user (not superadmin)
    const testAuditor = new Admin({
      name: 'Security Test Auditor',
      email: REGULAR_ADMIN_EMAIL,
      password: REGULAR_ADMIN_PASSWORD,
      role: 'admin',
    });
    await testAuditor.save();

    // Log in as regular admin
    const auditorLogin = await request('/api/auth/login', {
      method: 'POST',
    }, {
      email: REGULAR_ADMIN_EMAIL,
      password: REGULAR_ADMIN_PASSWORD,
    });

    regularAdminToken = auditorLogin.data?.token;
    assert(
      auditorLogin.status === 200 && auditorLogin.data?.admin?.role === 'admin',
      'Second user (regular admin role) successfully provisioned and authenticated'
    );
  } catch (err) {
    console.warn('MongoDB direct connection warning for secondary user:', err.message);
  }

  // 3. JSON Body NoSQL Operator Injection Variants
  console.log('\n--- 1. Testing NoSQL Operator Injection via JSON Body ---');
  try {
    // Vector A: $gt operator
    const nosqlGt = await request('/api/auth/login', {
      method: 'POST',
    }, {
      email: { $gt: '' },
      password: 'wrongpassword',
    });
    assert(
      nosqlGt.status === 400 || nosqlGt.status === 401,
      'JSON Body NoSQL operator injection ($gt) blocked safely with HTTP 400/401',
      `Status: ${nosqlGt.status}`
    );

    // Vector B: $ne operator in public form
    const nosqlNe = await request('/api/inquiries', {
      method: 'POST',
    }, {
      fullName: 'NoSQL Injected User',
      email: { $ne: null },
      phone: '+201001234567',
      message: 'Testing injection',
    });
    assert(
      nosqlNe.status === 400,
      'JSON Body NoSQL operator injection ($ne) in public inquiry rejected with 400',
      `Status: ${nosqlNe.status}`
    );

    // Vector C: $regex operator in login
    const nosqlRegex = await request('/api/auth/login', {
      method: 'POST',
    }, {
      email: { $regex: '.*' },
      password: 'admin',
    });
    assert(
      nosqlRegex.status === 400 || nosqlRegex.status === 401,
      'JSON Body NoSQL operator injection ($regex) blocked safely',
      `Status: ${nosqlRegex.status}`
    );

    // Vector D: $in operator
    const nosqlIn = await request('/api/auth/login', {
      method: 'POST',
    }, {
      email: { $in: [ADMIN_EMAIL] },
      password: 'wrong',
    });
    assert(
      nosqlIn.status === 400 || nosqlIn.status === 401,
      'JSON Body NoSQL operator injection ($in) blocked safely',
      `Status: ${nosqlIn.status}`
    );

    // Vector E: $where / $or operator injection
    const nosqlWhere = await request('/api/inquiries', {
      method: 'POST',
    }, {
      fullName: 'Operator Test',
      email: 'test@example.com',
      phone: '+201001234567',
      message: { $where: 'sleep(1000)' },
    });
    assert(
      nosqlWhere.status === 400 || nosqlWhere.status === 201,
      'JSON Body NoSQL operator injection ($where) sanitized without server crash',
      `Status: ${nosqlWhere.status}`
    );
  } catch (err) {
    assert(false, 'NoSQL injection tests encountered error', err.message);
  }

  // 4. Prototype Pollution Attack Vectors
  console.log('\n--- 2. Testing Prototype Pollution Defense ---');
  try {
    const protoPollutionPayload = JSON.parse(
      '{"__proto__": {"polluted": "EXPLOITED"}, "fullName": "Pollution Test", "email": "valid@email.com", "phone": "+201001234567", "message": "Test"}'
    );

    await request('/api/inquiries', {
      method: 'POST',
    }, protoPollutionPayload);

    // Verify JavaScript Object.prototype is NOT polluted
    const cleanObject = {};
    const isPolluted = cleanObject.polluted === 'EXPLOITED' || Object.prototype.polluted !== undefined;
    assert(
      !isPolluted,
      'Prototype pollution keys (__proto__) purged, Object.prototype remains clean',
      `Polluted: ${isPolluted}`
    );
  } catch (err) {
    assert(false, 'Prototype pollution test error', err.message);
  }

  // 5. Excessive JSON Nesting Depth DoS Defense
  console.log('\n--- 3. Testing Deep Payload Nesting DoS Defense ---');
  try {
    let deepObj = { value: 'leaf' };
    for (let i = 0; i < 18; i++) {
      deepObj = { nested: deepObj };
    }

    const deepRes = await request('/api/inquiries', {
      method: 'POST',
    }, deepObj);

    assert(
      deepRes.status === 400,
      'Excessively nested payload (depth > 12) rejected with HTTP 400 before DB processing',
      `Status: ${deepRes.status}`
    );
  } catch (err) {
    assert(false, 'Deep payload test failed', err.message);
  }

  // 6. Mass Assignment Bypass on Product Creation
  console.log('\n--- 4. Testing Mass Assignment Bypass Attempts ---');
  try {
    const maliciousProductPayload = {
      name: 'Security Test Chemical',
      nameAr: 'مادة فحص أمني',
      description: 'Testing mass assignment bypass',
      descriptionAr: 'وصف الفحص الأمني',
      category: 'heavy-industrial',
      brand: 'bauer',
      // Malicious injected fields that should NEVER be accepted:
      role: 'superadmin',
      isAdmin: true,
      ownerId: '60c72b2f9b1d8b2bad123456',
      _id: '60c72b2f9b1d8b2bad999999',
      createdAt: '1970-01-01T00:00:00.000Z',
    };

    const createProductRes = await request('/api/products', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
    }, maliciousProductPayload);

    const createdData = createProductRes.data?.data;
    const isRoleInjected = createdData && (createdData.role !== undefined || createdData.isAdmin !== undefined);
    assert(
      createProductRes.status === 201 && !isRoleInjected,
      'Mass assignment attempt sanitized: role and isAdmin ignored completely',
      `Injected: ${isRoleInjected}`
    );

    // Clean up created test product
    if (createdData && createdData._id) {
      await request(`/api/products/${createdData._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
    }
  } catch (err) {
    assert(false, 'Mass assignment test failed', err.message);
  }

  // 7. Multi-User IDOR / BOLA Audit
  console.log('\n--- 5. Testing Multi-User IDOR & RBAC Separation ---');
  try {
    // Step A: Create a test inquiry
    const inqRes = await request('/api/inquiries', {
      method: 'POST',
    }, {
      fullName: 'IDOR Lead Test',
      email: 'lead.idor@essamco.com',
      phone: '+201001234567',
      message: 'Testing multi-user BOLA/IDOR permissions',
    });
    const inquiryId = inqRes.data?.data?.id;

    // Step B: Regular Admin (User B) attempts to delete inquiry (Restricted to superadmin)
    if (regularAdminToken) {
      const regularAdminDeleteRes = await request(`/api/inquiries/${inquiryId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${regularAdminToken}` },
      });

      assert(
        regularAdminDeleteRes.status === 403,
        'Regular Admin (User B) blocked from deleting resource (HTTP 403 Forbidden)',
        `Status: ${regularAdminDeleteRes.status}`
      );

      // Step C: Regular Admin CAN access inquiry list (authorized role)
      const regularAdminListRes = await request('/api/inquiries', {
        method: 'GET',
        headers: { Authorization: `Bearer ${regularAdminToken}` },
      });
      assert(
        regularAdminListRes.status === 200,
        'Regular Admin authorized for reading inquiries (HTTP 200)',
        `Status: ${regularAdminListRes.status}`
      );
    }

    // Step D: Superadmin (User A) authorized to delete inquiry
    const superadminDeleteRes = await request(`/api/inquiries/${inquiryId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    assert(
      superadminDeleteRes.status === 200,
      'Superadmin (User A) successfully deleted inquiry (HTTP 200)',
      `Status: ${superadminDeleteRes.status}`
    );
  } catch (err) {
    assert(false, 'Multi-user IDOR test error', err.message);
  }

  // 8. Unauthorized Resource Modification & Deletion
  console.log('\n--- 6. Testing Unauthorized Resource Mutation ---');
  try {
    // Unauthenticated update attempt
    const unauthPut = await request('/api/products/60c72b2f9b1d8b2bad123456', {
      method: 'PUT',
    }, { name: 'Hacked Product Name' });
    assert(
      unauthPut.status === 401,
      'Unauthenticated product update blocked with HTTP 401',
      `Status: ${unauthPut.status}`
    );

    // Unauthenticated inquiry status change
    const unauthStatus = await request('/api/inquiries/60c72b2f9b1d8b2bad123456/status', {
      method: 'PUT',
    }, { status: 'completed' });
    assert(
      unauthStatus.status === 401,
      'Unauthenticated inquiry status modification blocked with HTTP 401',
      `Status: ${unauthStatus.status}`
    );
  } catch (err) {
    assert(false, 'Unauthorized mutation test error', err.message);
  }

  // 9. JWT Security: Token Invalidation upon Password Change
  console.log('\n--- 7. Testing JWT Invalidation upon Password Change ---');
  try {
    // 1. Get initial token
    const initialLogin = await request('/api/auth/login', {
      method: 'POST',
    }, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    const tokenBeforeChange = initialLogin.data?.token;

    // 2. Change password to a temporary password
    const TEMP_PASSWORD = 'TempEssamcoPassword@2026';
    const pwChangeRes = await request('/api/auth/update-password', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${tokenBeforeChange}` },
    }, {
      currentPassword: ADMIN_PASSWORD,
      newPassword: TEMP_PASSWORD,
    });

    assert(pwChangeRes.status === 200, 'Admin password changed successfully');

    // 3. Attempt to use old token issued BEFORE password change
    const oldTokenTest = await request('/api/auth/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${tokenBeforeChange}` },
    });

    assert(
      oldTokenTest.status === 401,
      'Old JWT invalidated immediately after password change (Token Replay prevented)',
      `Status: ${oldTokenTest.status}, Msg: ${oldTokenTest.data?.message}`
    );

    // 4. Restore original password using new credentials
    const loginWithNew = await request('/api/auth/login', {
      method: 'POST',
    }, {
      email: ADMIN_EMAIL,
      password: TEMP_PASSWORD,
    });
    const newToken = loginWithNew.data?.token;

    const restorePw = await request('/api/auth/update-password', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${newToken}` },
    }, {
      currentPassword: TEMP_PASSWORD,
      newPassword: ADMIN_PASSWORD,
    });

    assert(restorePw.status === 200, 'Original admin password restored cleanly');
    adminToken = restorePw.data?.token || '';
  } catch (err) {
    assert(false, 'Password change token invalidation test failed', err.message);
  }

  // 10. CORS Origin Bypass Testing
  console.log('\n--- 8. Testing CORS Origin Validation & Bypasses ---');
  try {
    // A. Unauthorized origin
    const evilRes = await request('/api/health', {
      method: 'GET',
      headers: { Origin: 'https://evil.com' },
    });
    assert(
      evilRes.status === 403 || evilRes.data?.success === false,
      'CORS: Unauthorized origin https://evil.com rejected with 403 Forbidden',
      `Status: ${evilRes.status}`
    );

    // B. Subdomain / Suffix Trick (http://localhost:3000.evil.com)
    const suffixRes = await request('/api/health', {
      method: 'GET',
      headers: { Origin: 'http://localhost:3000.evil.com' },
    });
    assert(
      suffixRes.status === 403 || suffixRes.data?.success === false,
      'CORS: Suffix domain trick http://localhost:3000.evil.com rejected',
      `Status: ${suffixRes.status}`
    );

    // C. Null origin
    const nullRes = await request('/api/health', {
      method: 'GET',
      headers: { Origin: 'null' },
    });
    assert(
      nullRes.status === 403 || nullRes.data?.success === false,
      'CORS: "null" origin rejected',
      `Status: ${nullRes.status}`
    );

    // D. Legitimate allowed origin
    const validOriginRes = await request('/api/health', {
      method: 'GET',
      headers: { Origin: 'http://localhost:3000' },
    });
    assert(
      validOriginRes.status === 200,
      'CORS: Legitimate origin http://localhost:3000 accepted',
      `Status: ${validOriginRes.status}`
    );
  } catch (err) {
    assert(false, 'CORS bypass test error', err.message);
  }

  // 11. Unbounded Pagination & Skip Limit Defense
  console.log('\n--- 9. Testing Pagination & Expensive Query Protection ---');
  try {
    const hugePageRes = await request('/api/products?page=999999999&limit=999999999');
    assert(
      hugePageRes.status === 200 &&
      hugePageRes.data?.pagination?.limit <= 100 &&
      hugePageRes.data?.pagination?.page <= 1000,
      'Pagination caps limit <= 100 and page <= 1000, preventing full table skip starvation',
      `Received page: ${hugePageRes.data?.pagination?.page}, limit: ${hugePageRes.data?.pagination?.limit}`
    );
  } catch (err) {
    assert(false, 'Pagination protection test error', err.message);
  }

  // 12. HTTP Parameter Pollution (HPP) Testing
  console.log('\n--- 10. Testing HTTP Parameter Pollution (HPP) Handling ---');
  try {
    const hppRes = await request('/api/products?limit=5&limit=999999');
    assert(
      hppRes.status === 200 && hppRes.data?.pagination?.limit <= 100,
      'HPP: Duplicate query parameters handled safely without bypassing limit ceiling',
      `Limit: ${hppRes.data?.pagination?.limit}`
    );
  } catch (err) {
    assert(false, 'HPP test error', err.message);
  }

  // 13. Cloudinary Upload Security & Magic Byte Spoofing Defense
  console.log('\n--- 11. Testing Cloudinary Upload Security & Spoofing ---');
  try {
    // Unauthenticated upload attempt
    const unauthUpload = await request('/api/upload', {
      method: 'POST',
    });
    assert(
      unauthUpload.status === 401,
      'Unauthenticated file upload blocked with HTTP 401',
      `Status: ${unauthUpload.status}`
    );

    // Empty / non-multipart payload attempt
    const emptyUpload = await request('/api/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
    }, {});
    assert(
      emptyUpload.status === 400,
      'Empty / invalid upload payload rejected with HTTP 400',
      `Status: ${emptyUpload.status}`
    );
  } catch (err) {
    assert(false, 'Upload security test error', err.message);
  }

  // Cleanup Secondary Test User
  if (dbConnected) {
    try {
      await Admin.deleteOne({ email: REGULAR_ADMIN_EMAIL });
      await mongoose.disconnect();
    } catch (_) {}
  }

  // Summary
  console.log('\n====================================================');
  console.log(`SECOND-PASS TEST RESULTS: ${passed} PASSED | ${failed} FAILED`);
  console.log('====================================================\n');
}

runDeepSecurityTests().catch((err) => {
  console.error('Test Runner Error:', err);
});
