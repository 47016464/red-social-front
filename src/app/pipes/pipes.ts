import { Pipe, PipeTransform } from '@angular/core';

// Pipe 1: Tiempo relativo (hace X minutos/horas/días)
@Pipe({ name: 'tiempoRelativo', standalone: true })
export class TiempoRelativoPipe implements PipeTransform {
  transform(fecha: string | Date): string {
    if (!fecha) return '';
    const ahora = new Date();
    const entonces = new Date(fecha);
    const diff = Math.floor((ahora.getTime() - entonces.getTime()) / 1000);

    if (diff < 60) return 'hace un momento';
    if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
    if (diff < 604800) return `hace ${Math.floor(diff / 86400)} días`;
    return entonces.toLocaleDateString('es-AR');
  }
}

// Pipe 2: Truncar texto con ellipsis
@Pipe({ name: 'truncar', standalone: true })
export class TruncarPipe implements PipeTransform {
  transform(texto: string, limite: number = 100): string {
    if (!texto) return '';
    if (texto.length <= limite) return texto;
    return texto.substring(0, limite).trim() + '...';
  }
}

// Pipe 3: Iniciales de nombre completo
@Pipe({ name: 'iniciales', standalone: true })
export class InicialesPipe implements PipeTransform {
  transform(nombre: string): string {
    if (!nombre) return '?';
    return nombre
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(n => n[0].toUpperCase())
      .join('');
  }
}