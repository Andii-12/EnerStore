import React, { useState, useEffect } from 'react';

const TestAPI = () => {
  const [status, setStatus] = useState('Testing...');
  const [data, setData] = useState(null);

  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log('🧪 Testing API connection...');
        
        // Test health endpoint
        const healthRes = await fetch('https://enerstore-production.up.railway.app/health', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Origin': 'http://localhost:3000'
          },
          mode: 'cors',
          credentials: 'omit'
        });
        
        if (healthRes.ok) {
          const healthData = await healthRes.json();
          console.log('✅ Health check passed:', healthData);
          setStatus('Health check passed');
          
          // Test products endpoint
          const productsRes = await fetch('https://enerstore-production.up.railway.app/api/products', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Origin': 'http://localhost:3000'
            },
            mode: 'cors',
            credentials: 'omit'
          });
          
          if (productsRes.ok) {
            const productsData = await productsRes.json();
            console.log('✅ Products API working:', productsData.length, 'products');
            setStatus(`API Working! Found ${productsData.length} products`);
            setData(productsData.slice(0, 3)); // Show first 3 products
          } else {
            console.error('❌ Products API failed:', productsRes.status);
            setStatus(`Products API failed: ${productsRes.status}`);
          }
        } else {
          console.error('❌ Health check failed:', healthRes.status);
          setStatus(`Health check failed: ${healthRes.status}`);
        }
      } catch (error) {
        console.error('❌ API Test error:', error);
        setStatus(`Error: ${error.message}`);
      }
    };

    testAPI();
  }, []);

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>API Test Results</h3>
      <p><strong>Status:</strong> {status}</p>
      {data && (
        <div>
          <h4>Sample Products:</h4>
          {data.map((product, index) => (
            <div key={index} style={{ margin: '10px 0', padding: '10px', background: '#f5f5f5' }}>
              <strong>{product.name}</strong>
              <p>ID: {product._id}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestAPI;
