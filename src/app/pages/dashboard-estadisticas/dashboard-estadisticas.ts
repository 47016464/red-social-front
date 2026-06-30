import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Rocket, Home, User, LogOut } from 'lucide-angular';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import { ChartConfiguration, ChartData } from 'chart.js';
import { EstadisticasService } from '../../services/estadisticas.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard-estadisticas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule, BaseChartDirective],
  templateUrl: './dashboard-estadisticas.html',
  styleUrl: './dashboard-estadisticas.css',
})
export class DashboardEstadisticasComponent implements OnInit {
  readonly Rocket = Rocket; readonly Home = Home;
  readonly User = User; readonly LogOut = LogOut;

  // Filtros de fecha
  desde = signal('');
  hasta = signal('');
  cargando = signal(false);

  // Gráfico 1: Publicaciones por usuario (torta)
  chartPubLabels: string[] = [];
  chartPubData: ChartData<'pie'> = { labels: [], datasets: [] };
  chartPubOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    plugins: { legend: { position: 'right', labels: { color: '#9098b1' } } }
  };

  // Gráfico 2: Comentarios por tiempo (línea)
  chartComTimeLabels: string[] = [];
  chartComTimeData: ChartData<'line'> = { labels: [], datasets: [] };
  chartComTimeOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: { legend: { labels: { color: '#9098b1' } } },
    scales: {
      x: { ticks: { color: '#9098b1' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#9098b1' }, grid: { color: 'rgba(255,255,255,0.05)' }, beginAtZero: true }
    }
  };

  // Gráfico 3: Comentarios por publicación (barras)
  chartComPubLabels: string[] = [];
  chartComPubData: ChartData<'bar'> = { labels: [], datasets: [] };
  chartComPubOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: { legend: { labels: { color: '#9098b1' } } },
    scales: {
      x: { ticks: { color: '#9098b1' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#9098b1' }, grid: { color: 'rgba(255,255,255,0.05)' }, beginAtZero: true }
    }
  };

  constructor(
    private estadisticasService: EstadisticasService,
    private authService: AuthService,
  ) {}

  ngOnInit() { this.cargarTodo(); }

  cargarTodo() {
    this.cargando.set(true);
    const d = this.desde() || undefined;
    const h = this.hasta() || undefined;

    // Gráfico 1
    this.estadisticasService.publicacionesPorUsuario(d, h).subscribe({
      next: (data: any[]) => {
        this.chartPubData = {
          labels: data.map((d: any) => d.nombre || d.username),
          datasets: [{
            data: data.map((d: any) => d.cantidad),
            backgroundColor: ['#7c6ef7','#38bdf8','#22c55e','#fbbf24','#ef4444','#a78bfa','#34d399'],
          }]
        };
      }
    });

    // Gráfico 2
    this.estadisticasService.comentariosPorTiempo(d, h).subscribe({
      next: (data: any[]) => {
        this.chartComTimeData = {
          labels: data.map((d: any) => d.fecha),
          datasets: [{
            label: 'Comentarios',
            data: data.map((d: any) => d.cantidad),
            borderColor: '#7c6ef7',
            backgroundColor: 'rgba(124,110,247,0.1)',
            fill: true,
            tension: 0.4,
          }]
        };
        this.cargando.set(false);
      }
    });

    // Gráfico 3
    this.estadisticasService.comentariosPorPublicacion(d, h).subscribe({
      next: (data: any[]) => {
        this.chartComPubData = {
          labels: data.map((d: any) => d.titulo),
          datasets: [{
            label: 'Comentarios',
            data: data.map((d: any) => d.totalComentarios),
            backgroundColor: 'rgba(56,189,248,0.7)',
            borderColor: '#38bdf8',
            borderWidth: 1,
          }]
        };
      }
    });
  }

  logout() { this.authService.logout(); }
}