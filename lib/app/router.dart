import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

const _splashPath = '/';
const _loginPath = '/login';
const _homePath = '/home';

final GoRouter appRouter = GoRouter(
  initialLocation: _splashPath,
  routes: [
    GoRoute(
      path: _splashPath,
      name: 'splash',
      builder: (context, state) => const Scaffold(body: Center(child: Text('Splash'))),
    ),
    GoRoute(
      path: _loginPath,
      name: 'login',
      builder: (context, state) => const Scaffold(body: Center(child: Text('Login'))),
    ),
    GoRoute(
      path: _homePath,
      name: 'home',
      builder: (context, state) => const Scaffold(body: Center(child: Text('Home'))),
    ),
  ],
);
