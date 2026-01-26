const axios = require('axios');

async function testApi() {
  try {
    console.log('Testing GET /users endpoint...');
    const response = await axios.get('http://localhost:3000/users');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testApi();