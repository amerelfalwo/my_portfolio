import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { setCors, handlePreflight, requireAuth } from '../_middleware.js';

export default async function handler(req, res) {
  setCors(res);
  if (handlePreflight(req, res)) return;

  // Enforce authentication to prevent unauthorized metrics access
  if (!requireAuth(req, res)) return;

  try {
    // 2. Fetch raw environment variables
    const rawPropertyId = process.env.GA_PROPERTY_ID || '';
    const rawEmail = process.env.GA_CLIENT_EMAIL || '';
    const rawPrivateKey = process.env.GA_PRIVATE_KEY || '';

    if (!rawPropertyId || !rawEmail || !rawPrivateKey) {
      throw new Error(`Missing GA env vars. PropertyID: ${!!rawPropertyId}, Email: ${!!rawEmail}, Key: ${!!rawPrivateKey}`);
    }

    // 3. Rigorous sanitization (Remove extra quotes and fix newlines)
    const cleanPropertyId = rawPropertyId.replace(/"/g, '').trim();
    const cleanEmail = rawEmail.replace(/"/g, '').trim();
    // Handle escaped newlines from both .env files and Vercel env vars
    let cleanPrivateKey = rawPrivateKey.replace(/"/g, '');
    cleanPrivateKey = cleanPrivateKey.replace(/\\n/g, '\n');

    // 4. Initialize GA4 Client
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: cleanEmail,
        private_key: cleanPrivateKey,
      }
    });

    // 5. Fetch Data
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${cleanPropertyId}`,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      metrics: [{ name: 'activeUsers' }, { name: 'screenPageViews' }],
    });

    // 6. Parse the GA4 response into a clean format for the dashboard
    let activeUsers = 0;
    let totalViews = 0;

    if (response.rows && response.rows.length > 0) {
      response.rows.forEach(row => {
        activeUsers += parseInt(row.metricValues[0]?.value || '0', 10);
        totalViews += parseInt(row.metricValues[1]?.value || '0', 10);
      });
    }

    // 7. Return clean, structured data
    return res.status(200).json({
      activeUsers,
      totalViews,
      dateRange: '7daysAgo - today',
      raw: response,
    });

  } catch (error) {
    console.error('GA4 API Execution Error:', error.message);
    console.error('GA4 Full Error:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return res.status(500).json({ 
      error: "GA4 API Error", 
      details: error.message 
    });
  }
}
