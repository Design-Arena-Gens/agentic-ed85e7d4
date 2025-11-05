import type { NextApiRequest, NextApiResponse } from 'next';

interface BookRequest {
  bookTopic: string;
  bookType: string;
  targetWords: number;
  authorName: string;
  authorBio: string;
  includeImages: string;
}

interface ChapterOutline {
  title: string;
  subtopics: string[];
  wordCount: number;
  keyPoints: string[];
}

interface BookOutline {
  frontMatter: any;
  mainMatter: {
    introduction: string;
    chapters: ChapterOutline[];
  };
  backMatter: any;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { bookTopic, bookType, targetWords, authorName, authorBio, includeImages }: BookRequest = req.body;

  if (!bookTopic || !authorName) {
    return res.status(400).json({ error: 'Book topic and author name are required' });
  }

  const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Gemini API key not configured' });
  }

  try {
    // Step 1: Generate book outline
    const outlineResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Generate a complete book outline with detailed structure for: ${bookTopic}

Book Type: ${bookType}
Target Length: ${targetWords} words

Create a JSON structure with:
1. Front Matter (title, copyright, dedication, table of contents, preface, acknowledgements)
2. Main Matter (introduction, 10-15 chapters with titles and subtopics)
3. Back Matter (conclusion, appendix, glossary, references, about author)

For each chapter, provide:
- title: Chapter title
- subtopics: Array of 3-5 subtopic strings
- wordCount: Estimated word count (number)
- keyPoints: Array of key points to cover

Return ONLY valid JSON, no markdown code blocks or other text.

Example format:
{
  "frontMatter": {
    "title": "${bookTopic}",
    "author": "${authorName}",
    "year": ${new Date().getFullYear()},
    "preface": "Brief preface description",
    "dedication": "Optional dedication"
  },
  "mainMatter": {
    "introduction": "Introduction description",
    "chapters": [
      {
        "title": "Chapter 1 Title",
        "subtopics": ["Subtopic 1", "Subtopic 2", "Subtopic 3"],
        "wordCount": ${Math.floor(targetWords / 12)},
        "keyPoints": ["Key point 1", "Key point 2"]
      }
    ]
  },
  "backMatter": {
    "conclusion": "Conclusion description",
    "appendix": "Optional appendix",
    "glossary": "Optional glossary"
  }
}`
            }]
          }],
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192
          }
        })
      }
    );

    const outlineData = await outlineResponse.json();
    const outlineText = outlineData.candidates[0].content.parts[0].text;

    // Parse JSON (remove markdown code blocks if present)
    let jsonText = outlineText.trim();
    if (jsonText.includes('```json')) {
      jsonText = jsonText.split('```json')[1].split('```')[0].trim();
    } else if (jsonText.includes('```')) {
      jsonText = jsonText.split('```')[1].split('```')[0].trim();
    }

    const outline: BookOutline = JSON.parse(jsonText);

    // Step 2: Create Google Doc
    const documentId = `book_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    let fullContent = '';

    // Generate Title Page
    fullContent += `\n\n${bookTopic.toUpperCase()}\n\nBy ${authorName}\n\n${new Date().getFullYear()}\n\n---\n\n`;

    // Generate Table of Contents
    fullContent += `\n\nTABLE OF CONTENTS\n\n`;
    outline.mainMatter.chapters.forEach((chapter, idx) => {
      fullContent += `Chapter ${idx + 1}: ${chapter.title}\n`;
    });
    fullContent += `\n---\n\n`;

    // Generate Preface
    const prefaceResponse = await generateContent(GEMINI_API_KEY,
      `Write a preface for the book: ${bookTopic}

Include:
- Personal connection to the topic
- Journey that led to writing this book
- What makes this book unique

Target: 1000-1500 words. Write in an engaging, professional style.`
    );
    fullContent += `\n\nPREFACE\n\n${prefaceResponse}\n\n---\n\n`;

    // Generate Introduction
    const introResponse = await generateContent(GEMINI_API_KEY,
      `Write a comprehensive introduction for the book: ${bookTopic}

The introduction should:
- Hook the reader
- Explain why this topic matters
- Preview what readers will learn
- Set the tone for the book

Target: 2000-3000 words. Write in an engaging, professional style.`
    );
    fullContent += `\n\nINTRODUCTION\n\n${introResponse}\n\n---\n\n`;

    // Generate each chapter
    for (let i = 0; i < outline.mainMatter.chapters.length; i++) {
      const chapter = outline.mainMatter.chapters[i];

      await new Promise(resolve => setTimeout(resolve, 2000)); // Rate limit

      const chapterContent = await generateContent(GEMINI_API_KEY,
        `Write Chapter ${i + 1}: ${chapter.title} for the book: ${bookTopic}

Subtopics to cover:
${chapter.subtopics.map(s => `- ${s}`).join('\n')}

Key Points:
${chapter.keyPoints.map(k => `- ${k}`).join('\n')}

Target word count: ${chapter.wordCount} words

Write in an engaging, professional style with clear examples and actionable insights. Include section headers for each subtopic.`
      );

      fullContent += `\n\nCHAPTER ${i + 1}\n${chapter.title.toUpperCase()}\n\n${chapterContent}\n\n`;

      if (includeImages === 'yes') {
        fullContent += `[Image: Professional illustration for ${chapter.title}]\n\n`;
      }

      fullContent += `---\n\n`;
    }

    // Generate Conclusion
    await new Promise(resolve => setTimeout(resolve, 2000));
    const conclusionResponse = await generateContent(GEMINI_API_KEY,
      `Write a powerful conclusion for the book: ${bookTopic}

Include:
- Summary of key insights
- Call to action
- Final thoughts and inspiration
- Next steps for readers

Target: 2000-2500 words. Make it memorable and motivating.`
    );
    fullContent += `\n\nCONCLUSION\n\n${conclusionResponse}\n\n---\n\n`;

    // About the Author
    fullContent += `\n\nABOUT THE AUTHOR\n\n${authorName}\n\n${authorBio || 'Author biography to be added.'}\n\n`;

    // Return the complete book content
    // Note: In production, you would create actual Google Doc here
    // For this demo, we return the content and a simulated doc ID
    res.status(200).json({
      success: true,
      bookTitle: bookTopic,
      authorName: authorName,
      documentId: documentId,
      documentUrl: `https://docs.google.com/document/d/${documentId}/edit`,
      completedAt: new Date().toISOString(),
      content: fullContent,
      message: 'Book generated successfully! (Note: This is a demo. In production, this would create a real Google Doc.)'
    });

  } catch (error: any) {
    console.error('Error generating book:', error);
    res.status(500).json({
      error: 'Failed to generate book',
      details: error.message
    });
  }
}

async function generateContent(apiKey: string, prompt: string): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192
        }
      })
    }
  );

  const data = await response.json();

  if (!data.candidates || !data.candidates[0]) {
    throw new Error('No content generated');
  }

  return data.candidates[0].content.parts[0].text;
}
