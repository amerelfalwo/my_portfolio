import dotenv from 'dotenv';
import path from 'path';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';
import { connectDb } from '../_utils/mongodb.js';
import Project from '../models/Project.js';
import Skill from '../models/Skill.js';
import Settings from '../models/Settings.js';
import Certificate from '../models/Certificate.js';
import { setCors, handlePreflight } from '../_middleware.js';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};

export default async function handler(req, res) {
  setCors(res);
  if (handlePreflight(req, res)) return;

  // Dynamically reload .env on each request if available
  try {
    dotenv.config({ path: path.join(process.cwd(), '.env'), override: true });
  } catch {
    // ignore in serverless environments
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    const { messages } = body || {};

    if (!Array.isArray(messages)) {
      return res.status(400).json({ success: false, error: 'Invalid or missing messages array' });
    }

    // Connect DB & fetch dynamic knowledge base context
    await connectDb();

    const [settings, projects, skills, certificates] = await Promise.all([
      Settings.findOne({}).lean().catch(() => null),
      Project.find({}).lean().catch(() => []),
      Skill.find({}).sort({ importance: -1 }).lean().catch(() => []),
      Certificate.find({}).sort({ date: -1 }).lean().catch(() => [])
    ]);

    const fullName = settings?.fullName || 'Amir Elrefai';
    const jobTitle = settings?.jobTitle || 'AI & Machine Learning Engineer';
    const bio = settings?.bio || '';
    const resumeUrl = settings?.resumeUrl || settings?.cvUrl || '';
    const cvText = settings?.cvText || '';
    const chatbotKnowledge = settings?.chatbotKnowledge || '';

    const projectsSummary = projects.map(p => 
      `- **${p.title}** (${p.category || 'AI'}): ${p.description || ''} | Tech: ${(p.tags || []).join(', ')}`
    ).join('\n');

    const skillsSummary = skills.map(s => 
      `- ${s.name} (${s.category || 'Tech'})`
    ).join('\n');

    const certsSummary = certificates.map(c => 
      `- ${c.title} by ${c.issuer || 'Issuer'}`
    ).join('\n');

  const SYSTEM_PROMPT = `
You are the official AI Representative and Professional Assistant for ${fullName}, who specializes as a ${jobTitle}.

### 1. STRICT LANGUAGE & TONE DIRECTIVE (HIGHEST PRIORITY)
- **Language Mirroring**: You MUST ALWAYS detect and respond in the EXACT SAME LANGUAGE as the user's latest message.
  - If the input is in Arabic (including Egyptian dialect), respond in fluent, natural, and professional Arabic without awkward literal translations.
  - If the input is in English, respond in clear, polished, and professional English.
  - Never mix languages unless referencing specific technical terms or tool names.
- **Tone**: Professional, analytical, concise, and approachable. Reflect a strong "Systems Analyst and AI Engineer" mindset.

### 2. STRICT ANTI-HALLUCINATION & NO-INFERENCE POLICY (CRITICAL)
- **ZERO HALLUCINATION**: Answer strictly and ONLY using the facts explicitly provided in the DYNAMIC KNOWLEDGE BASE below.
- **NO EXTRA FLUFF OR PADDING**: Do NOT elaborate, guess, invent, or generalize beyond what is written. For example, if the bio states "likes football and reading," do not invent phrases like "likes social affairs" or classify sports incorrectly. State explicitly what is there and stop.
- **Out-of-Scope**: If asked about a topic, skill, price, or fact NOT explicitly mentioned in the Knowledge Base, politely state: "I don't have specific details on that in my current knowledge base, but you can reach out to ${fullName} directly via the contact form or LinkedIn." Do NOT guess.

### 3. CONCISENESS & LINK DISPLAY RULES
- **DIRECT ANSWERS ONLY**: Answer precisely what was asked without unnecessary intro/outro boilerplate text.
- **STRICT CV LINK RULE (DO NOT SPAM LINKS)**: 
  - Do NOT include or append the CV/Resume link at the end of your responses by default.
  - ONLY provide the CV link ([${fullName}'s Resume](${resumeUrl}) | Arabic: [رابط السيرة الذاتية](${resumeUrl})) IF:
    1. The user explicitly asks for the CV, resume, or download link.
    2. The user asks a broad recruiting/hiring question like "How can I hire him?" or "Where can I see his full credentials?".
  - Never include the CV link when answering simple questions about hobbies, a specific project, or a single skill.

### 4. DYNAMIC KNOWLEDGE BASE (SYSTEM CONTEXT)
- **Full Name**: ${fullName}
- **Professional Title**: ${jobTitle}
- **Executive Summary / Bio**: ${bio}
- **Official CV URL**: ${resumeUrl}
- **Detailed CV & Work Experience**: ${cvText}
- **Custom Behavioral Instructions & Notes**: ${chatbotKnowledge}
- **Key Projects & Architectural Systems**: ${projectsSummary}
- **Technical Toolkit & Competencies**: ${skillsSummary}
- **Certifications & Ongoing Training**: ${certsSummary}
`;
    // 1. Try Groq Cloud API
    const rawGroqKey = process.env.GROQ_API_KEY || 
                       process.env.GROQ_KEY || 
                       process.env.VITE_GROQ_API_KEY;
    const groqApiKey = rawGroqKey ? rawGroqKey.trim() : '';

    if (groqApiKey) {
      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              ...messages.map((m) => ({
                role: m.role === 'assistant' ? 'assistant' : 'user',
                content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content)
              }))
            ],
            temperature: 0.4,
            max_tokens: 800,
            stream: true
          })
        });

        if (groqRes.ok && groqRes.body) {
          res.setHeader('Content-Type', 'text/x-unknown');
          res.setHeader('x-vercel-ai-ui-stream', 'v1');

          const reader = groqRes.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed.startsWith('data: ') && trimmed !== 'data: [DONE]') {
                try {
                  const data = JSON.parse(trimmed.slice(6));
                  const token = data.choices?.[0]?.delta?.content;
                  if (token) {
                    res.write(`0:${JSON.stringify(token)}\n`);
                  }
                } catch {
                  // ignore JSON chunk parse error
                }
              }
            }
          }
          return res.end();
        }
      } catch (err) {
        console.error('Groq API Error:', err);
      }
    }

    // 2. Try Gemini API
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || 
                   process.env.GEMINI_API_KEY || 
                   process.env.GIMINI_API_KEY || 
                   process.env.VITE_GEMINI_API_KEY;

    if (apiKey && (apiKey.startsWith('AIzaSy') || apiKey.length > 20)) {
      const google = createGoogleGenerativeAI({ apiKey });
      
      const formattedMessages = messages.map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content)
      }));

      const result = streamText({
        model: google('gemini-1.5-flash'),
        system: SYSTEM_PROMPT,
        messages: formattedMessages,
      });

      return result.toDataStreamResponse(res);
    }

    // No AI Key configured error response
    return res.status(500).json({
      success: false,
      error: 'No AI API Key configured. Please add GROQ_API_KEY or GEMINI_API_KEY in your .env file.'
    });

  } catch (error) {
    console.error('API Error (/api/chat):', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal Server Error'
    });
  }
}



