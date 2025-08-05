import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { environment } from '../../../../environments/environment.prod';
import { getUserId, getUserName, getUserRole } from '../../../core/utils/user-utils';

import { DecimalPipe } from '@angular/common';
import * as ApexCharts from 'apexcharts';
import { Store } from '@ngrx/store';
// import { fetchfeedbackdataData, fetchpropertydataData, fetchrentproprtydataData, fetchsalepropertydataData } from 'src/app/store/RealEstate/realEstate.action';
// import { selectData, selectfeedData, selectrentData, selectsaleData } from 'src/app/store/RealEstate/realEstate-selector';

import { NgApexchartsModule } from 'ng-apexcharts';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-dashb',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './dashb.component.html',
  styleUrl: './dashb.component.scss'
})

export class DashbComponent implements OnInit {

  http = inject(HttpClient);
  chart: any;
  ventasPorMesData: any[] = [];

  totalrevenueChart: any;

   // Datos de usuario
  usuarioId: string | number = '';
  nombreUsuario: string = '';
  rolUsuario: string = '';
  ultimoAcceso: Date | null = null;
  
  // Datos de entorno
  apiUrl: string = '';
  authMode: string = '';
  appVersion: string = '';
  isProd: boolean = false;
  entorno: string = '';

  constructor() { }

  ngOnInit(): void {
    
    this.cargarDatosSesion();
    this.cargardatos();

    // this._totalrevenueChart('["--table table-gridjs"]');
    // this.chart = new ApexCharts(document.querySelector(".apex-charts"), this.totalrevenueChart);
  }

  private getChartColorsArray(colors: any) {
    colors = JSON.parse(colors);
    return colors.map(function (value: any) {
      var newValue = value.replace(" ", "");
      if (newValue.indexOf(",") === -1) {
        var color = getComputedStyle(document.documentElement).getPropertyValue(newValue);
        if (color) {
          color = color.replace(" ", "");
          return color;
        }
        else return newValue;;
      } else {
        var val = value.split(',');
        if (val.length == 2) {
          var rgbaColor = getComputedStyle(document.documentElement).getPropertyValue(val[0]);
          rgbaColor = "rgba(" + rgbaColor + "," + val[1] + ")";
          return rgbaColor;
        } else {
          return newValue;
        }
      }
    });
  }

  private _totalrevenueChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.totalrevenueChart = {
      series: [{
        name: 'Ventas',
        data: this.ventasPorMesData.map(item => item.Cantidad || 0) 
        // data: [26, 24.65, 18.24, 29.02, 23.65, 27, 21.18, 24.65, 27.32, 25, 24.65, 29.32]

      }],
      chart: {
        type: 'bar',
        height: 328,
        stacked: true,
        toolbar: {
          show: true
        },
      },
      plotOptions: {
        bar: {
          columnWidth: '30%',
          borderRadius: 5
        },
      },
      grid: {
        padding: {
          left: 0,
          right: 0,
          top: -15,
          bottom: 0
        }
      },
      colors: colors,
      fill: {
        opacity: 1
      },
      dataLabels: {
        enabled: false,
        textAnchor: 'top',
      },
      yaxis: {
        labels: {
          show: true,
          formatter: function (y: any) {
            return y.toFixed(0) + "  ";
          }
        },
      },
      legend: {
        show: false,
        position: 'top',
        horizontalAlign: 'right',
      },
      xaxis: {
        categories: this.ventasPorMesData.map(item => item.MesNombre),
        // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        labels: {
          rotate: -90
        },
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          stroke: {
            width: 1
          },
        },
      }
    }
    // const attributeToMonitor = 'data-theme';

    // const observer = new MutationObserver(() => {
    //   this._totalrevenueChart('["--tb-primary"]');
    // });
    // observer.observe(document.documentElement, {
    //   attributes: true,
    //   attributeFilter: [attributeToMonitor]
    // });
  }

  private cargardatos(): void {
      // this.mostrarOverlayCarga = true;
      this.http.get(`${environment.apiBaseUrl}/Dashboards/VentasPorMes`, {
        headers: { 'x-api-key': environment.apiKey }
      }).subscribe({
        next: data => {

          console.log('Datos de ventas por mes:', data);
          this.ventasPorMesData = data as any[];
          this._totalrevenueChart('["--table table-gridjs"]');

          this.chart = new ApexCharts(document.querySelector(".apex-charts"), this.totalrevenueChart);
          // this.chart.render();          


          // this.chart.updateOptions(this.totalrevenueChart);
          // this.ventasPorMesData = data as any[];


          
        },
        error: error => {
          console.error('Error al cargar roles:', error);
          
        }
      });
    }

  cargarDatosSesion(): void {
    // Obtener datos del usuario usando las funciones de utilidad
    const userId = getUserId();
    this.usuarioId = userId > 0 ? userId : 'No disponible';
    this.nombreUsuario = getUserName() || 'No disponible';
    this.rolUsuario = getUserRole() || 'No disponible';
    
    const ultimoAccesoStr = localStorage.getItem('ultimoAcceso');
    if (ultimoAccesoStr) {
      try {
        this.ultimoAcceso = new Date(ultimoAccesoStr);
      } catch (e) {
        this.ultimoAcceso = new Date();
      }
    } else {
      this.ultimoAcceso = new Date();
    }

    // Obtener datos del entorno
    this.apiUrl = environment.apiBaseUrl || 'No configurada';
    this.authMode = environment.defaultauth || 'No configurado';
    this.appVersion = '1.0.0'; // Versión de la aplicación
    
    // Determinar si estamos en producción
    const isProduction = window.location.hostname !== 'localhost' && 
                        !window.location.hostname.includes('127.0.0.1');
    this.isProd = isProduction;
    this.entorno = isProduction ? 'Producción' : 'Desarrollo';
  }

}

