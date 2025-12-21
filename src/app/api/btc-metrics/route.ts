import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const filePath = path.join(process.cwd(), 'btc-price-ohlc.csv');
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

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

    if (type === 'history') {
      const dailyData: { date: string; close: number; high: number }[] = [];
      let currentDay = '';
      let dailyHigh = -Infinity;
      let dailyClose = 0;

      // Group by day to reduce data size (from hourly to daily)
      for (const line of dataLines) {
        const parts = line.split(',');
        if (parts.length < 3) continue;
        
        const timestamp = parts[0]; // "2010-07-17 23:00:00"
        const date = timestamp.split(' ')[0];
        const high = parseFloat(parts[2]);
        const close = parseFloat(parts[1]);

        if (date !== currentDay) {
          if (currentDay) {
            dailyData.push({ date: currentDay, close: dailyClose, high: dailyHigh });
          }
          currentDay = date;
          dailyHigh = high;
          dailyClose = close;
        } else {
          if (high > dailyHigh) dailyHigh = high;
          dailyClose = close; // Last close of the day
        }
      }
      // Add last day
      if (currentDay) {
        dailyData.push({ date: currentDay, close: dailyClose, high: dailyHigh });
      }

      // Calculate Drawdown
      let globalAth = -Infinity;
      const result = dailyData.map(day => {
        if (day.high > globalAth) globalAth = day.high;
        
        const drawdown = globalAth > 0 ? ((day.close - globalAth) / globalAth) * 100 : 0;
        
        return {
          date: day.date,
          btcPrice: day.close,
          value: drawdown
        };
      });

      return NextResponse.json(result);
    }

    let athPrice = -Infinity;
    let athDate = '';
    
    // Iterate through all lines to find ATH
    // Format: timestamp,c,h,l,o
    for (const line of dataLines) {
      const parts = line.split(',');
      if (parts.length >= 3) {
        const timestamp = parts[0];
        const high = parseFloat(parts[2]);
        
        if (!isNaN(high) && high > athPrice) {
          athPrice = high;
          athDate = timestamp;
        }
      }
    }

    // Get latest price (Close of the last entry)
    const lastLine = dataLines[dataLines.length - 1];
    const lastParts = lastLine.split(',');
    const currentPrice = parseFloat(lastParts[1]); // Close price
    
    if (isNaN(currentPrice) || isNaN(athPrice) || athPrice === 0) {
       return NextResponse.json(
        { error: 'Invalid data calculation' },
        { status: 500 }
      );
    }

    const dropPercentage = ((currentPrice - athPrice) / athPrice) * 100;
    
    // Format date to YYYY.MM.DD
    const dateObj = new Date(athDate);
    const formattedAthDate = `${dateObj.getFullYear()}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${String(dateObj.getDate()).padStart(2, '0')}`;

    return NextResponse.json({
      dropPercentage,
      athPrice,
      athDate: formattedAthDate,
      currentPrice
    });

  } catch (error) {
    console.error('Error reading BTC price data:', error);
    return NextResponse.json(
      { error: 'Failed to process data' },
      { status: 500 }
    );
  }
}

