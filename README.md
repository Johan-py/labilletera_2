# NEXO — Setup en Android Studio

## Estructura del proyecto
```
lib/
├── main.dart                    ← Entrada, selector de rol, navegación
├── theme/
│   └── app_theme.dart           ← Colores, tipografía, decoraciones
├── data/
│   └── mock_data.dart           ← Todos los datos del demo
├── widgets/
│   └── common_widgets.dart      ← Componentes reutilizables
└── screens/
    ├── student_home_screen.dart      ← Home de Valeria
    ├── payment_screen.dart           ← Pago QR + animación de ahorro
    ├── student_impact_screen.dart    ← Mi impacto / economía circular
    ├── merchant_dashboard_screen.dart ← Dashboard Don Carlos
    └── merchant_credit_screen.dart   ← Perfil crediticio + micro-crédito
```

## Setup rápido (24h hackathon)

### Opción A — google_fonts (MÁS RÁPIDA, recomendada)
1. En `pubspec.yaml`, agrega bajo `dependencies`:
   ```yaml
   google_fonts: ^6.1.0
   ```
2. Elimina la sección `fonts:` del pubspec.yaml
3. En `app_theme.dart`, agrega el import:
   ```dart
   import 'package:google_fonts/google_fonts.dart';
   ```
4. Cambia en `AppTextStyles` y `AppTheme`:
   ```dart
   // Reemplaza: fontFamily: 'Poppins'
   // Por: fontFamily: GoogleFonts.poppins().fontFamily
   ```
5. Corre `flutter pub get`

### Opción B — Fuentes locales
1. Descarga Poppins desde https://fonts.google.com/specimen/Poppins
2. Crea la carpeta `assets/fonts/` en la raíz del proyecto
3. Copia los archivos .ttf (Regular, Medium, SemiBold, Bold, ExtraBold)
4. Corre `flutter pub get`

## Demo flow (para el pitch)

### Flujo Estudiante (Valeria):
1. Selector → "Soy estudiante"
2. Home → ver ahorro acumulado y banner de impacto
3. Botón "Pagar" → pantalla QR → "Confirmar pago"
4. Animación de éxito + pill 🌱 "+Bs. 2.00 ahorrado"
5. Volver → tocar banner verde "Tu dinero está trabajando"
6. Ver pantalla de impacto con los negocios

### Flujo Comerciante (Don Carlos):
1. Selector → "Soy comerciante"  
2. Dashboard → ver ingresos y gráfico semanal
3. Tocar card dorada "Tu perfil crediticio"
4. Ver score circular + narrativa financiera
5. Seleccionar opción de crédito → "Solicitar"
6. Pantalla de confirmación exitosa

## Personalización rápida

### Cambiar nombre de la app:
- `main.dart` línea 13: `title: 'NEXO'` → tu nombre
- `main.dart` línea 60: el logo "N" → tu inicial
- `main.dart` línea 61: `'NEXO'` → tu nombre

### Cambiar colores:
Todo en `lib/theme/app_theme.dart` clase `AppColors`:
- `primaryDark`: color principal oscuro (azul marino ahora)
- `primary`: color de acción
- `gold`: color de ahorro/acento cálido

### Cambiar datos del demo:
Todo en `lib/data/mock_data.dart` — nombres, montos, porcentajes.
