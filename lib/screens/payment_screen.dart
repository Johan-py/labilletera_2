import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../widgets/common_widgets.dart';

class PaymentScreen extends StatefulWidget {
  const PaymentScreen({super.key});

  @override
  State<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen>
    with SingleTickerProviderStateMixin {
  bool _showQR = false;
  bool _paymentDone = false;
  bool _showSaving = false;
  late AnimationController _successController;
  late Animation<double> _scaleAnim;

  @override
  void initState() {
    super.initState();
    _successController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 500),
    );
    _scaleAnim = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _successController, curve: Curves.elasticOut),
    );
  }

  @override
  void dispose() {
    _successController.dispose();
    super.dispose();
  }

  void _simulatePayment() async {
    setState(() => _paymentDone = true);
    await _successController.forward();
    await Future.delayed(const Duration(milliseconds: 400));
    setState(() => _showSaving = true);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgBeige,
      appBar: AppBar(
        title: const Text('Pagar con QR'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, size: 18),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: _paymentDone ? _buildSuccess() : _buildPaymentFlow(),
        ),
      ),
    );
  }

  Widget _buildPaymentFlow() {
    return Column(
      children: [
        const SizedBox(height: 16),
        // Merchant info
        AppCard(
          child: Row(
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  color: AppColors.surfaceBeige,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Center(
                  child: Text('🥟', style: TextStyle(fontSize: 26)),
                ),
              ),
              const SizedBox(width: 14),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Salteñas Don Carlos',
                    style: AppTextStyles.headingSmall,
                  ),
                  const SizedBox(height: 2),
                  Row(
                    children: [
                      Container(
                        width: 8,
                        height: 8,
                        decoration: const BoxDecoration(
                          color: AppColors.success,
                          shape: BoxShape.circle,
                        ),
                      ),
                      const SizedBox(width: 4),
                      Text(
                        'Negocio verificado en NEXO',
                        style: AppTextStyles.bodySmall.copyWith(
                          color: AppColors.success,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),

        // QR simulado
        AppCard(
          child: Column(
            children: [
              Container(
                width: 220,
                height: 220,
                decoration: BoxDecoration(
                  color: AppColors.surfaceBeige,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Center(
                  child: Icon(
                    Icons.qr_code,
                    size: 180,
                    color: AppColors.primaryDark,
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),

        // Monto
        AppCard(
          child: Column(
            children: [
              Text('Monto a pagar', style: AppTextStyles.bodyMedium),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Bs.',
                    style: AppTextStyles.headingMedium.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),
                  const SizedBox(width: 4),
                  Text('12.00', style: AppTextStyles.amountLarge),
                ],
              ),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  color: AppColors.gold.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Text('🌱', style: TextStyle(fontSize: 14)),
                    const SizedBox(width: 6),
                    Text(
                      'Ahorro automático: +Bs. 2.00',
                      style: AppTextStyles.bodySmall.copyWith(
                        color: AppColors.gold,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const Spacer(),

        // Botón pagar
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: _simulatePayment,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primaryDark,
              padding: const EdgeInsets.symmetric(vertical: 18),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.lock, size: 18, color: Colors.white),
                const SizedBox(width: 8),
                Text(
                  'Confirmar pago — Bs. 12.00',
                  style: AppTextStyles.labelLarge.copyWith(color: Colors.white),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 16),
      ],
    );
  }

  Widget _buildSuccess() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        ScaleTransition(
          scale: _scaleAnim,
          child: Container(
            width: 100,
            height: 100,
            decoration: BoxDecoration(
              color: AppColors.successLight,
              shape: BoxShape.circle,
            ),
            child: const Center(
              child: Icon(
                Icons.check_rounded,
                color: AppColors.success,
                size: 52,
              ),
            ),
          ),
        ),
        const SizedBox(height: 24),
        Text('¡Pago exitoso!', style: AppTextStyles.displayMedium),
        const SizedBox(height: 8),
        Text(
          'Salteñas Don Carlos recibió Bs. 12.00',
          style: AppTextStyles.bodyMedium,
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 32),

        if (_showSaving) ...[
          const SavingPill(amount: 2.00),
          const SizedBox(height: 20),
          AppCard(
            child: Column(
              children: [
                Text(
                  'Tu ahorro creció 🌱',
                  style: AppTextStyles.headingSmall,
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    StatItem(
                      icon: '💰',
                      label: 'Antes',
                      value: 'Bs. 45.50',
                      valueColor: AppColors.textSecondary,
                    ),
                    Icon(
                      Icons.arrow_forward,
                      color: AppColors.primary,
                    ),
                    StatItem(
                      icon: '📈',
                      label: 'Ahora',
                      value: 'Bs. 47.50',
                      valueColor: AppColors.success,
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.surfaceBeige,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    'Bs. 2.00 de este pago fue a tu fondo comunitario.\nDon Carlos usará ese capital para crecer.',
                    style: AppTextStyles.bodySmall,
                    textAlign: TextAlign.center,
                  ),
                ),
              ],
            ),
          ),
        ],
        const SizedBox(height: 32),
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Volver al inicio'),
          ),
        ),
      ],
    );
  }
}
