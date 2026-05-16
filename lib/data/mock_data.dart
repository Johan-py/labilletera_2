// Mock data para el demo — reemplazar con backend real

class MockData {
  // --- ESTUDIANTE ---
  static const String studentName = 'Valeria';
  static const double studentSavings = 47.50;
  static const double todaySaving = 2.00;
  static const int businessesHelped = 3;
  static const double savingsGrowth = 12.4; // porcentaje este mes

  static const List<Map<String, dynamic>> recentTransactions = [
    {
      'merchant': 'Salteñas Don Carlos',
      'amount': -12.00,
      'saved': 2.00,
      'time': 'Hoy, 12:30',
      'icon': '🥟',
      'category': 'Alimentación',
    },
    {
      'merchant': 'Fotocopias UniCopy',
      'amount': -5.00,
      'saved': 0.50,
      'time': 'Hoy, 09:15',
      'icon': '📄',
      'category': 'Servicios',
    },
    {
      'merchant': 'Transporte Línea 7',
      'amount': -3.50,
      'saved': 0.50,
      'time': 'Ayer, 07:45',
      'icon': '🚌',
      'category': 'Transporte',
    },
    {
      'merchant': 'Jugos Frescos Mary',
      'amount': -8.00,
      'saved': 1.00,
      'time': 'Ayer, 13:00',
      'icon': '🥤',
      'category': 'Alimentación',
    },
    {
      'merchant': 'Librería Universitaria',
      'amount': -25.00,
      'saved': 2.50,
      'time': 'Lun, 10:20',
      'icon': '📚',
      'category': 'Educación',
    },
  ];

  static const List<Map<String, dynamic>> impactBusinesses = [
    {
      'name': 'Salteñas Don Carlos',
      'type': 'Alimentación',
      'icon': '🥟',
      'yourContribution': 18.50,
      'totalPool': 2340.00,
      'status': 'Activo',
    },
    {
      'name': 'UniCopy Fotocopias',
      'type': 'Servicios',
      'icon': '📄',
      'yourContribution': 12.00,
      'totalPool': 1200.00,
      'status': 'Activo',
    },
    {
      'name': 'Jugos Frescos Mary',
      'type': 'Alimentación',
      'icon': '🥤',
      'yourContribution': 8.00,
      'totalPool': 980.00,
      'status': 'Activo',
    },
  ];

  // Ahorro por semana (últimas 8 semanas)
  static const List<double> weeklySavings = [
    5.0, 8.5, 6.0, 11.0, 9.5, 14.0, 12.5, 47.5
  ];

  // --- COMERCIANTE ---
  static const String merchantName = 'Don Carlos';
  static const String merchantBusiness = 'Salteñas Don Carlos';
  static const double monthlyRevenue = 4247.00;
  static const double lastMonthRevenue = 3790.00;
  static const int activeDays = 89;
  static const int uniqueClients = 234;
  static const int dailyTransactions = 47;
  static const double creditScore = 87.0; // sobre 100
  static const String creditLabel = 'Confiable';
  static const double availableCredit = 1500.00;

  // Ingresos por día de la semana
  static const List<Map<String, dynamic>> weeklyRevenue = [
    {'day': 'Lun', 'amount': 580.0},
    {'day': 'Mar', 'amount': 620.0},
    {'day': 'Mié', 'amount': 710.0},
    {'day': 'Jue', 'amount': 690.0},
    {'day': 'Vie', 'amount': 890.0},
    {'day': 'Sáb', 'amount': 520.0},
    {'day': 'Dom', 'amount': 237.0},
  ];

  static const List<Map<String, dynamic>> creditNarrative = [
    {
      'icon': '📅',
      'label': 'Consistencia',
      'value': '89 días activo',
      'detail': 'Opera sin interrupciones',
      'score': 95,
    },
    {
      'icon': '👥',
      'label': 'Base de clientes',
      'value': '234 únicos',
      'detail': '78% son recurrentes',
      'score': 88,
    },
    {
      'icon': '📈',
      'label': 'Crecimiento',
      'value': '+12% mensual',
      'detail': 'Tendencia positiva',
      'score': 82,
    },
    {
      'icon': '⏰',
      'label': 'Puntualidad',
      'value': '100% en horario',
      'detail': 'Opera 6am-3pm diario',
      'score': 90,
    },
  ];

  static const List<Map<String, dynamic>> microcreditOptions = [
    {
      'amount': 500.0,
      'term': '30 días',
      'rate': '2.5%',
      'purpose': 'Capital de trabajo',
      'monthlyPayment': 512.50,
    },
    {
      'amount': 1000.0,
      'term': '60 días',
      'rate': '4%',
      'purpose': 'Expansión de negocio',
      'monthlyPayment': 520.00,
    },
    {
      'amount': 1500.0,
      'term': '90 días',
      'rate': '5.5%',
      'purpose': 'Equipamiento',
      'monthlyPayment': 508.33,
    },
  ];
}
