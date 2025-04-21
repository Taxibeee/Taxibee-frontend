export const sampleResponseForLineChart = {
  message: 'Analytics by day for specified period',
  data: {
    daily_analytics: (() => {
      const startDate = new Date('2025-04-14');
      const days = 30;
      const dailyAnalytics = [];
      const dayNames = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];

      for (let i = 0; i < days; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);

        dailyAnalytics.push({
          date: currentDate.toISOString().split('T')[0],
          day: dayNames[currentDate.getDay()],
          total_revenue: Math.round((3000 + Math.random() * 4000) * 100) / 100, // Random revenue between 3000 and 7000
          total_orders: Math.floor(200 + Math.random() * 150), // Random orders between 200 and 350
          total_distance: Math.floor(1500000 + Math.random() * 1500000), // Random distance between 1,500,000 and 3,000,000
        });
      }

      return dailyAnalytics;
    })(),
    date_range: (() => {
      const startDate = new Date('2025-04-14');
      const days = 30;
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + days - 1);

      return {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0],
      };
    })(),
  },
};
