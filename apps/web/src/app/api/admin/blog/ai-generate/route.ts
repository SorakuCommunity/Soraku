export const dynamic = 'force-dynamic'

import { NextRequest } from 'next/server'
import { getSession, isStaff } from '@/lib/auth'
import { ok, err, FORBIDDEN, SERVER_ERROR } from '@/lib/api'
import { env } from '@/env'

const CONTENT_TYPES = [
  'article',
  'seo_title',
  'seo_description',
  'excerpt',
  'tags',
  'slug',
  'faq',
  'cover_prompt',
  'rewrite',
  'expand',
  'summarize',
] as const

const TONES = ['Professional', 'Casual', 'Educational', 'Entertaining'] as const

function buildPrompt(input: {
  topic: string
  keywords?: string
  tone: string
  language: string
  wordCount: number
  contentType: string
  content?: string
}): string {
  const lang = input.language === 'id' ? 'Bahasa Indonesia' : 'English'
  const keywordStr = input.keywords
    ? `\nGunakan kata kunci ini: ${input.keywords}.`
    : ''

  const typeInstructions: Record<string, string> = {
    article: `Buat artikel blog lengkap dengan format JSON:
{
  "title": "Judul artikel",
  "slug": "url-slug",
  "excerpt": "Ringkasan singkat maksimal 160 karakter",
  "content": "Konten artikel dalam markdown",
  "tags": ["tag1", "tag2"],
  "seoTitle": "SEO title optimal",
  "seoDescription": "Meta description maksimal 160 karakter",
  "faq": [
    { "question": "Pertanyaan?", "answer": "Jawaban." }
  ]
}

Gunakan tone ${input.tone} dalam bahasa ${lang}. Minimal ${input.wordCount} kata. Jangan gunakan markdown code fence dalam respons. Berikan JSON murni.`,
    seo_title: `Buat 5 opsi SEO title yang menarik tentang topik berikut dalam bahasa ${lang}. Tone: ${input.tone}.
Format: { "result": ["title1", "title2", ...] }`,
    seo_description: `Buat 3 opsi meta description (maks 160 karakter) tentang topik berikut dalam bahasa ${lang}.
Format: { "result": ["desc1", "desc2", ...] }`,
    excerpt: `Buat excerpt/ringkasan singkat (maks 160 karakter) tentang topik berikut dalam bahasa ${lang}.
Format: { "result": "excerpt text" }`,
    tags: `Buat 5-10 tags yang relevan tentang topik berikut dalam bahasa ${lang}.
Format: { "result": ["tag1", "tag2", ...] }`,
    slug: `Buat 3 opsi URL slug untuk artikel tentang topik berikut dalam bahasa ${lang}. Gunakan huruf kecil dan tanda strip.
Format: { "result": ["slug-1", "slug-2", ...] }`,
    faq: `Buat 5 pertanyaan umum (FAQ) tentang topik berikut dalam bahasa ${lang} lengkap dengan jawabannya.
Format: { "result": [{ "question": "Pertanyaan?", "answer": "Jawaban." }] }`,
    cover_prompt: `Buat prompt untuk generate cover image tentang topik berikut dalam bahasa ${lang}. Deskripsikan visual yang cocok, gaya, warna, dan komposisi.
Format: { "result": "prompt text" }`,
    rewrite: `Tulis ulang konten berikut dengan tone ${input.tone} dalam bahasa ${lang}. Pertahankan informasi inti tetapi ubah gaya penulisan.
Format: { "result": "rewritten content" }`,
    expand: `Kembangkan konten berikut dengan tone ${input.tone} dalam bahasa ${lang}. Tambahkan detail, contoh, dan penjelasan tambahan. Target minimal ${input.wordCount} kata.
Format: { "result": "expanded content" }`,
    summarize: `Buat ringkasan dari konten berikut dengan tone ${input.tone} dalam bahasa ${lang}. Fokus pada poin-poin utama. Maksimal 200 kata.
Format: { "result": "summary text" }`,
  }

  const instruction = typeInstructions[input.contentType] || typeInstructions.article
  let prompt = `${instruction}\n\nTopik: ${input.topic}${keywordStr}`

  if (input.content && ['rewrite', 'expand', 'summarize'].includes(input.contentType)) {
    prompt += `\n\nKonten:\n${input.content}`
  }

  return prompt
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !isStaff(session.role)) return FORBIDDEN()

    const body = await req.json()
    const {
      topic,
      keywords,
      tone = 'Professional',
      language = 'id',
      wordCount = 1000,
      contentType = 'article',
      content,
    } = body

    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      return err('Topic is required')
    }

    if (!TONES.includes(tone as any)) {
      return err('Invalid tone. Must be one of: ' + TONES.join(', '))
    }

    if (!CONTENT_TYPES.includes(contentType as any)) {
      return err('Invalid content type')
    }

    const apiKey = env.AI_API_KEY
    const apiUrl = env.AI_API_URL || 'https://api.openai.com/v1/chat/completions'

    if (!apiKey) {
      return err('AI API key not configured', 500)
    }

    const prompt = buildPrompt({
      topic: topic.trim(),
      keywords,
      tone,
      language,
      wordCount: Math.min(Math.max(wordCount, 100), 5000),
      contentType,
      content,
    })

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'Anda adalah asisten AI yang membantu menulis konten blog. Respons harus dalam format JSON yang valid tanpa markdown code fence.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 4096,
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('[AI Generate] API error:', response.status, errorBody)
      return err('AI service error: ' + response.statusText, 502)
    }

    const data = await response.json()
    const rawContent = data.choices?.[0]?.message?.content

    if (!rawContent) {
      return err('AI returned empty response', 502)
    }

    let parsed: any
    try {
      const cleaned = rawContent
        .replace(/^```(?:json)?\s*\n?/gm, '')
        .replace(/\n?```\s*$/gm, '')
        .trim()
      parsed = JSON.parse(cleaned)
    } catch {
      return ok({ raw: rawContent, contentType })
    }

    return ok({ ...parsed, contentType })
  } catch (e) {
    console.error('[AI Generate] error:', e)
    return SERVER_ERROR()
  }
}
