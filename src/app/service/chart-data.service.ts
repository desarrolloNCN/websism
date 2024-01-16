import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChartDataService {

  constructor() { }

  getChartData(e: any, value: any, dataformat: any): any {

    let st = new Date(e.starttime)
    let et = new Date(e.endtime)

    return [
      {
        customid: 'aceleracion',
        title: {
          text: `${dataformat} - Aceleracion | ${e.network}.${e.station}.${e.channel}`,
          subtext: `Inicio: ${e.starttime} | Fin: ${e.endtime} | Duracion: `,
        },
        tooltip: {
          trigger: 'axis',
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            dataView: { readOnly: true },
            restore: {},
            saveAsImage: {}
          }
        },
        grid: {
          top: 80,
        },
        xAxis: {
          data: value[0].tiempo_a,
          name: "Tiempo [s]",
          silent: false,
          splitLine: {
            show: false,
          },
          axisLabel: {
            hideOverlap: true
          }
        },
        yAxis: {
          name: "Aceleracion (cm/s^2)",
          nameRotate: 90,
          nameLocation: 'middle',
          nameGap: 40,
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            start: 0,
            end: 100,
            handleIcon: 'M10 0 L5 10 L0 0 L5 0 Z',
            handleSize: '100%',
            handleStyle: {
              color: '#ddd'
            }
          }
        ],
        series: [
          {
            name: 'Aceleracion (cm/s^2)',
            type: 'line',
            showSymbol: false,
            data: value[0].traces_a,
            animationDelay: (idx: number) => idx * 10,
          },
        ],
        animationEasing: 'elasticOut',
        animationDelayUpdate: (idx: number) => idx * 5,
      },
      {
        customid: 'velocidad',
        title: {
          text: `${dataformat} - Velocidad | ${e.network}.${e.station}.${e.channel}`,
          subtext: `Inicio: ${e.starttime} | Fin: ${e.endtime}`,
        },
        tooltip: {
          trigger: 'axis',
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            dataView: { readOnly: true },
            restore: {},
            saveAsImage: {}
          }
        },
        grid: {
          top: 80,
        },
        xAxis: {
          data: value[0].tiempo_a,
          silent: false,
          name: "Tiempo [s]",
          splitLine: {
            show: false,
          },
          axisLabel: {
            hideOverlap: true
          }
        },
        yAxis: {
          name: "Velocidad (cm/s)",
          nameRotate: 90,
          nameLocation: 'middle',
          nameGap: 40
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            start: 0,
            end: 100,
            handleIcon: 'M10 0 L5 10 L0 0 L5 0 Z',
            handleSize: '100%',
            handleStyle: {
              color: '#ddd'
            }
          }
        ],
        series: [
          {
            name: 'Aceleracion (mk/s/s)',
            type: 'line',
            showSymbol: false,
            data: value[0].traces_v,
            animationDelay: (idx: number) => idx * 10,
          },
        ],
        animationEasing: 'elasticOut',
        animationDelayUpdate: (idx: number) => idx * 5,
      },
      {
        customid: 'desplazamiento',
        title: {
          text: `${dataformat} - Desplazamiento | ${e.network}.${e.station}.${e.channel}`,
          subtext: `Inicio: ${e.starttime} | Fin: ${e.endtime}`,
        },
        tooltip: {
          trigger: 'axis',
        },
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            dataView: { readOnly: true },
            restore: {},
            saveAsImage: {}
          }
        },
        grid: {
          top: 80,
        },
        xAxis: {
          data: value[0].tiempo_a,
          silent: false,
          name: "Tiempo [s]",
          splitLine: {
            show: false,
          },
          axisLabel: {
            hideOverlap: true
          }
        },
        yAxis: {
          name: "Desplazamiento (cm) ",
          nameRotate: 90,
          nameLocation: 'middle',
          nameGap: 40
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            start: 0,
            end: 100,
            handleIcon: 'M10 0 L5 10 L0 0 L5 0 Z',
            handleSize: '100%',
            handleStyle: {
              color: '#ddd'
            }
          }
        ],
        series: [
          {
            name: 'Aceleracion (mk/s/s)',
            type: 'line',
            showSymbol: false,
            data: value[0].traces_d,
            animationDelay: (idx: number) => idx * 10,
          },
        ],
        animationEasing: 'elasticOut',
        animationDelayUpdate: (idx: number) => idx * 5,
      }
    ]

  }

}
