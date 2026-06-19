import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { LucideAngularModule, Rocket, Eye, EyeOff, Camera, Heart, MessageCircle, Plus, LogOut, Home, User, X, Send, Edit, Mail, Calendar, Shield } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      LucideAngularModule.pick({ Rocket, Eye, EyeOff, Camera, Heart, MessageCircle, Plus, LogOut, Home, User, X, Send, Edit, Mail, Calendar, Shield })
    )
  ]
};