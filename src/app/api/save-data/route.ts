import { NextRequest, NextResponse } from 'next/server';
import { UserData } from '@/types';
import { google } from 'googleapis';

export async function POST(request: NextRequest) {
  try {
    console.log('=== Google Sheets API Debug ===');
    const { userData }: { userData: UserData } = await request.json();

    // 環境変数チェック
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    const sheetId = process.env.GOOGLE_SHEET_ID;

    console.log('Service Account Key exists:', !!serviceAccountKey);
    console.log('Sheet ID exists:', !!sheetId);
    console.log('Sheet ID:', sheetId);

    if (!serviceAccountKey || !sheetId) {
      console.error('Google Sheets API credentials not configured');
      return NextResponse.json(
        { success: false, error: 'API credentials not configured' },
        { status: 500 }
      );
    }

    // サービスアカウント認証（Base64デコード）
    const decodedKey = Buffer.from(serviceAccountKey, 'base64').toString('utf-8');
    const credentials = JSON.parse(decodedKey);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // 得意・苦手アビリティの文字列を生成
    const strongestAbilities = Array.isArray(userData.analysis.strongest)
      ? userData.analysis.strongest.map(item => item.name).join(', ')
      : userData.analysis.strongest;

    const weakestAbility = typeof userData.analysis.weakest === 'object'
      ? userData.analysis.weakest.name
      : userData.analysis.weakest;

    // 時刻を分単位にフォーマット（秒を除去）
    const timeWithoutSeconds = userData.testTime.substring(0, 5); // HH:MM形式

    // Google Sheets API への送信データを準備（指定された形式）
    const values = [[
      `${userData.testDate} ${timeWithoutSeconds}`, // 日付と時刻（分まで）
      userData.name,                        // 名前
      userData.scores.problem1,             // 1問目の点数
      userData.scores.problem2,             // 2問目の点数
      userData.scores.problem3,             // 3問目の点数
      userData.scores.problem4,             // 4問目の点数
      userData.scores.problem5,             // 5問目の点数
      userData.scores.problem6,             // 6問目の点数
      userData.scores.problem7,             // 7問目の点数
      userData.scores.problem8,             // 8問目の点数
      userData.scores.total,                // 合計得点
      strongestAbilities,                   // 得意なアビリティ
      weakestAbility                        // 苦手なアビリティ
    ]];

    console.log('Prepared data:', values);

    // 重複チェック：既存データを確認
    console.log('Checking for duplicate records...');
    const existingDataResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'A:B', // 日時と名前の列のみ取得
    });

    const existingData = existingDataResponse.data.values || [];
    const newDateTime = `${userData.testDate} ${timeWithoutSeconds}`;
    const newName = userData.name;

    // 重複チェック（ヘッダー行を除く）
    const isDuplicate = existingData.slice(1).some(row => {
      if (row.length < 2) return false;
      const existingDateTime = row[0];
      const existingName = row[1];
      return existingDateTime === newDateTime && existingName === newName;
    });

    if (isDuplicate) {
      console.log('Duplicate record found. Skipping save.');
      return NextResponse.json({
        success: true,
        message: 'Record already exists - duplicate not saved'
      });
    }

    console.log('No duplicate found. Proceeding with save.');

    // 最新データを2行目に挿入（ヘッダーの次）
    console.log('Inserting data at row 2 to keep latest data at top...');

    // まず2行目に空行を挿入
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: {
        requests: [{
          insertDimension: {
            range: {
              sheetId: 0,
              dimension: 'ROWS',
              startIndex: 1,
              endIndex: 2
            },
            inheritFromBefore: false
          }
        }]
      }
    });

    // 2行目にデータを書き込み
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: 'A2:M2',
      valueInputOption: 'RAW',
      requestBody: {
        values: values,
      },
    });

    console.log('Append response status:', response.status);
    console.log('Append response data:', response.data);
    console.log('=== Save operation completed successfully ===');

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