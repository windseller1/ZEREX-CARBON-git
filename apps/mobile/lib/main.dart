import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:go_router/go_router.dart';

import 'core/config/app_config.dart';
import 'core/config/app_theme.dart';
import 'core/config/app_router.dart';
import 'core/di/injection_container.dart';
import 'features/auth/presentation/bloc/auth_bloc.dart';
import 'features/carbon/presentation/bloc/carbon_bloc.dart';
import 'features/market/presentation/bloc/market_bloc.dart';
import 'features/portfolio/presentation/bloc/portfolio_bloc.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Hive
  await Hive.initFlutter();
  
  // Initialize dependency injection
  await initializeDependencies();
  
  runApp(const ZerexCarbonApp());
}

class ZerexCarbonApp extends StatelessWidget {
  const ZerexCarbonApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider<AuthBloc>(
          create: (context) => getIt<AuthBloc>()..add(CheckAuthStatusEvent()),
        ),
        BlocProvider<CarbonBloc>(
          create: (context) => getIt<CarbonBloc>(),
        ),
        BlocProvider<MarketBloc>(
          create: (context) => getIt<MarketBloc>()..add(LoadMarketDataEvent()),
        ),
        BlocProvider<PortfolioBloc>(
          create: (context) => getIt<PortfolioBloc>(),
        ),
      ],
      child: MaterialApp.router(
        title: 'ZEREX CARBON',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        themeMode: ThemeMode.system,
        routerConfig: AppRouter.router,
        locale: const Locale('ar', 'SA'),
        supportedLocales: const [
          Locale('ar', 'SA'),
          Locale('en', 'US'),
        ],
        builder: (context, child) {
          return Directionality(
            textDirection: TextDirection.rtl,
            child: child!,
          );
        },
      ),
    );
  }
}
