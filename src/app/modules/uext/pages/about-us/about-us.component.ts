import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {

  team = [
    {
      "name": "Lucio",
      "lastname": "Estacio",
      "cargo": "COO - Nuevo Control",
      "titulo": "Ing. Civil",
      "descripcion": "Lucio Estacio es egresado de la Facultad de Ingeniería Civil (FIC), de la Universidad Nacional de Ingeniería (UNI). Lucio ha estado a cargo de la instrumentación de la red acelerográfica REDACIS del Centro Peruano Japones de Investigaciones sísmicas y Mitigación de Desastres, también estuvo a cargo de instrumentar la red de acelerógrafos del Servicio Nacional de Capacitación para la Industria de la Construcción (SENCICO), actualmente trabaja en el Centro de Cómputo de la FIC-UNI y es COO de la empresa Nuevo Control EIRL, donde ha elaborado múltiples sistemas de computación con el objetivo de procesar información para gestionar mejor el riesgo sísmico en el Perú.",
      "img": "/assets/lucio.png"
    },
    {
      "name": "Pedro",
      "lastname": "Cruz",
      "cargo": "Junior Developer",
      "titulo": "Egresado URP (ESC-INF)",
      "descripcion": "Desarrollador de servicios web para el análisis de eventos acelerográficos, aplicando conocimientos previos en el manejo de datos en tiempo real y la implementación de soluciones escalables.",
      "img": "/assets/pedro.jpeg"
    },
  ]

  mostrarTextosCompleto: boolean[] = new Array(this.team.length).fill(false);

  constructor() { }

  ngOnInit(): void {
  }

  mostrarTextoCompleto: boolean = false;

  toggleTextoCompleto(index: number): void {
    this.mostrarTextosCompleto[index] = !this.mostrarTextosCompleto[index];
  }

}
