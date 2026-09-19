import { NextResponse } from 'next/server';
import { evaluateInterview } from '@/lib/ollamaService';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', 
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { sessionId, role, transcript, wordCount, speakingDurationSeconds, wpm, fillerWords, totalFillers } = body;

    if (!transcript) {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400, headers: corsHeaders });
    }

    const fillerStats = {
      totalFillers: totalFillers || 0,
      detectedWords: fillerWords || {},
    };

    const evalRes = await evaluateInterview(transcript, role || 'Candidate', fillerStats);

    return NextResponse.json(evalRes, { headers: corsHeaders });
  } catch (error) {
    console.error('Error evaluating interview:', error);
    return NextResponse.json({ error: 'Failed to evaluate interview' }, { status: 500, headers: corsHeaders });
  }
}
