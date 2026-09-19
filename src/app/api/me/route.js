import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // In local architecture, session is authenticated via headers or query parameters
    const authHeader = request.headers.get('authorization');
    const email = request.nextUrl.searchParams.get('email') || (authHeader ? authHeader.replace('Bearer ', '') : 'demo@parichaya.ai');

    const userData = {
      id: 'usr_' + Date.now(),
      email: email,
      name: email.split('@')[0].toUpperCase(),
      activeResume: {
        id: 'res_v3',
        filename: 'Software_Engineer_Resume_v3.pdf',
        updatedAt: '2 days ago',
        parsedData: {
          skills: ['Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'Git', 'REST APIs', 'System Architecture'],
          experienceYears: 2
        }
      },
      targetRole: 'Frontend Developer',
      xp: 240,
      level: 1,
      streakDays: 7
    };

    return NextResponse.json(userData);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
