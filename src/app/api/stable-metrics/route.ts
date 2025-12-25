import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const filePath = path.join(process.cwd(), 'btc-stablecoins-supply-on-exchanges.csv');
    
    // Exchange rate: 1450 KRW/USD (as requested)
    const EXCHANGE_RATE = 1450;

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Data file not found' },
        { status: 404 }
      );
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.trim().split('\n');
    
    // Remove header
    const dataLines = lines.slice(1);
    
    if (dataLines.length === 0) {
      return NextResponse.json(
        { error: 'No data in file' },
        { status: 500 }
      );
    }

    const result = dataLines.map(line => {
      // Format: timestamp,Aggregate Supply on Exchanges
      // Example: 2019-11-19 0:00,807648187.1
      const parts = line.split(',');
      if (parts.length < 2) return null;

      const timestamp = parts[0];
      const usdValue = parseFloat(parts[1]);
      
      // Filter invalid lines
      if (isNaN(usdValue)) return null;

      const date = new Date(timestamp);
      // Format date to what chart usually expects (e.g. YYYY-MM-DD or similar)
      // DominanceChart uses: date.toLocaleDateString('en-CA') which is YYYY-MM-DD
      const formattedDate = date.toLocaleDateString('en-CA');

      // Convert USD to KRW
      // Note: The chart expects "Trillion KRW" unit for display if we follow current mock logic?
      // Mock logic in dominance-chart.tsx: "162.7" (Billion USD originally? No, wait)
      // Original mock: "stable: baseValue = 162.7; // Billion USD"
      // User query: "스테이블 시총 실제로 넣어줘 1450원으로 계산해서" (Put Stable Cap with 1450 KRW calculation)
      // The chart label says "스테이블 시총 225.4조" (225.4 Trillion).
      // So the value should be in Trillion KRW if we want to match the unit "조".
      // USD Value (e.g. 62 Billion) * 1450 = 90 Trillion KRW.
      // So we should return the value in Trillion KRW.
      
      const krwValue = usdValue * EXCHANGE_RATE;
      const trillionKrwValue = krwValue / 1000000000000;

      return {
        date: formattedDate,
        value: trillionKrwValue,
        originalUsd: usdValue
      };
    }).filter(item => item !== null);

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error reading Stablecoin data:', error);
    return NextResponse.json(
      { error: 'Failed to process data' },
      { status: 500 }
    );
  }
}

