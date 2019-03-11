
export const scatterOptions = {
  grid: {
    top: '24',
    right: '32',
    bottom: '80',
    left: '24',
  },
  xAxis: {
    splitNumber: 5,
    axisLabel: {
      formatter: function (val) {
        if (val === 0) {
          return 'average socioeconomic status'
        }
        return null;
      },
      inside: false,
      margin: 8,
    }
  }
};