#!/usr/bin/env node

/**
 * Test script for MongoDB Backend
 * Run this to verify the backend is working correctly
 */

const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:3002';

async function testBackend() {
  console.log('🧪 Testing MongoDB Backend...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣  Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', healthResponse.data);
    console.log('');

    // Test 2: Register User
    console.log('2️⃣  Testing User Registration...');
    const registerData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'testpassword123'
    };

    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, registerData);
    console.log('✅ Registration Response:', {
      status: registerResponse.data.status,
      message: registerResponse.data.message
    });
    console.log('');

    // Test 3: Login User
    console.log('3️⃣  Testing User Login...');
    const loginData = {
      email: 'test@example.com',
      password: 'testpassword123'
    };

    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, loginData);
    console.log('✅ Login Response:', {
      status: loginResponse.data.status,
      message: loginResponse.data.message,
      hasToken: !!loginResponse.data.data?.token
    });

    const token = loginResponse.data.data?.token;
    if (!token) {
      throw new Error('No token received from login');
    }
    console.log('');

    // Test 4: Get User Profile
    console.log('4️⃣  Testing Get User Profile...');
    const profileResponse = await axios.get(`${BASE_URL}/api/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Profile Response:', {
      status: profileResponse.data.status,
      username: profileResponse.data.data?.user?.username,
      email: profileResponse.data.data?.user?.email
    });
    console.log('');

    // Test 5: Get User Stats
    console.log('5️⃣  Testing Get User Stats...');
    const statsResponse = await axios.get(`${BASE_URL}/api/user/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Stats Response:', {
      status: statsResponse.data.status,
      stats: statsResponse.data.data?.stats
    });
    console.log('');

    // Test 6: Get Try-On Sessions (should be empty for new user)
    console.log('6️⃣  Testing Get Try-On Sessions...');
    const sessionsResponse = await axios.get(`${BASE_URL}/api/tryOn`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Sessions Response:', {
      status: sessionsResponse.data.status,
      sessionCount: sessionsResponse.data.data?.sessions?.length || 0
    });
    console.log('');

    console.log('🎉 All tests passed! MongoDB backend is working correctly.');
    console.log('');
    console.log('📋 Test Summary:');
    console.log('   ✅ Health check working');
    console.log('   ✅ User registration working');
    console.log('   ✅ User login working');
    console.log('   ✅ JWT authentication working');
    console.log('   ✅ User profile access working');
    console.log('   ✅ User stats working');
    console.log('   ✅ Try-on sessions working');
    console.log('');
    console.log('🚀 Backend is ready for use!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    
    console.log('');
    console.log('🔧 Troubleshooting tips:');
    console.log('   1. Make sure MongoDB backend is running on port 3002');
    console.log('   2. Check that MongoDB is running and accessible');
    console.log('   3. Verify your .env file configuration');
    console.log('   4. Check the backend logs for detailed error information');
    
    process.exit(1);
  }
}

// Run the tests
testBackend(); 