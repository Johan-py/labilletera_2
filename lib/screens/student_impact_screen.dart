import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../data/mock_data.dart';
import '../widgets/common_widgets.dart';

class StudentImpactScreen extends StatelessWidget {
  const StudentImpactScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgBeige,
      appBar: AppBar(
        title: const Text('Mi impacto'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, size: 18),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildHeroCard(),
            const SizedBox(height: 24),
            const SectionHeader(title: 'Negocios que apoyas'),
            const SizedBox(height: 12),
            ...MockData.impactBusinesses.map((b) => _buildBusinessCard(b)),
            const SizedBox(height: 24),
            _buildCircleExplanation(),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildHeroCard() {
    return Container(
      width: double.infinity,
      decoration: AppDecorations.primaryGradient(radius: 24),
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Tu dinero no duerme',
            style: AppTextStyles.headingLarge.copyWith(color: Colors.white),
          ),
          const SizedBox(height: 8),
          Text(
            'Mientras ahorras, financias negocios reales de tu comunidad universitaria',
            style: AppTextStyles.bodyMedium.copyWith(
              color: Colors.white.withOpacity(0.8),
            ),
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _heroStat('Bs. 38.50', 'En circulación', '💸'),
              _heroStat('3', 'Negocios apoyados', '🏪'),
              _heroStat('2.1%', 'Rendimiento', '📈'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _heroStat(String value, String label, String icon) {
    return Column(
      children: [
        Text(icon, style: const TextStyle(fontSize: 22)),
        const SizedBox(height: 4),
        Text(
          value,
          style: AppTextStyles.headingMedium.copyWith(color: Colors.white),
        ),
        const SizedBox(height: 2),
        Text(
          label,
          style: AppTextStyles.bodySmall.copyWith(
            color: Colors.white.withOpacity(0.7),
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  Widget _buildBusinessCard(Map<String, dynamic> business) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: AppCard(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: AppColors.surfaceBeige,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Center(
                    child: Text(
                      business['icon'] as String,
                      style: const TextStyle(fontSize: 24),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        business['name'] as String,
                        style: AppTextStyles.headingSmall,
                      ),
                      const SizedBox(height: 2),
                      CategoryChip(label: business['type'] as String),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: AppColors.successLight,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    business['status'] as String,
                    style: AppTextStyles.bodySmall.copyWith(
                      color: AppColors.success,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Tu aporte', style: AppTextStyles.bodySmall),
                      const SizedBox(height: 4),
                      Text(
                        'Bs. ${(business['yourContribution'] as double).toStringAsFixed(2)}',
                        style: AppTextStyles.headingSmall.copyWith(
                          color: AppColors.primary,
                        ),
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Pool total', style: AppTextStyles.bodySmall),
                      const SizedBox(height: 4),
                      Text(
                        'Bs. ${(business['totalPool'] as double).toStringAsFixed(0)}',
                        style: AppTextStyles.headingSmall,
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            AppProgressBar(
              value: (business['yourContribution'] as double) /
                  (business['totalPool'] as double),
              color: AppColors.primary,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCircleExplanation() {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('¿Cómo funciona el círculo?', style: AppTextStyles.headingSmall),
          const SizedBox(height: 16),
          _step('1', 'Pagas con QR', 'Un % de cada pago va a tu fondo automáticamente', AppColors.gold),
          _dividerLine(),
          _step('2', 'Tu fondo financia negocios', 'Los comerciantes del ecosistema pueden acceder a micro-créditos', AppColors.primary),
          _dividerLine(),
          _step('3', 'Los negocios crecen', 'Mejoran su oferta, contratan más, sirven mejor a estudiantes', AppColors.success),
          _dividerLine(),
          _step('4', 'Tú recibes rendimiento', 'Cuando el negocio devuelve el crédito, tu ahorro crece', AppColors.primaryLight),
        ],
      ),
    );
  }

  Widget _step(String num, String title, String desc, Color color) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 32,
          height: 32,
          decoration: BoxDecoration(
            color: color.withOpacity(0.15),
            shape: BoxShape.circle,
          ),
          child: Center(
            child: Text(
              num,
              style: AppTextStyles.labelLarge.copyWith(color: color),
            ),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: AppTextStyles.headingSmall),
              const SizedBox(height: 2),
              Text(desc, style: AppTextStyles.bodySmall),
            ],
          ),
        ),
      ],
    );
  }

  Widget _dividerLine() {
    return Padding(
      padding: const EdgeInsets.only(left: 15, top: 4, bottom: 4),
      child: Container(width: 2, height: 20, color: AppColors.divider),
    );
  }
}
