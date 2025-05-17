export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const { question } = req.body

  const prompt = `You are Velvet, a refined, friendly curtain advisor with 20+ years of experience. Help customers choose curtains, fabrics, linings, and installation styles. Speak in a calm, elegant, British tone. Always ask follow-up questions if needed.\n\nCustomer: ${question}\n\nVelvet:`

  try {
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt,
        max_tokens: 200,
        temperature: 0.7,
        stop: ['Customer:', 'Velvet:']
      })
    })

    const data = await response.json()
    const answer = data.choices?.[0]?.text?.trim() || "I'm not sure, but I'd be happy to help further."

    res.status(200).json({ answer })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch response from OpenAI' })
  }
}
