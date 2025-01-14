import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const DistrictMap = () => {
  const [hoveredVillage, setHoveredVillage] = useState(null);
  const [mapData, setMapData] = useState(null);

  // 百分比和票數數據
  const villageData = {
    "月眉里": { percentage: 65, votes: 2696 },
    "山東里": { percentage: 65, votes: 1762 },
    "芝芭里": { percentage: 60, votes: 2104 },
    "內定里": { percentage: 60, votes: 2988 },
    "中建里": { percentage: 59, votes: 410 },
    "舊明里": { percentage: 59, votes: 576 },
    "內厝里": { percentage: 58, votes: 2024 },
    "洽溪里": { percentage: 58, votes: 2158 },
    "過嶺里": { percentage: 58, votes: 3531 },
    "興和里": { percentage: 57, votes: 1164 },
    "中榮里": { percentage: 57, votes: 323 },
    "青埔里": { percentage: 57, votes: 3788 },
    "三民里": { percentage: 57, votes: 1344 },
    "五福里": { percentage: 56, votes: 1409 },
    "興平里": { percentage: 55, votes: 993 },
    "石頭里": { percentage: 55, votes: 600 },
    "五權里": { percentage: 55, votes: 2490 },
    "青溪里": { percentage: 55, votes: 1345 },
    "新明里": { percentage: 54, votes: 1403 },
    "復興里": { percentage: 54, votes: 1397 },
    "信義里": { percentage: 54, votes: 1717 },
    "水尾里": { percentage: 54, votes: 1398 },
    "興福里": { percentage: 53, votes: 1450 },
    "明德里": { percentage: 52, votes: 1758 },
    "正義里": { percentage: 52, votes: 1568 },
    "永興里": { percentage: 52, votes: 321 },
    "永光里": { percentage: 52, votes: 2005 },
    "永福里": { percentage: 52, votes: 2072 },
    "東興里": { percentage: 52, votes: 1229 },
    "仁義里": { percentage: 52, votes: 1404 },
    "幸福里": { percentage: 52, votes: 2186 },
    "忠福里": { percentage: 52, votes: 1509 },
    "興國里": { percentage: 51, votes: 688 },
    "中央里": { percentage: 51, votes: 1238 },
    "文化里": { percentage: 50, votes: 3107 },
    "普仁里": { percentage: 50, votes: 1374 },
    "新興里": { percentage: 50, votes: 1290 },
    "中壢里": { percentage: 50, votes: 247 },
    "復華里": { percentage: 50, votes: 1950 },
    "普忠里": { percentage: 50, votes: 1133 },
    "忠義里": { percentage: 49, votes: 1367 },
    "德義里": { percentage: 49, votes: 866 },
    "健行里": { percentage: 48, votes: 1497 },
    "後寮里": { percentage: 48, votes: 1601 },
    "林森里": { percentage: 48, votes: 1332 },
    "龍興里": { percentage: 48, votes: 1424 },
    "新街里": { percentage: 48, votes: 774 },
    "和平里": { percentage: 48, votes: 866 },
    "普強里": { percentage: 48, votes: 1237 },
    "興華里": { percentage: 47, votes: 1896 },
    "成功里": { percentage: 47, votes: 1374 },
    "忠孝里": { percentage: 47, votes: 1532 },
    "興南里": { percentage: 47, votes: 966 },
    "中原里": { percentage: 47, votes: 1159 },
    "光明里": { percentage: 47, votes: 1748 },
    "振興里": { percentage: 46, votes: 1523 },
    "普義里": { percentage: 45, votes: 1253 },
    "普慶里": { percentage: 45, votes: 858 },
    "福德里": { percentage: 44, votes: 882 },
    "仁美里": { percentage: 44, votes: 1683 },
    "龍德里": { percentage: 43, votes: 1294 },
    "中興里": { percentage: 42, votes: 982 },
    "龍慈里": { percentage: 42, votes: 1370 },
    "自信里": { percentage: 41, votes: 1577 },
    "金華里": { percentage: 41, votes: 1253 },
    "內壢里": { percentage: 40, votes: 581 },
    "龍昌里": { percentage: 40, votes: 1643 },
    "仁福里": { percentage: 40, votes: 1254 },
    "至善里": { percentage: 39, votes: 973 },
    "華愛里": { percentage: 38, votes: 913 },
    "龍岡里": { percentage: 37, votes: 1169 },
    "自治里": { percentage: 32, votes: 789 },
    "龍東里": { percentage: 30, votes: 995 },
    "莊敬里": { percentage: 29, votes: 696 },
    "龍平里": { percentage: 27, votes: 522 },
    "自立里": { percentage: 24, votes: 841 }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await window.fs.readFile('ZLi-20.json', { encoding: 'utf8' });
        const data = JSON.parse(response);
        setMapData(data);
      } catch (error) {
        console.error('Error loading map data:', error);
      }
    };
    loadData();
  }, []);

  if (!mapData) {
    return <div>載入中...</div>;
  }

  // 計算地圖邊界
  const getBounds = () => {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    mapData.features.forEach(feature => {
      feature.geometry.coordinates[0].forEach(coord => {
        minX = Math.min(minX, coord[0]);
        minY = Math.min(minY, coord[1]);
        maxX = Math.max(maxX, coord[0]);
        maxY = Math.max(maxY, coord[1]);
      });
    });

    return { minX, minY, maxX, maxY };
  };

  const bounds = getBounds();
  const width = 800;
  const height = 600;
  const padding = 40;

  // 座標轉換函數
  const scaleX = (x) => {
    return ((x - bounds.minX) / (bounds.maxX - bounds.minX)) * (width - 2 * padding) + padding;
  };

  const scaleY = (y) => {
    return height - (((y - bounds.minY) / (bounds.maxY - bounds.minY)) * (height - 2 * padding) + padding);
  };

  // 計算區域中心點
  const calculateCenter = (coordinates) => {
    let sumX = 0, sumY = 0;
    coordinates.forEach(coord => {
      sumX += scaleX(coord[0]);
      sumY += scaleY(coord[1]);
    });
    return {
      x: sumX / coordinates.length,
      y: sumY / coordinates.length
    };
  };

  // 計算區域大小以決定圓形大小
  const calculateAreaSize = (coordinates) => {
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    coordinates.forEach(coord => {
      const x = scaleX(coord[0]);
      const y = scaleY(coord[1]);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    });
    const width = maxX - minX;
    const height = maxY - minY;
    return Math.min(width, height) * 0.4;
  };

  // 創建圓形圖的路徑
  const createPieSlice = (centerX, centerY, radius, percentage = 0) => {
    const angle = (percentage / 100) * 360;
    const startAngle = -90; // 從12點鐘方向開始
    const endAngle = startAngle + angle;
    
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    return `M ${centerX} ${centerY}
            L ${x1} ${y1}
            A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
            Z`;
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>桃園市第三選區各里潛在罷免票數分布</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
            {mapData.features.map((feature, index) => {
              const path = feature.geometry.coordinates[0].map((coord, i) => {
                const x = scaleX(coord[0]);
                const y = scaleY(coord[1]);
                return `${i === 0 ? 'M' : 'L'}${x},${y}`;
              }).join(' ') + 'Z';

              const villageInfo = villageData[feature.properties.VILLNAME] || { percentage: 0, votes: 0 };
              const center = calculateCenter(feature.geometry.coordinates[0]);
              const radius = calculateAreaSize(feature.geometry.coordinates[0]) / 2;

              return (
                <g key={index}>
                  <path
                    d={path}
                    fill="white"
                    stroke="#666666"
                    strokeWidth="3"
                    className={villageInfo ? "cursor-pointer" : ""}
                    onMouseEnter={() => villageInfo && setHoveredVillage({
                      ...feature.properties,
                      ...villageInfo
                    })}
                    onMouseLeave={() => setHoveredVillage(null)}
                  />
                  {villageInfo && villageInfo.percentage > 0 && (
                    <>
                      <circle
                        cx={center.x}
                        cy={center.y}
                        r={radius}
                        fill="#f0f0f0"
                      />
                      <path
                        d={createPieSlice(center.x, center.y, radius, villageInfo.percentage)}
                        fill="rgba(10, 186, 181, 0.9)"
                      />
                    </>
                  )}
                </g>
              );
            })}
          </svg>
          {hoveredVillage && (
            <div className="absolute top-4 right-4 bg-white p-4 rounded shadow">
              <p className="font-medium text-lg mb-1">{hoveredVillage.VILLNAME}</p>
              <p className="text-sm text-gray-600">潛在罷免比例：{hoveredVillage.percentage}%</p>
              <p className="text-sm text-gray-600">潛在罷免票數：{hoveredVillage.votes.toLocaleString()} 票</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DistrictMap;