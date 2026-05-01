const fetch = require('node-fetch');

async function test() {
  const response = await fetch('http://localhost:8080/api/assistant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: 'Hello', userProfile: { level: 'Beginner' } })
  });
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}

test();
