import 'package:flutter/material.dart';
import 'theme.dart';
import 'router.dart';

class LabilleteraApp extends StatelessWidget {
  const LabilleteraApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Labilletera',
      theme: AppTheme.light,
      routerConfig: appRouter,
      debugShowCheckedModeBanner: false,
    );
  }
}
