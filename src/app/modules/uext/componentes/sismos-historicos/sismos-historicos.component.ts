import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LectorDemoComponent } from '../../pages/lector-demo/lector-demo.component';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-sismos-historicos',
  templateUrl: './sismos-historicos.component.html',
  styleUrls: ['./sismos-historicos.component.css']
})
export class SismosHistoricosComponent implements OnInit {

  myControl = new FormControl('')
  options: string[] = []
  filteredOptions !: Observable<string[]>
  ordenSeleccionado = ''
  buscarTexto = ''
  data = [
    {
      "Fecha": "1966\/10\/17",
      "Hora": "16:41:58",
      "Magnitud": "M",
      "Ref": "8.0",
      "Estacion": "PRQ",
      "Ubicacion": "Cercado de Lima, Lima",
      "Lugar": "Parque de la Reserva",
      "pga": -269.29,
      "Archivo": "19661017214158_PRQ.txt"
    },
    {
      "Fecha": "1970\/05\/31",
      "Hora": "15:23:32",
      "Magnitud": "M",
      "Ref": "7.8",
      "Estacion": "PRQ",
      "Ubicacion": "Cercado de Lima, Lima",
      "Lugar": "Parque de la Reserva",
      "pga": -104.87,
      "Archivo": "19700531202332_PRQ.txt"
    },
    {
      "Fecha": "1974\/10\/03",
      "Hora": "9:21:34",
      "Magnitud": "M",
      "Ref": "7.7",
      "Estacion": "PRQ",
      "Ubicacion": "Cercado de Lima, Lima",
      "Lugar": "Parque de la Reserva",
      "pga": -192.58,
      "Archivo": "19741003142134_PRQ.txt"
    },
    {
      "Fecha": "1974\/10\/04",
      "Hora": "9:21:34",
      "Magnitud": "M",
      "Ref": "7.7",
      "Estacion": "SURCO",
      "Ubicacion": "Surco, Lima",
      "Lugar": "Dr. DHO",
      "pga": -207.35,
      "Archivo": "19741003142134_SURCO.txt"
    },
    {
      "Fecha": "1974\/11\/09",
      "Hora": "7:59:55",
      "Magnitud": "M",
      "Ref": "7.2",
      "Estacion": "PRQ",
      "Ubicacion": "Cercado de Lima, Lima",
      "Lugar": "Parque de la Reserva",
      "pga": -69.96,
      "Archivo": "19741109125955_PRQ.txt"
    },
    {
      "Fecha": "1974\/11\/09",
      "Hora": "7:59:55",
      "Magnitud": "M",
      "Ref": "7.2",
      "Estacion": "UNALM",
      "Ubicacion": "La Molina, Lima",
      "Lugar": "Universidad Nacional Agraria La Molina",
      "pga": -117.08,
      "Archivo": "19741109125955_UNALM.txt"
    },
    {
      "Fecha": "2001\/06\/23",
      "Hora": "15:33:14",
      "Magnitud": "M",
      "Ref": "8.4",
      "Estacion": "MOQ1",
      "Ubicacion": "Mariscal Nieto, Moquegua",
      "Lugar": "Complejo Deportivo Rolando Catacora - Gobierno Regional de Moquegua",
      "pga": -295.15,
      "Archivo": "20010623203314_MOQ1.txt"
    },
    {
      "Fecha": "2001\/07\/07",
      "Hora": "4:38:39",
      "Magnitud": "M",
      "Ref": "7.6",
      "Estacion": "UJBG1",
      "Ubicacion": "Tacna, Tacna",
      "Lugar": "Universidad Nacional Jorge Basadre Grohmann",
      "pga": 40.42,
      "Archivo": "20010707093839_UJBG1.txt"
    },
    {
      "Fecha": "2001\/07\/07",
      "Hora": "4:38:39",
      "Magnitud": "M",
      "Ref": "7.6",
      "Estacion": "UNSA1",
      "Ubicacion": "Arequipa, Arequipa",
      "Lugar": "Universidad Nacional San Agustín de Arequipa",
      "pga": -123.21,
      "Archivo": "20010707093839_UNSA1.txt"
    },
    {
      "Fecha": "2005\/06\/13",
      "Hora": "17:44:33",
      "Magnitud": "mwb",
      "Ref": "7.8",
      "Estacion": "MOQ1",
      "Ubicacion": "Mariscal Nieto, Moquegua",
      "Lugar": "Complejo Deportivo Rolando Catacora - Gobierno Regional de Moquegua",
      "pga": 65.83,
      "Archivo": "20050613224433_MOQ1.txt"
    },
    {
      "Fecha": "2005\/06\/13",
      "Hora": "17:44:33",
      "Magnitud": "mwb",
      "Ref": "7.8",
      "Estacion": "MOQ3",
      "Ubicacion": "Mariscal Nieto, Moquegua",
      "Lugar": "Gobierno Regional de Moquegua",
      "pga": -60.94,
      "Archivo": "20050613224433_MOQ3.txt"
    },
    {
      "Fecha": "2005\/06\/13",
      "Hora": "17:44:33",
      "Magnitud": "mwb",
      "Ref": "7.8",
      "Estacion": "MOQ2",
      "Ubicacion": "Mariscal Nieto, Moquegua",
      "Lugar": "Planta de Tratamiento de Agua de Moquegua",
      "pga": -81.06,
      "Archivo": "20050613224433_MOQ2.txt"
    },
    {
      "Fecha": "2005\/06\/13",
      "Hora": "17:44:33",
      "Magnitud": "mwb",
      "Ref": "7.8",
      "Estacion": "UJBG1",
      "Ubicacion": "Tacna, Tacna",
      "Lugar": "Universidad Nacional Jorge Basadre Grohmann",
      "pga": -94.18,
      "Archivo": "20050613224433_UJBG1.txt"
    },
    {
      "Fecha": "2005\/06\/13",
      "Hora": "17:44:33",
      "Magnitud": "mwb",
      "Ref": "7.8",
      "Estacion": "UNSA3",
      "Ubicacion": "Characato, Arequipa",
      "Lugar": "Universidad Nacional San Agustín de Arequipa - Instituto Geofísico",
      "pga": -138.5,
      "Archivo": "20050613224433_UNSA3.txt"
    },
    {
      "Fecha": "2005\/06\/13",
      "Hora": "17:44:33",
      "Magnitud": "mwb",
      "Ref": "7.8",
      "Estacion": "UNSA1",
      "Ubicacion": "Arequipa, Arequipa",
      "Lugar": "Universidad Nacional San Agustín de Arequipa",
      "pga": -80.92,
      "Archivo": "20050613224433_UNSA1.txt"
    },
    {
      "Fecha": "2005\/06\/13",
      "Hora": "17:44:33",
      "Magnitud": "mwb",
      "Ref": "7.8",
      "Estacion": "UPT",
      "Ubicacion": "Tacna, Tacna",
      "Lugar": "Universidad Privada de Tacna",
      "pga": 119.11,
      "Archivo": "20050613224433_UPT.txt"
    },
    {
      "Fecha": "2005\/09\/25",
      "Hora": "20:55:37",
      "Magnitud": "M",
      "Ref": "7.5",
      "Estacion": "JALVA",
      "Ubicacion": "Rímac, Lima",
      "Lugar": "Centro Peruano Japonés de Investigaciones Sísmicas y Mitigación de Desastres",
      "pga": 14.66,
      "Archivo": "20050926015537_JALVA.txt"
    },
    {
      "Fecha": "2005\/09\/25",
      "Hora": "20:55:37",
      "Magnitud": "M",
      "Ref": "7.5",
      "Estacion": "LMOLI",
      "Ubicacion": "La Molina, Lima",
      "Lugar": "Dr. JRPP",
      "pga": -17.1,
      "Archivo": "20050926015537_LMOLI.txt"
    },
    {
      "Fecha": "2005\/09\/25",
      "Hora": "20:55:37",
      "Magnitud": "M",
      "Ref": "7.5",
      "Estacion": "MOYOB",
      "Ubicacion": "Moyobamba, San Martín",
      "Lugar": "Vivienda",
      "pga": -131.44,
      "Archivo": "20050926015537_MOYOB.txt"
    },
    {
      "Fecha": "2007\/08\/15",
      "Hora": "18:40:53",
      "Magnitud": "M",
      "Ref": "8.0",
      "Estacion": "JALVA",
      "Ubicacion": "Rímac, Lima",
      "Lugar": "Centro Peruano Japonés de Investigaciones Sísmicas y Mitigación de Desastres",
      "pga": -73.89,
      "Archivo": "20070815234053_JALVA.txt"
    },
    {
      "Fecha": "2007\/08\/15",
      "Hora": "18:40:53",
      "Magnitud": "M",
      "Ref": "8.0",
      "Estacion": "CIPCL",
      "Ubicacion": "San Isidro, Lima",
      "Lugar": "Colegio de Ingenieros del Perú - Consejo Departamental de Lima",
      "pga": 58.79,
      "Archivo": "20070815234053_CIPCL.txt"
    },
    {
      "Fecha": "2007\/08\/15",
      "Hora": "18:40:53",
      "Magnitud": "M",
      "Ref": "8.0",
      "Estacion": "DHN",
      "Ubicacion": "Callao, Callao",
      "Lugar": "Dirección de Hidrografía y Navegación de la Marina de Guerra del Perú",
      "pga": 101.01,
      "Archivo": "20070815234053_DHN.txt"
    },
    {
      "Fecha": "2007\/08\/15",
      "Hora": "18:40:53",
      "Magnitud": "M",
      "Ref": "8.0",
      "Estacion": "LMOLI",
      "Ubicacion": "La Molina, Lima",
      "Lugar": "Dr. JRPP",
      "pga": 78.73,
      "Archivo": "20070815234053_LMOLI.txt"
    },
    {
      "Fecha": "2007\/08\/15",
      "Hora": "18:40:53",
      "Magnitud": "M",
      "Ref": "8.0",
      "Estacion": "UNSA3",
      "Ubicacion": "Characato, Arequipa",
      "Lugar": "Universidad Nacional San Agustín de Arequipa - Instituto Geofísico",
      "pga": 9.58,
      "Archivo": "20070815234053_UNSA3.txt"
    },
    {
      "Fecha": "2007\/08\/15",
      "Hora": "18:40:53",
      "Magnitud": "M",
      "Ref": "8.0",
      "Estacion": "UNICA",
      "Ubicacion": "Ica, Ica",
      "Lugar": "Universidad Nacional San Luis Gonzaga de Ica",
      "pga": -272.21,
      "Archivo": "20070815234053_UNICA.txt"
    },
    {
      "Fecha": "2014\/04\/01",
      "Hora": "18:46:47",
      "Magnitud": "mww",
      "Ref": "8.2",
      "Estacion": "MOQ1",
      "Ubicacion": "Mariscal Nieto, Moquegua",
      "Lugar": "Complejo Deportivo Rolando Catacora - Gobierno Regional de Moquegua",
      "pga": -51.5,
      "Archivo": "20140401234647_MOQ1.txt"
    },
    {
      "Fecha": "2014\/04\/01",
      "Hora": "18:46:47",
      "Magnitud": "mww",
      "Ref": "8.2",
      "Estacion": "UJCM",
      "Ubicacion": "Mariscal Nieto, Moquegua",
      "Lugar": "Universidad José Carlos Mariátegui",
      "pga": -52.22,
      "Archivo": "20140401234647_UJCM.txt"
    },
    {
      "Fecha": "2014\/04\/01",
      "Hora": "18:46:47",
      "Magnitud": "mww",
      "Ref": "8.2",
      "Estacion": "UJBG1",
      "Ubicacion": "Tacna, Tacna",
      "Lugar": "Universidad Nacional Jorge Basadre Grohmann",
      "pga": 72.49,
      "Archivo": "20140401234647_UJBG1.txt"
    },
    {
      "Fecha": "2014\/04\/01",
      "Hora": "18:46:47",
      "Magnitud": "mww",
      "Ref": "8.2",
      "Estacion": "UPT",
      "Ubicacion": "Tacna, Tacna",
      "Lugar": "Universidad Privada de Tacna",
      "pga": -71.29,
      "Archivo": "20140401234647_UPT.txt"
    },
    {
      "Fecha": "2014\/04\/02",
      "Hora": "21:43:13",
      "Magnitud": "mww",
      "Ref": "7.7",
      "Estacion": "UJBG1",
      "Ubicacion": "Tacna, Tacna",
      "Lugar": "Universidad Nacional Jorge Basadre Grohmann",
      "pga": 32.59,
      "Archivo": "20140403024313_UJBG1.txt"
    },
    {
      "Fecha": "2014\/04\/02",
      "Hora": "21:43:13",
      "Magnitud": "mww",
      "Ref": "7.7",
      "Estacion": "UPT",
      "Ubicacion": "Tacna, Tacna",
      "Lugar": "Universidad Privada de Tacna",
      "pga": -30.93,
      "Archivo": "20140403024313_UJBG1.txt"
    },
    {
      "Fecha": "2019\/05\/26",
      "Hora": "2:41:16",
      "Magnitud": "M",
      "Ref": "8.0",
      "Estacion": "JALVA",
      "Ubicacion": "Rímac, Lima",
      "Lugar": "Centro Peruano Japonés de Investigaciones Sísmicas y Mitigación de Desastres",
      "pga": 30.26,
      "Archivo": "20190526074116_JALVA.txt"
    },
    {
      "Fecha": "2019\/05\/26",
      "Hora": "2:41:16",
      "Magnitud": "M",
      "Ref": "8.0",
      "Estacion": "SCIQU",
      "Ubicacion": "Iquitos, Loreto",
      "Lugar": "Gerencia Zonal SENCICO",
      "pga": -81.08,
      "Archivo": "20190526074116_SCIQU.txt"
    },
    {
      "Fecha": "2019\/05\/26",
      "Hora": "2:41:16",
      "Magnitud": "M",
      "Ref": "8.0",
      "Estacion": "SCPIU",
      "Ubicacion": "Piura, Piura",
      "Lugar": "Gerencia Zonal SENCICO",
      "pga": 20.84,
      "Archivo": "20190526074116_SCPIU.txt"
    },
    {
      "Fecha": "2019\/05\/26",
      "Hora": "2:41:16",
      "Magnitud": "M",
      "Ref": "8.0",
      "Estacion": "SCTRU",
      "Ubicacion": "Trujillo, La Libertad",
      "Lugar": "Gerencia Zonal SENCICO",
      "pga": 44.67,
      "Archivo": "20190526074116_SCTRU.txt"
    },
    {
      "Fecha": "2019\/05\/26",
      "Hora": "2:41:16",
      "Magnitud": "M",
      "Ref": "8.0",
      "Estacion": "SROSA",
      "Ubicacion": "Santa Rosa, Lima",
      "Lugar": "Municipalidad Distrital de Santa Rosa",
      "pga": 42.5,
      "Archivo": "20190526074116_SROSA.txt"
    },
    {
      "Fecha": "2019\/05\/26",
      "Hora": "2:41:16",
      "Magnitud": "M",
      "Ref": "8.0",
      "Estacion": "UNFV",
      "Ubicacion": "Magdalena del Mar, Lima",
      "Lugar": "Universidad Nacional Federico Villarreal - Facultad de Ingenieria Civil",
      "pga": 10.23,
      "Archivo": "20190526074116_UNFV.txt"
    },
    {
      "Fecha": "2019\/05\/26",
      "Hora": "2:41:16",
      "Magnitud": "M",
      "Ref": "8.0",
      "Estacion": "UPCSM",
      "Ubicacion": "San Miguel, Lima",
      "Lugar": "Universidad Peruana de Ciencias Aplicada - HUB de Laboratorios",
      "pga": -17.3,
      "Archivo": "20190526074116_UPCSM.txt"
    }
  ]

  constructor(
    private matDialogRef: MatDialogRef<LectorDemoComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public opcion: any
  ) { }

  ngOnInit(): void {

  }

  filterDataT(data: any): boolean {
    const searchLower = this.buscarTexto.toLowerCase();
    return data.Ref.toLowerCase().includes(searchLower) ||
      data.Estacion.toLowerCase().includes(searchLower) ||
      data.Ubicacion.toLowerCase().includes(searchLower)||
      data.Fecha.toLowerCase().includes(searchLower) ;
  }

  Close() {
    let data = {
      "endpoint": ''
    }
    this.matDialogRef.close(data)
  }

  sendUrlData(endpoint: string) {
    let data = {
      "endpoint": endpoint
    }
    this.matDialogRef.close(data)
  }

  getColor(numero: any): string {
    const num = parseFloat(numero)

    if (num < 8.0) {
      return 'yellow';
    } else {
      return '#ff7300';
    }

  }

}
