import { NextResponse } from 'next/server';

if (typeof global.DOMMatrix === 'undefined') {
  global.DOMMatrix = class DOMMatrix {};
  global.ImageData = class ImageData {};
  global.Path2D = class Path2D {};
}

function fallbackExtractText(buffer) {
  try {
    const raw = buffer.toString('binary');
    const matches = raw.match(/\(([^)]+)\)/g) || [];
    const extracted = matches
      .map(m => m.slice(1, -1))
      .filter(s => s.length > 2 && /[\w\s.,-]/i.test(s))
      .join(' ');
    return extracted.length > 50 ? extracted : null;
  } catch (e) {
    return null;
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let parsedText = '';

    try {
      const pdfParse = require('pdf-parse');
      const data = await pdfParse(buffer);
      parsedText = data.text || '';
    } catch (pdfErr) {
      console.warn('pdf-parse primary parser error, using fallback stream extraction:', pdfErr?.message);
      parsedText = fallbackExtractText(buffer) || '';
    }

    if (!parsedText.trim()) {
      parsedText = fallbackExtractText(buffer) || '';
    }

    if (!parsedText.trim()) {
      return NextResponse.json({ error: 'Could not extract readable text from PDF. Ensure it is text-based and not scanned.' }, { status: 422 });
    }

    return NextResponse.json({ text: parsedText });
  } catch (error) {
    console.error('PDF Parse Route Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to parse PDF' }, { status: 500 });
  }
}

