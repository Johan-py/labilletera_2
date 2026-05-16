import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../data/mock_data.dart';
import '../widgets/common_widgets.dart';
import 'student_impact_screen.dart';
import 'payment_screen.dart';

class StudentHomeScreen extends StatelessWidget {
  const StudentHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgBeige,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 24),
              _buildHeader(),
              const SizedBox(height: 24),
              _buildSavingsCard(context),
              const SizedBox(height: 20),
              _buildImpactBanner(context),
              const SizedBox(height: 24),
              _buildQuickActions(context),
              const SizedBox(height: 24),
              SectionHeader(
                title: 'Movimientos recientes',
                action: 'Ver todos',
                onAction: () {},
              ),
              const SizedBox(height: 12),
              _buildTransactions(),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Hola, ${MockData.studentName} 👋',
              style: AppTextStyles.displayMedium,
            ),
            const SizedBox(height: 4),
            Text(
              'Cada pago suma a tu futuro',
              style: AppTextStyles.bodyMedium,
            ),
          ],
        ),
        Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: AppColors.primaryDark,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Center(
            child: Text(
              MockData.studentName[0],
              style: AppTextStyles.headingLarge.copyWith(
                color: Colors.white,
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildSavingsCard(BuildContext context) {
    return Container(
      width: double.infinity,
      decoration: AppDecorations.primaryGradient(radius: 24),
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Tu ahorro acumulado',
                style: AppTextStyles.bodyMedium.copyWith(
                  color: Colors.white.withOpacity(0.8),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.trending_up, color: Colors.white, size: 14),
                    const SizedBox(width: 4),
                    Text(
                      '+${MockData.savingsGrowth}%',
                      style: AppTextStyles.bodySmall.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                'Bs.',
                style: AppTextStyles.headingMedium.copyWith(
                  color: Colors.white.withOpacity(0.7),
                ),
              ),
              const SizedBox(width: 4),
              Text(
                MockData.studentSavings.toStringAsFixed(2),
                style: AppTextStyles.amountLarge.copyWith(
                  color: Colors.white,
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            '+Bs. ${MockData.todaySaving.toStringAsFixed(2)} ahorrados hoy 🌱',
            style: AppTextStyles.bodySmall.copyWith(
              color: AppColors.goldLight,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 20),
          // Mini gráfico de semanas
          _buildMiniChart(),
        ],
      ),
    );
  }

  Widget _buildMiniChart() {
    final savings = MockData.weeklySavings;
    final maxVal = savings.reduce((a, b) => a > b ? a : b);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Últimas 8 semanas',
          style: AppTextStyles.bodySmall.copyWith(
            color: Colors.white.withOpacity(0.6),
          ),
        ),
        const SizedBox(height: 8),
        Row(
          crossAxisAlignment: CrossAxisAlignment.end,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: savings.map((val) {
            final ratio = val / maxVal;
            final isLast = val == savings.last;
            return Container(
              width: 28,
              height: 40 * ratio,
              decoration: BoxDecoration(
                color: isLast
                    ? AppColors.gold
                    : Colors.white.withOpacity(0.25),
                borderRadius: BorderRadius.circular(6),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildImpactBanner(BuildContext context) {
    return GestureDetector(
      onTap: () => Navigator.push(
        context,
        MaterialPageRoute(builder: (_) => const StudentImpactScreen()),
      ),
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.successLight,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: AppColors.success.withOpacity(0.3),
            width: 1,
          ),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
        child: Row(
          children: [
            const Text('🌱', style: TextStyle(fontSize: 28)),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Tu dinero está trabajando',
                    style: AppTextStyles.headingSmall.copyWith(
                      color: AppColors.success,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    'Apoyando ${MockData.businessesHelped} negocios de tu comunidad',
                    style: AppTextStyles.bodySmall.copyWith(
                      color: AppColors.success,
                    ),
                  ),
                ],
              ),
            ),
            Icon(
              Icons.arrow_forward_ios,
              color: AppColors.success,
              size: 14,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickActions(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: GestureDetector(
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const PaymentScreen()),
            ),
            child: Container(
              decoration: AppDecorations.goldGradient(radius: 18),
              padding: const EdgeInsets.symmetric(vertical: 18),
              child: Column(
                children: [
                  const Icon(Icons.qr_code_scanner, color: Colors.white, size: 28),
                  const SizedBox(height: 6),
                  Text(
                    'Pagar',
                    style: AppTextStyles.labelLarge.copyWith(
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: AppCard(
            padding: const EdgeInsets.symmetric(vertical: 18),
            onTap: () {},
            child: Column(
              children: [
                Icon(Icons.savings_outlined, color: AppColors.primary, size: 28),
                const SizedBox(height: 6),
                Text(
                  'Mi ahorro',
                  style: AppTextStyles.labelLarge.copyWith(
                    color: AppColors.primary,
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: AppCard(
            padding: const EdgeInsets.symmetric(vertical: 18),
            onTap: () {},
            child: Column(
              children: [
                Icon(Icons.bar_chart, color: AppColors.primary, size: 28),
                const SizedBox(height: 6),
                Text(
                  'Análisis',
                  style: AppTextStyles.labelLarge.copyWith(
                    color: AppColors.primary,
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildTransactions() {
    return AppCard(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      child: Column(
        children: MockData.recentTransactions.asMap().entries.map((entry) {
          final isLast = entry.key == MockData.recentTransactions.length - 1;
          return Column(
            children: [
              TransactionRow(transaction: entry.value),
              if (!isLast)
                const Divider(color: AppColors.divider, height: 1),
            ],
          );
        }).toList(),
      ),
    );
  }
}
