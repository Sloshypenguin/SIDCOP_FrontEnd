import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BreadcrumbsComponent } from 'src/app/shared/breadcrumbs/breadcrumbs.component';
import { environment } from '../../../../environments/environment.prod';
import { getUserId, getUserName, getUserRole } from '../../../core/utils/user-utils';

import { DecimalPipe } from '@angular/common';
import * as ApexCharts from 'apexcharts';
import { Store } from '@ngrx/store';
// import { fetchfeedbackdataData, fetchpropertydataData, fetchrentproprtydataData, fetchsalepropertydataData } from 'src/app/store/RealEstate/realEstate.action';
// import { selectData, selectfeedData, selectrentData, selectsaleData } from 'src/app/store/RealEstate/realEstate-selector';

import { NgApexchartsModule } from 'ng-apexcharts';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, NgZone } from '@angular/core';



@Component({
  selector: 'app-dashb',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, FormsModule, BreadcrumbsComponent],
  templateUrl: './dashb.component.html',
  styleUrl: './dashb.component.scss'
})

export class DashbComponent implements OnInit {

  http = inject(HttpClient);
  chart: any;
  ventasPorMesData: any[] = [];
  aniosSelect: number[] = [];
  anioSeleccionado: number = 2025;
  barraMesSelected: any;

  graficocategorias: boolean = false;
  categoriasdata: any[] = [];
  simpleDonutChart: any;

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

  constructor(private cdr: ChangeDetectorRef,private ngZone: NgZone) 
  { 
  }

  ngOnInit(): void {
    
    this.cargarDatosSesion();
    this.cargardatos();

    this._simpleDonutChart('["--tb-primary", "--tb-success", "--tb-warning", "--tb-danger", "--tb-info"]');

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
    
  const dataForYear = this.ventasPorMesData.filter(item => item.Anio == this.anioSeleccionado);
  
  dataForYear.sort((a, b) => a.MesNumero - b.MesNumero);

  

    this.totalrevenueChart = {
      series: [{
        name: 'Cantidad de Ventas',
        data: dataForYear.map(item => item.Cantidad || 0)
        // this.ventasPorMesData.filter(item => item.Anio == this.anioSeleccionado ).map(item => item.Cantidad || 0) 
        // data: [26, 24.65, 18.24, 29.02, 23.65, 27, 21.18, 24.65, 27.32, 25, 24.65, 29.32]

      }],
      chart: {
        
        type: 'bar',
        height: 328,
        stacked: true,
        toolbar: {
          show: true,
          export: {
            csv: {
            headerCategory: 'Mes',
            }
          },

        },
        events: {
          dataPointSelection: (event: any, chartContext: any, config: any) => {
            // info about the clicked bar
            const seriesIndex = config.seriesIndex;
            const dataPointIndex = config.dataPointIndex;
            const value = config.w.globals.initialSeries[seriesIndex].data[dataPointIndex];
            // const category = config.w.globals.categoryLabels[dataPointIndex];

            this.barraMesSelected = dataForYear[dataPointIndex]; // or any other property

            const category = config.w.globals.labels[dataPointIndex];
            
            this.onBarClick(category, value);
          }
        }
        
      },
      plotOptions: {
        bar: {
          columnWidth: '80%',
          borderRadius: 5
        },
      },
      grid: {
        padding: {
          left: 0,
          right: 0,
          top: 0,
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
        title: {
          text: 'Cantidad de Ventas',
          style: {
            fontWeight: 600
          }
        },
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
        title: {
          text: 'Meses',
          style: {
            fontWeight: 600
          }
        },
        categories: dataForYear.map(item => item.MesNombre),
        // this.ventasPorMesData.filter(item => item.Anio === this.anioSeleccionado).map(item => item.MesNombre ),
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
            width: 10
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

  private _simpleDonutChart(colors: any) {
    colors = this.getChartColorsArray(colors);
    this.simpleDonutChart = {
      series: this.categoriasdata.map(item => item.Cantidad),
      
      labels: this.categoriasdata.map(item => item.Categoria) ,
      chart: {
        height: 300,
        type: "donut",
      },
      legend: {
        position: "bottom",
      },
      dataLabels: {
        dropShadow: {
          enabled: false,
        },
      },
      colors: colors,
      tooltip: {
      y: {
        formatter: (val: number, opts: any) => {
          // opts contains info about the hovered slice
          const label = opts.w.globals.labels[opts.seriesIndex];
          // You can access more data from this.categoriasdata if needed
          return `${label}: ${val} compras`;
        }
      }
    }
    };


    const attributeToMonitor = 'data-theme';

    const observer = new MutationObserver(() => {
      this._simpleDonutChart('["--tb-primary", "--tb-success", "--tb-warning", "--tb-danger", "--tb-info"]');
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [attributeToMonitor]
    });
  }

  private cargardatos(): void {
      // this.mostrarOverlayCarga = true;
      this.http.get(`${environment.apiBaseUrl}/Dashboards/VentasPorMes`, {
        headers: { 'x-api-key': environment.apiKey }
      }).subscribe({
        next: data => {

          console.log('Datos de ventas por mes:', data);
          
          // console.log('añong', new Date().getFullYear());
          this.ventasPorMesData = data as any[];

          
          this.anioSeleccionado = this.ventasPorMesData.sort((a, b) => b.Anio - a.Anio)[0]?.Anio;
          this.aniosSelect = this.ventasPorMesData.map(item => item.Anio)
                                  .filter((anio, index, self) => self.indexOf(anio) === index);
          console.log('añong22', this.anioSeleccionado);
          
          this._totalrevenueChart('["--table table-gridjs"]');

          // this.chart = new ApexCharts(document.querySelector(".apex-charts"), this.totalrevenueChart);
          // this.chart.render();          


          // this.chart.updateOptions(this.totalrevenueChart);
          // this.ventasPorMesData = data as any[];


          
        },
        error: error => {
          console.error('Error al cargar roles:', error);
          
        }
      });
    }

    private cargardatosCategorias(): void {
      // this.mostrarOverlayCarga = true;
      const apibody: any = {
        mes: this.barraMesSelected.Mes,
        anio: this.barraMesSelected.Anio,
        cate_Id: 0
      };

      this.http.post(`${environment.apiBaseUrl}/Dashboards/VentasPorMesCategorias`, 
        apibody,
        {
        headers: { 'x-api-key': environment.apiKey }
      }).subscribe({
        next: data => {

          console.log('Datos de ventas por mes:', data);
          this.categoriasdata = data as any[];
          
          this._simpleDonutChart('["--tb-primary", "--tb-success", "--tb-warning", "--tb-danger", "--tb-info"]');

          
        },
        error: error => {
          console.error('Error al cargar categorias:', error);
          
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

  cambioAnio(): void {
    
    this._totalrevenueChart('["--table table-gridjs"]');
    // this.chart = new ApexCharts(document.querySelector(".apex-charts"), this.totalrevenueChart);
    // this.chart.updateptions(this.totalrevenueChart);

    console.log('ventas meses luego', this.ventasPorMesData);
    
  }

  onBarClick(category: string, value: any) {
  // Do something with the clicked bar info
    console.log('Clicked bar:', category, value);
    console.log('Barra seleccionada:', this.barraMesSelected);
    // this.graficocategorias = true;

    this.ngZone.run(() => {
      this.cargardatosCategorias();
      this.graficocategorias = true;
      this.cdr.detectChanges();
    });
    
    
}

}

