import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const EXCHANGE_RATE = 1450; // KRW per USD

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    // Handle Stablecoin Data
    if (type === 'stable' || type === 'history_stable') {
       const filePath = path.join(process.cwd(), 'btc-stablecoins-supply-on-exchanges.csv');
       
       if (!fs.existsSync(filePath)) {
        return NextResponse.json(
          { error: 'Data file not found' },
          { status: 404 }
        );
      }

      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const lines = fileContent.trim().split('\n').slice(1); // Remove header

      // Parse all data first
      const data = lines.map(line => {
        const parts = line.split(',');
        if (parts.length < 2) return null;
        
        const dateStr = parts[0].split(' ')[0];
        const supply = parseFloat(parts[1]);
        
        if (isNaN(supply)) return null;

        return {
          date: dateStr,
          supply: supply,
          valueKRW: (supply * EXCHANGE_RATE) / 1000000000000 // Convert to Trillion KRW (조)
        };
      }).filter(item => item !== null) as { date: string, supply: number, valueKRW: number }[];

      if (type === 'history_stable') {
          // Join with BTC price if possible, but for now just return the stable data
          // The chart expects { date, value, btcPrice }
          // We need BTC price to overlay. 
          // Let's read BTC price data too.
          const btcFilePath = path.join(process.cwd(), 'btc-price-ohlc.csv');
          let btcDataMap: Record<string, number> = {};
          
          if (fs.existsSync(btcFilePath)) {
             const btcContent = fs.readFileSync(btcFilePath, 'utf-8');
             const btcLines = btcContent.trim().split('\n').slice(1);
             for (const line of btcLines) {
                 const parts = line.split(',');
                 if (parts.length < 2) continue;
                 const date = parts[0].split(' ')[0];
                 const price = parseFloat(parts[1]);
                 if (!isNaN(price)) {
                     btcDataMap[date] = price;
                 }
             }
          }

          const historyData = data.map(item => ({
              date: item.date,
              value: item.valueKRW, // Trillion KRW
              btcPrice: btcDataMap[item.date] || null
          }));
          
          return NextResponse.json(historyData);
      }

      // Latest stats for Card
      const latest = data[data.length - 1];
      
      // Calculate monthly change
      const lastDate = new Date(latest.date);
      const targetMonth = lastDate.getMonth() - 1;
      const targetYear = targetMonth < 0 ? lastDate.getFullYear() - 1 : lastDate.getFullYear();
      const adjustedTargetMonth = targetMonth < 0 ? 11 : targetMonth;

      // Find closest data point approx 30 days ago
      // Or average of last month? User query: "저번달 대비" usually means comparison with previous month avg or same date last month.
      // Let's use 30 days ago for simple "monthly change"
      
      let prevValue = latest.valueKRW;
      
      // Find entry ~30 days ago
      const thirtyDaysAgo = new Date(lastDate);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      // Find closest date
      const closestPrev = data.find(d => {
          const dDate = new Date(d.date);
          return dDate.getTime() >= thirtyDaysAgo.getTime();
      });

      if (closestPrev) {
          prevValue = closestPrev.valueKRW;
      }
      
      const changePercent = ((latest.valueKRW - prevValue) / prevValue) * 100;

      return NextResponse.json({
          marketCapKRW: latest.valueKRW,
          changePercent: changePercent
      });
    }

    // Handle FGI/Dominance real-time or historical data
    if (type === 'fgi' || type === 'history_fgi') {
      const filePath = path.join(process.cwd(), 'btc-fear-greed-index.csv');
      
      if (!fs.existsSync(filePath)) {
        return NextResponse.json(
          { error: 'Data file not found' },
          { status: 404 }
        );
      }

      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const lines = fileContent.trim().split('\n').slice(1); // Remove header
      
      // If historical data requested
      if (type === 'history_fgi') {
        const historyData = lines.map(line => {
          const parts = line.split(',');
          // timestamp,BTC: Price,fearandgreed,dominance
          if (parts.length < 3) return null;
          
          const date = parts[0].split(' ')[0]; // "2018-02-01"
          const btcPrice = parseFloat(parts[1]);
          const fear = parseFloat(parts[2]);
          const dominance = parts.length > 3 ? parseFloat(parts[3]) : null;

          return {
            date,
            btcPrice: isNaN(btcPrice) ? null : btcPrice,
            fear: isNaN(fear) ? null : fear,
            dominance: (dominance !== null && !isNaN(dominance)) ? dominance : null
          };
        }).filter(item => item !== null);

        return NextResponse.json(historyData);
      }

      // Existing logic for 'fgi' (latest values)
      let latestFearGreed = 0;
      let latestDominance = 0;
      let lastDate: Date | null = null;
      
      // Find latest valid values by iterating backwards
      for (let i = lines.length - 1; i >= 0; i--) {
        const parts = lines[i].split(',');
        if (parts.length < 3) continue;
        
        const fg = parseFloat(parts[2]);
        const dom = parseFloat(parts[3]);
        
        if (!latestFearGreed && !isNaN(fg)) {
          latestFearGreed = fg;
        }
        
        if (!latestDominance && !isNaN(dom)) {
          latestDominance = dom;
          if (!lastDate) {
            lastDate = new Date(parts[0]);
          }
        }

        if (latestFearGreed && latestDominance) break;
      }

      // Calculate last month average for dominance
      let lastMonthAvg = 0;
      if (lastDate) {
        const currentMonth = lastDate.getMonth();
        const currentYear = lastDate.getFullYear();
        
        // Previous month
        let targetMonth = currentMonth - 1;
        let targetYear = currentYear;
        if (targetMonth < 0) {
          targetMonth = 11;
          targetYear = currentYear - 1;
        }

        let sum = 0;
        let count = 0;

        for (const line of lines) {
          const parts = line.split(',');
          if (parts.length < 4) continue;
          
          const dateStr = parts[0];
          const date = new Date(dateStr);
          
          if (!isNaN(date.getTime()) && 
              date.getMonth() === targetMonth && 
              date.getFullYear() === targetYear) {
            const dom = parseFloat(parts[3]);
            if (!isNaN(dom)) {
              sum += dom;
              count++;
            }
          }
        }
        
        if (count > 0) {
          lastMonthAvg = sum / count;
        }
      }

      return NextResponse.json({
        fearAndGreed: latestFearGreed,
        dominance: latestDominance,
        dominanceLastMonthAvg: lastMonthAvg
      });
    }

    // Default: BTC Price History / ATH
    const filePath = path.join(process.cwd(), 'btc-price-ohlc.csv');

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
