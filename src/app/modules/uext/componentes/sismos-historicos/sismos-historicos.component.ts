import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LectorDemoComponent } from '../../pages/lector-demo/lector-demo.component';

@Component({
  selector: 'app-sismos-historicos',
  templateUrl: './sismos-historicos.component.html',
  styleUrls: ['./sismos-historicos.component.css']
})
export class SismosHistoricosComponent implements OnInit {

  data =[
    {
     "Fecha": "1966/10/17",
     "Hora": "16:41:58",
     "Ref": "M",
     "Magnitud": "8.0",
     "Estacion": "PRQ ",
     "Ubicacion": "Parque de la Reserva, Cercado de Lima, Lima",
     "pga": -269.29,
     "Archivo": "19661017214158_PRQ.txt"
    },
    {
     "Fecha": "1970/05/31",
     "Hora": "15:23:32",
     "Ref": "M",
     "Magnitud": 7.8,
     "Estacion": "PRQ ",
     "Ubicacion": "Parque de la Reserva, Cercado de Lima, Lima",
     "pga": -104.87,
     "Archivo": "19700531202332_PRQ.txt"
    },
    {
     "Fecha": "1974/10/03",
     "Hora": "09:21:34",
     "Ref": "M",
     "Magnitud": 7.7,
     "Estacion": "PRQ ",
     "Ubicacion": "Parque de la Reserva, Cercado de Lima, Lima",
     "pga": -192.58,
     "Archivo": "19741003142134_PRQ.txt"
    },
    {
     "Fecha": "1974/10/04",
     "Hora": "09:21:34",
     "Ref": "M",
     "Magnitud": 7.7,
     "Estacion": "SURCO",
     "Ubicacion": "Dr. DHO, Surco, Lima",
     "pga": -207.35,
     "Archivo": "19741003142134_SURCO.txt"
    },
    {
     "Fecha": "1974/11/09",
     "Hora": "07:59:55",
     "Ref": "M",
     "Magnitud": 7.2,
     "Estacion": "PRQ",
     "Ubicacion": "Parque de la Reserva, Cercado de Lima, Lima",
     "pga": -69.96,
     "Archivo": "19741109125955_PRQ.txt"
    },
    {
     "Fecha": "1974/11/09",
     "Hora": "07:59:55",
     "Ref": "M",
     "Magnitud": 7.2,
     "Estacion": "UNALM ",
     "Ubicacion": "Universidad Nacional Agraria La Molina, La Molina, Lima",
     "pga": -117.08,
     "Archivo": "19741109125955_UNALM.txt"
    },
    {
     "Fecha": "2001/06/23",
     "Hora": "15:33:14",
     "Ref": "M",
     "Magnitud": 8.4,
     "Estacion": "MOQ1 ",
     "Ubicacion": "Complejo Deportivo Rolando Catacora - Gobierno Regional de Moquegua, Mariscal Nieto, Moquegua",
     "pga": -295.15,
     "Archivo": "20010623203314_MOQ1.txt"
    },
    {
     "Fecha": "2001/07/07",
     "Hora": "04:38:39",
     "Ref": "M",
     "Magnitud": 7.6,
     "Estacion": "UJBG1",
     "Ubicacion": "Universidad Nacional Jorge Basadre Grohmann, Tacna, Tacna",
     "pga": 40.42,
     "Archivo": "20010707093839_UJBG1.txt"
    },
    {
     "Fecha": "2001/07/07",
     "Hora": "04:38:39",
     "Ref": "M",
     "Magnitud": 7.6,
     "Estacion": "UNSA1",
     "Ubicacion": "Universidad Nacional San Agustín de Arequipa, Arequipa, Arequipa",
     "pga": -123.21,
     "Archivo": "20010707093839_UNSA1.txt"
    },
    {
     "Fecha": "2005/06/13",
     "Hora": "17:44:33",
     "Ref": "mwb",
     "Magnitud": 7.8,
     "Estacion": "MOQ1 ",
     "Ubicacion": "Complejo Deportivo Rolando Catacora - Gobierno Regional de Moquegua, Mariscal Nieto, Moquegua",
     "pga": 65.83,
     "Archivo": "20050613224433_MOQ1.txt"
    },
    {
     "Fecha": "2005/06/13",
     "Hora": "17:44:33",
     "Ref": "mwb",
     "Magnitud": 7.8,
     "Estacion": "MOQ3",
     "Ubicacion": "Gobierno Regional de Moquegua, Mariscal Nieto, Moquegua",
     "pga": -60.94,
     "Archivo": "20050613224433_MOQ3.txt"
    },
    {
     "Fecha": "2005/06/13",
     "Hora": "17:44:33",
     "Ref": "mwb",
     "Magnitud": 7.8,
     "Estacion": "MOQ2 ",
     "Ubicacion": "Planta de Tratamiento de Agua de Moquegua, Mariscal Nieto, Moquegua",
     "pga": -81.06,
     "Archivo": "20050613224433_MOQ2.txt"
    },
    {
     "Fecha": "2005/06/13",
     "Hora": "17:44:33",
     "Ref": "mwb",
     "Magnitud": 7.8,
     "Estacion": "UJBG1",
     "Ubicacion": "Universidad Nacional Jorge Basadre Grohmann, Tacna, Tacna",
     "pga": -94.18,
     "Archivo": "20050613224433_UJBG1.txt"
    },
    {
     "Fecha": "2005/06/13",
     "Hora": "17:44:33",
     "Ref": "mwb",
     "Magnitud": 7.8,
     "Estacion": "UNSA3 ",
     "Ubicacion": "Universidad Nacional San Agustín de Arequipa - Instituto Geofísico, Characato, Arequipa",
     "pga": -138.5,
     "Archivo": "20050613224433_UNSA3.txt"
    },
    {
     "Fecha": "2005/06/13",
     "Hora": "17:44:33",
     "Ref": "mwb",
     "Magnitud": 7.8,
     "Estacion": "UNSA1 ",
     "Ubicacion": "Universidad Nacional San Agustín de Arequipa, Arequipa, Arequipa",
     "pga": -80.92,
     "Archivo": "20050613224433_UNSA1.txt"
    },
    {
     "Fecha": "2005/06/13",
     "Hora": "17:44:33",
     "Ref": "mwb",
     "Magnitud": 7.8,
     "Estacion": "UPT",
     "Ubicacion": "Universidad Privada de Tacna, Tacna, Tacna",
     "pga": 119.11,
     "Archivo": "20050613224433_UPT.txt"
    },
    {
     "Fecha": "2005/09/25",
     "Hora": "20:55:37",
     "Ref": "M",
     "Magnitud": 7.5,
     "Estacion": "JALVA ",
     "Ubicacion": "Centro Peruano Japonés de Investigaciones Sísmicas y Mitigación de Desastres, Rímac, Lima",
     "pga": 14.66,
     "Archivo": "20050926015537_JALVA.txt"
    },
    {
     "Fecha": "2005/09/25",
     "Hora": "20:55:37",
     "Ref": "M",
     "Magnitud": 7.5,
     "Estacion": "LMOLI ",
     "Ubicacion": "Dr. JRPP, La Molina, Lima",
     "pga": -17.1,
     "Archivo": "20050926015537_LMOLI.txt"
    },
    {
     "Fecha": "2005/09/25",
     "Hora": "20:55:37",
     "Ref": "M",
     "Magnitud": 7.5,
     "Estacion": "MOYOB",
     "Ubicacion": "Vivienda, Moyobamba, San Martín",
     "pga": -131.44,
     "Archivo": "20050926015537_MOYOB.txt"
    },
    {
     "Fecha": "2007/08/15",
     "Hora": "18:40:53",
     "Ref": "M",
     "Magnitud": "8.0",
     "Estacion": "JALVA",
     "Ubicacion": "Centro Peruano Japonés de Investigaciones Sísmicas y Mitigación de Desastres, Rímac, Lima",
     "pga": -73.89,
     "Archivo": "20070815234053_JALVA.txt"
    },
    {
     "Fecha": "2007/08/15",
     "Hora": "18:40:53",
     "Ref": "M",
     "Magnitud": "8.0",
     "Estacion": "CIPC",
     "Ubicacion": "Colegio de Ingenieros del Perú - Consejo Departamental de Lima, San Isidro, Lima",
     "pga": 58.79,
     "Archivo": "20070815234053_CIPCL.txt"
    },
    {
     "Fecha": "2007/08/15",
     "Hora": "18:40:53",
     "Ref": "M",
     "Magnitud": "8.0",
     "Estacion": "DHN",
     "Ubicacion": "Dirección de Hidrografía y Navegación de la Marina de Guerra del Perú, Callao, Callao",
     "pga": 101.01,
     "Archivo": "20070815234053_DHN.txt"
    },
    {
     "Fecha": "2007/08/15",
     "Hora": "18:40:53",
     "Ref": "M",
     "Magnitud": "8.0",
     "Estacion": "LMOLI ",
     "Ubicacion": "Dr. JRPP, La Molina, Lima",
     "pga": 78.73,
     "Archivo": "20070815234053_LMOLI.txt"
    },
    {
     "Fecha": "2007/08/15",
     "Hora": "18:40:53",
     "Ref": "M",
     "Magnitud": "8.0",
     "Estacion": "UNSA3",
     "Ubicacion": "Universidad Nacional San Agustín de Arequipa - Instituto Geofísico, Characato, Arequipa",
     "pga": 9.58,
     "Archivo": "20070815234053_UNSA3.txt"
    },
    {
     "Fecha": "2007/08/15",
     "Hora": "18:40:53",
     "Ref": "M",
     "Magnitud": "8.0",
     "Estacion": "UNICA",
     "Ubicacion": "Universidad Nacional San Luis Gonzaga de Ica, Ica, Ica",
     "pga": -272.21,
     "Archivo": "20070815234053_UNICA.txt"
    },
    {
     "Fecha": "2014/04/01",
     "Hora": "18:46:47",
     "Ref": "mww",
     "Magnitud": 8.2,
     "Estacion": "MOQ1",
     "Ubicacion": "Complejo Deportivo Rolando Catacora - Gobierno Regional de Moquegua, Mariscal Nieto, Moquegua",
     "pga": -51.5,
     "Archivo": "20140401234647_MOQ1.txt"
    },
    {
     "Fecha": "2014/04/01",
     "Hora": "18:46:47",
     "Ref": "mww",
     "Magnitud": 8.2,
     "Estacion": "UJCM",
     "Ubicacion": "Universidad José Carlos Mariátegui, Mariscal Nieto, Moquegua",
     "pga": -52.22,
     "Archivo": "20140401234647_UJCM.txt"
    },
    {
     "Fecha": "2014/04/01",
     "Hora": "18:46:47",
     "Ref": "mww",
     "Magnitud": 8.2,
     "Estacion": "UJBG1",
     "Ubicacion": "Universidad Nacional Jorge Basadre Grohmann, Tacna, Tacna",
     "pga": 72.49,
     "Archivo": "20140401234647_UJBG1.txt"
    },
    {
     "Fecha": "2014/04/01",
     "Hora": "18:46:47",
     "Ref": "mww",
     "Magnitud": 8.2,
     "Estacion": "UPT",
     "Ubicacion": "Universidad Privada de Tacna, Tacna, Tacna",
     "pga": -71.29,
     "Archivo": "20140401234647_UPT.txt"
    },
    {
     "Fecha": "2014/04/02",
     "Hora": "21:43:13",
     "Ref": "mww",
     "Magnitud": 7.7,
     "Estacion": "UJBG1",
     "Ubicacion": "Universidad Nacional Jorge Basadre Grohmann, Tacna, Tacna",
     "pga": 32.59,
     "Archivo": "20140403024313_UJBG1.txt"
    },
    {
     "Fecha": "2014/04/02",
     "Hora": "21:43:13",
     "Ref": "mww",
     "Magnitud": 7.7,
     "Estacion": "UPT ",
     "Ubicacion": "Universidad Privada de Tacna, Tacna, Tacna",
     "pga": -30.93,
     "Archivo": "20140403024313_UJBG1.txt"
    },
    {
     "Fecha": "2019/05/26",
     "Hora": "02:41:16",
     "Ref": "M",
     "Magnitud": "8.0",
     "Estacion": "JALVA ",
     "Ubicacion": "Centro Peruano Japonés de Investigaciones Sísmicas y Mitigación de Desastres, Rímac, Lima",
     "pga": 30.26,
     "Archivo": "20190526074116_JALVA.txt"
    },
    {
     "Fecha": "2019/05/26",
     "Hora": "02:41:16",
     "Ref": "M",
     "Magnitud": "8.0",
     "Estacion": "SCIQU ",
     "Ubicacion": "Gerencia Zonal SENCICO, Iquitos, Loreto",
     "pga": -81.08,
     "Archivo": "20190526074116_SCIQU.txt"
    },
    {
     "Fecha": "2019/05/26",
     "Hora": "02:41:16",
     "Ref": "M",
     "Magnitud": "8.0",
     "Estacion": "SCPIU",
     "Ubicacion": "Gerencia Zonal SENCICO, Piura, Piura",
     "pga": 20.84,
     "Archivo": "20190526074116_SCPIU.txt"
    },
    {
     "Fecha": "2019/05/26",
     "Hora": "02:41:16",
     "Ref": "M",
     "Magnitud": "8.0",
     "Estacion": "SCTRU",
     "Ubicacion": "Gerencia Zonal SENCICO, Trujillo, La Libertad",
     "pga": 44.67,
     "Archivo": "20190526074116_SCTRU.txt"
    },
    {
     "Fecha": "2019/05/26",
     "Hora": "02:41:16",
     "Ref": "M",
     "Magnitud": "8.0",
     "Estacion": "SROSA",
     "Ubicacion": "Municipalidad Distrital de Santa Rosa, Santa Rosa, Lima",
     "pga": 42.5,
     "Archivo": "20190526074116_SROSA.txt"
    },
    {
     "Fecha": "2019/05/26",
     "Hora": "02:41:16",
     "Ref": "M",
     "Magnitud": "8.0",
     "Estacion": "UNFV ",
     "Ubicacion": "Universidad Nacional Federico Villarreal - Facultad de Ingenieria Civil, Magdalena del Mar, Lima",
     "pga": 10.23,
     "Archivo": "20190526074116_UNFV.txt"
    },
    {
     "Fecha": "2019/05/26",
     "Hora": "02:41:16",
     "Ref": "M",
     "Magnitud": "8.0",
     "Estacion": "UPCSM ",
     "Ubicacion": "Universidad Peruana de Ciencias Aplicada - HUB de Laboratorios, San Miguel, Lima",
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

  Close() {
    let data = {
      "endpoint" : ''
    }
    this.matDialogRef.close(data)
  }

  sendUrlData(endpoint : string){
    let data = {
      "endpoint" : endpoint
    }
    this.matDialogRef.close(data)
  }

  getColor(numero: any): string {
    if (numero < 4.5) {
      return 'green'; 
    } else if (numero >= 4.5 && numero < 6) {
      return 'yellow'; 
    } else {
      return 'red';
    }
  }

}
