import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const filePath = path.join(process.cwd(), 'xrp-price-ohlc.csv');
    
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe');

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

    // Exchange rate
    const EXCHANGE_RATE = 1450;

    let points = 24;
    // Determine how many data points to return based on timeframe
    // Assuming 1 hour interval in CSV
    switch(timeframe) {
        case '24h': points = 24; break;
        case '7D': points = 24 * 7; break;
        case '30D': points = 24 * 30; break;
        case '90D': points = 24 * 90; break;
        case '1Y': points = 24 * 365; break;
        case 'All': points = dataLines.length; break;
        default: points = 24;
    }

    const slicedData = dataLines.slice(-points);

    const result = slicedData.map(line => {
      const parts = line.split(',');
      const timestamp = parts[0];
      const close = parseFloat(parts[1]);
      
      const date = new Date(timestamp);
      let timeLabel = '';
      
      if (timeframe === '24h') {
          timeLabel = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
      } else if (timeframe === '1Y' || timeframe === 'All') {
          timeLabel = date.toLocaleDateString('ko-KR', { year: '2-digit', month: 'numeric' });
      } else {
           timeLabel = date.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' });
      }

      return {
        time: timeLabel,
        value: close * EXCHANGE_RATE,
        timestamp: timestamp // Keep original timestamp for sorting if needed
      };
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error reading XRP price data:', error);
    return NextResponse.json(
      { error: 'Failed to process data' },
      { status: 500 }
    );
  }
}

