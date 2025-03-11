require('dotenv').config();
const { Permit } = require('permitio');

// Initialize Permit.io SDK
const permit = new Permit({
  pdp: 'http://localhost:7766', // Local PDP for development
  token: process.env.PERMIT_API_KEY,
});

async function testPermission() {
  try {
    const allowed = await permit.check('bannieugbede@gmail.com', 'pay', 'default/payment:*');
    console.log(`Permission result: ${allowed}`);
  } catch (error) {
    console.error('Error checking permission:', error);
  }
}

testPermission();