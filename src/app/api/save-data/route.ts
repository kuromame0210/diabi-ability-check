import { NextRequest, NextResponse } from 'next/server';
import { UserData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { userData }: { userData: UserData } = await request.json();

    // 環境変数チェック
    const apiKey = process.env.GOOGLE_API_KEY;
    const sheetId = process.env.GOOGLE_SHEET_ID;

    if (!apiKey || !sheetId) {
      console.error('Google Sheets API credentials not configured');
      return NextResponse.json(
        { success: false, error: 'API credentials not configured' },
        { status: 500 }
      );
    }

    // Google Sheets API への送信データを準備
    const values = [[
      userData.name,
      userData.testDate,
      userData.testTime,
      userData.scores.problem1,
      userData.scores.problem2,
      userData.scores.total,
      userData.abilities.reading.toFixed(2),
      userData.abilities.attention.toFixed(2),
      userData.abilities.memory.toFixed(2),
      userData.abilities.cognition.toFixed(2),
      userData.analysis.strongest,
      userData.analysis.weakest
    ]];

    // Google Sheets API 呼び出し
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A:L:append?valueInputOption=RAW&key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Sheets API error:', response.status, errorText);
      return NextResponse.json(
        { success: false, error: 'Failed to save to Google Sheets' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('API Route error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET メソッドは無効
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}