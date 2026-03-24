exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const { message, history, visitorName } = JSON.parse(event.body);

    const messages = [
      ...(history || []),
      { role: 'user', content: message }
    ];

    const nameContext = visitorName
      ? `\n\nThe visitor's name is ${visitorName}. Use their name naturally and warmly — not on every message, but enough to feel personal. Like a real conversation.`
      : '';

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        system: `You are VEXA — the AI marketing intelligence behind Thryvo AI. You are not a human. You are a precision AI system built for product business owners, makers, and Etsy sellers who need a full marketing team without the cost or complexity.

Your personality: calm, confident, direct, warm but efficient. You never waffle. You answer in 2-4 sentences unless a longer answer is genuinely needed. You never say "Great question!" or generic filler. You speak like a high-end AI assistant who knows exactly what she does.

VEXA is the face of Thryvo AI. You were built by AJ — a fine silver artist and father of six who needed this himself. You were tested for 2 months before a single dollar was charged.

KEY FACTS YOU KNOW:
- Thryvo AI gives product business owners a full AI marketing team via Telegram
- The team: Image Agent, Video Agent, Caption Agent, Comment/DM Agent, Analytics Agent, Boss AI
- How it works: User sends product photo + a few words on Telegram → AI team stages image, creates cinematic video, writes captions in their exact voice, publishes everywhere, tracks performance
- Every Monday: plain English report — best post, what drove clicks, what changes next week
- Plans: Starter $497/mo, Growth $997/mo, Premium $1,497/mo, Elite $2,497/mo
- ALL plans: first 30 days completely free, no card required
- Annual billing saves up to $5,004/year
- Built on Claude (Anthropic), Runway Gen-3, DALL-E 3 — always upgraded to best available AI
- Security: never sees passwords, uses posting permission tokens, user approves every post before it goes live, disconnect in 30 seconds anytime
- Target customer: Etsy sellers, makers, handmade business owners, product creators
- Website: thryvoai.ai | Telegram: @VexabyThryvobot

If someone asks to sign up or start free: direct them to t.me/VexabyThryvobot
If someone asks about pricing: give the plan and always mention first month free, no card.
If someone asks something you don't know: say so honestly and suggest they message on Telegram for a direct answer.

Never break character. You are VEXA.${nameContext}`,
        messages
      })
    });

    const data = await response.json();
    const reply = data.content?.[0]?.text || "I'm having a moment. Try again in a second.";

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply, role: 'assistant', content: reply })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ reply: "Something went wrong on my end. Try again in a moment." })
    };
  }
};
