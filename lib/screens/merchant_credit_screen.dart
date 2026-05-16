import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../data/mock_data.dart';
import '../widgets/common_widgets.dart';

class MerchantCreditScreen extends StatefulWidget {
  const MerchantCreditScreen({super.key});

  @override
  State<MerchantCreditScreen> createState() => _MerchantCreditScreenState();
}

class _MerchantCreditScreenState extends State<MerchantCreditScreen> {
  int _selectedCredit = 0;
  bool _applied = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgBeige,
      appBar: AppBar(
        title: const Text('Identidad Crediticia'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, size: 18),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: _applied ? _buildApplied() : _buildCreditView(),
    );
  }

  Widget _buildCreditView() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildScoreHeader(),
          const SizedBox(height: 20),
          const SectionHeader(title: 'Tu narrativa financiera'),
          const SizedBox(height: 12),
          ...MockData.creditNarrative.map((item) => _buildNarrativeItem(item)),
          const SizedBox(height: 24),
          const SectionHeader(title: 'Solicitar capital'),
          const SizedBox(height: 12),
          ...MockData.microcreditOptions.asMap().entries.map(
                (e) => _buildCreditOption(e.key, e.value),
              ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () => setState(() => _applied = true),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primaryDark,
                padding: const EdgeInsets.symmetric(vertical: 18),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
              child: Text(
                'Solicitar Bs. ${MockData.microcreditOptions[_selectedCredit]['amount'].toStringAsFixed(0)}',
                style: AppTextStyles.labelLarge.copyWith(color: Colors.white),
              ),
            ),
          ),
          const SizedBox(height: 8),
          Center(
            child: Text(
              'Respuesta en menos de 2 horas',
              style: AppTextStyles.bodySmall,
            ),
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }

  Widget _buildScoreHeader() {
    return AppCard(
      child: Row(
        children: [
          ScoreCircle(
            score: MockData.creditScore,
            label: MockData.creditLabel,
            size: 110,
          ),
          const SizedBox(width: 20),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Tu perfil es sólido',
                  style: AppTextStyles.headingSmall,
                ),
                const SizedBox(height: 6),
                Text(
                  'Construido en base a ${MockData.activeDays} días de operación continua y ${MockData.uniqueClients} clientes únicos.',
                  style: AppTextStyles.bodySmall,
                ),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: AppColors.successLight,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    '✅ Apto para micro-crédito',
                    style: AppTextStyles.bodySmall.copyWith(
                      color: AppColors.success,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNarrativeItem(Map<String, dynamic> item) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: AppCard(
        child: Row(
          children: [
            Text(item['icon'] as String, style: const TextStyle(fontSize: 24)),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(item['label'] as String, style: AppTextStyles.headingSmall),
                      Text(
                        '${item['score']}/100',
                        style: AppTextStyles.bodySmall.copyWith(
                          color: AppColors.success,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(item['value'] as String, style: AppTextStyles.bodyMedium.copyWith(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w600,
                  )),
                  const SizedBox(height: 2),
                  Text(item['detail'] as String, style: AppTextStyles.bodySmall),
                  const SizedBox(height: 8),
                  AppProgressBar(
                    value: (item['score'] as int) / 100,
                    color: AppColors.success,
                    height: 6,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCreditOption(int index, Map<String, dynamic> option) {
    final isSelected = _selectedCredit == index;
    return GestureDetector(
      onTap: () => setState(() => _selectedCredit = index),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        margin: const EdgeInsets.only(bottom: 12),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primary : AppColors.surface,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? AppColors.primary : AppColors.divider,
            width: isSelected ? 2 : 1,
          ),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: AppColors.primary.withOpacity(0.2),
                    blurRadius: 16,
                    offset: const Offset(0, 4),
                  )
                ]
              : [],
        ),
        padding: const EdgeInsets.all(20),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Bs. ${(option['amount'] as double).toStringAsFixed(0)}',
                    style: AppTextStyles.headingLarge.copyWith(
                      color: isSelected ? Colors.white : AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    option['purpose'] as String,
                    style: AppTextStyles.bodySmall.copyWith(
                      color: isSelected ? Colors.white.withOpacity(0.8) : AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text(
                  option['term'] as String,
                  style: AppTextStyles.labelLarge.copyWith(
                    color: isSelected ? Colors.white : AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '${option['rate']} interés',
                  style: AppTextStyles.bodySmall.copyWith(
                    color: isSelected ? AppColors.goldLight : AppColors.gold,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildApplied() {
    final option = MockData.microcreditOptions[_selectedCredit];
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 100,
            height: 100,
            decoration: BoxDecoration(
              color: AppColors.gold.withOpacity(0.15),
              shape: BoxShape.circle,
            ),
            child: const Center(
              child: Text('🎉', style: TextStyle(fontSize: 48)),
            ),
          ),
          const SizedBox(height: 24),
          Text('¡Solicitud enviada!', style: AppTextStyles.displayMedium),
          const SizedBox(height: 8),
          Text(
            'Tu solicitud de Bs. ${(option['amount'] as double).toStringAsFixed(0)} fue enviada al pool comunitario',
            style: AppTextStyles.bodyMedium,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 32),
          AppCard(
            child: Column(
              children: [
                _infoRow('Monto', 'Bs. ${(option['amount'] as double).toStringAsFixed(0)}'),
                const Divider(color: AppColors.divider, height: 24),
                _infoRow('Plazo', option['term'] as String),
                const Divider(color: AppColors.divider, height: 24),
                _infoRow('Tasa', option['rate'] as String),
                const Divider(color: AppColors.divider, height: 24),
                _infoRow('Fuente', 'Pool comunitario estudiantil'),
              ],
            ),
          ),
          const SizedBox(height: 20),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.successLight,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              children: [
                const Text('⏱️', style: TextStyle(fontSize: 24)),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Respuesta en menos de 2 horas',
                        style: AppTextStyles.headingSmall.copyWith(
                          color: AppColors.success,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'Te notificaremos cuando el fondo apruebe tu solicitud',
                        style: AppTextStyles.bodySmall.copyWith(
                          color: AppColors.success,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Volver al dashboard'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _infoRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: AppTextStyles.bodyMedium),
        Text(
          value,
          style: AppTextStyles.labelLarge.copyWith(color: AppColors.primaryDark),
        ),
      ],
    );
  }
}
