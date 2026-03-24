// THRYVO AI — Lead Submission Function
// Receives lead data from VEXA chat and emails to AJ

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const lead = JSON.parse(event.body);

    // Send email via Resend (free tier — 3000 emails/month)
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'VEXA <vexa@thryvoai.ai>',
        to: 'thryvoai@outlook.com',
        subject: `New Early Access Lead — ${lead.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 24px; background: #040810; color: #f0f4ff;">
            <h2 style="color: #00ccff; margin-bottom: 4px;">New Early Access Lead</h2>
            <p style="color: #8899cc; margin-top: 0;">Collected by VEXA on thryvoai.ai</p>
            <hr style="border-color: rgba(0,204,255,0.15); margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #8899cc; width: 140px;">Name</td>
                <td style="padding: 10px 0; color: #f0f4ff; font-weight: bold;">${lead.name || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #8899cc;">Email</td>
                <td style="padding: 10px 0; color: #00ccff;">${lead.email || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #8899cc;">Business</td>
                <td style="padding: 10px 0; color: #f0f4ff;">${lead.business || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #8899cc;">What they make</td>
                <td style="padding: 10px 0; color: #f0f4ff;">${lead.products || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #8899cc;">Plan interest</td>
                <td style="padding: 10px 0; color: #cc44ff;">${lead.plan || 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #8899cc;">Platforms</td>
                <td style="padding: 10px 0; color: #f0f4ff;">${lead.platforms || 'Not provided'}</td>
              </tr>
            </table>
            <hr style="border-color: rgba(0,204,255,0.15); margin: 20px 0;">
            <p style="color: #3a4a6a; font-size: 12px;">Submitted ${new Date().toLocaleString('en-US', {timeZone: 'America/New_York'})} ET</p>
          </div>
        `
      })
    });

    if (!emailResponse.ok) {
      const err = await emailResponse.text();
      console.error('Email error:', err);
      // Don't fail the user experience if email fails
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true })
    };

  } catch (err) {
    console.error('Submit lead error:', err);
    return {
      statusCode: 200, // Return 200 so user experience isn't broken
      headers,
      body: JSON.stringify({ success: false })
    };
  }
};
