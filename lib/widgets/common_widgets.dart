import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

// ─── CHIP DE CATEGORÍA ───────────────────────────────────────────────────────
class CategoryChip extends StatelessWidget {
  final String label;
  final Color? color;
  const CategoryChip({super.key, required this.label, this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: (color ?? AppColors.primary).withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        label,
        style: AppTextStyles.bodySmall.copyWith(
          color: color ?? AppColors.primary,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}

// ─── CARD GENÉRICA ───────────────────────────────────────────────────────────
class AppCard extends StatelessWidget {
  final Widget child;
  final EdgeInsets? padding;
  final VoidCallback? onTap;
  final Color? color;

  const AppCard({
    super.key,
    required this.child,
    this.padding,
    this.onTap,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: AppDecorations.card.copyWith(
          color: color ?? AppColors.surface,
        ),
        padding: padding ?? const EdgeInsets.all(20),
        child: child,
      ),
    );
  }
}

// ─── BARRA DE PROGRESO CUSTOM ─────────────────────────────────────────────────
class AppProgressBar extends StatelessWidget {
  final double value; // 0.0 a 1.0
  final Color? color;
  final double height;

  const AppProgressBar({
    super.key,
    required this.value,
    this.color,
    this.height = 8,
  });

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(height),
      child: LinearProgressIndicator(
        value: value.clamp(0.0, 1.0),
        minHeight: height,
        backgroundColor: AppColors.divider,
        valueColor: AlwaysStoppedAnimation<Color>(
          color ?? AppColors.primary,
        ),
      ),
    );
  }
}

// ─── SCORE CIRCULAR ───────────────────────────────────────────────────────────
class ScoreCircle extends StatelessWidget {
  final double score; // 0 a 100
  final String label;
  final double size;

  const ScoreCircle({
    super.key,
    required this.score,
    required this.label,
    this.size = 120,
  });

  Color get _scoreColor {
    if (score >= 80) return AppColors.success;
    if (score >= 60) return AppColors.gold;
    return AppColors.error;
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        alignment: Alignment.center,
        children: [
          SizedBox(
            width: size,
            height: size,
            child: CircularProgressIndicator(
              value: score / 100,
              strokeWidth: 10,
              backgroundColor: AppColors.divider,
              valueColor: AlwaysStoppedAnimation<Color>(_scoreColor),
              strokeCap: StrokeCap.round,
            ),
          ),
          Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                '${score.toInt()}',
                style: AppTextStyles.amountMedium.copyWith(
                  color: _scoreColor,
                  fontSize: size * 0.22,
                ),
              ),
              Text(
                label,
                style: AppTextStyles.bodySmall.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

// ─── BARRA DE GRÁFICO SEMANAL ─────────────────────────────────────────────────
class WeeklyBarChart extends StatelessWidget {
  final List<Map<String, dynamic>> data;
  final Color? barColor;

  const WeeklyBarChart({super.key, required this.data, this.barColor});

  @override
  Widget build(BuildContext context) {
    final maxVal = data.map((e) => e['amount'] as double).reduce((a, b) => a > b ? a : b);

    return Row(
      crossAxisAlignment: CrossAxisAlignment.end,
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: data.map((item) {
        final ratio = (item['amount'] as double) / maxVal;
        final isMax = (item['amount'] as double) == maxVal;
        return Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            AnimatedContainer(
              duration: const Duration(milliseconds: 600),
              width: 32,
              height: 90 * ratio,
              decoration: BoxDecoration(
                color: isMax
                    ? (barColor ?? AppColors.primary)
                    : (barColor ?? AppColors.primary).withOpacity(0.25),
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            const SizedBox(height: 6),
            Text(
              item['day'] as String,
              style: AppTextStyles.bodySmall.copyWith(
                color: isMax ? AppColors.primary : AppColors.textHint,
                fontWeight: isMax ? FontWeight.w700 : FontWeight.w400,
              ),
            ),
          ],
        );
      }).toList(),
    );
  }
}

// ─── STAT ITEM ────────────────────────────────────────────────────────────────
class StatItem extends StatelessWidget {
  final String icon;
  final String label;
  final String value;
  final Color? valueColor;

  const StatItem({
    super.key,
    required this.icon,
    required this.label,
    required this.value,
    this.valueColor,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(icon, style: const TextStyle(fontSize: 22)),
        const SizedBox(height: 4),
        Text(
          value,
          style: AppTextStyles.headingSmall.copyWith(
            color: valueColor ?? AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: 2),
        Text(label, style: AppTextStyles.bodySmall),
      ],
    );
  }
}

// ─── SAVING PILL ANIMATION ────────────────────────────────────────────────────
class SavingPill extends StatefulWidget {
  final double amount;
  const SavingPill({super.key, required this.amount});

  @override
  State<SavingPill> createState() => _SavingPillState();
}

class _SavingPillState extends State<SavingPill> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _slideAnim;
  late Animation<double> _fadeAnim;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    );
    _slideAnim = Tween<double>(begin: 20, end: 0).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeOut),
    );
    _fadeAnim = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeIn),
    );
    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (_, __) => Transform.translate(
        offset: Offset(0, _slideAnim.value),
        child: Opacity(
          opacity: _fadeAnim.value,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
            decoration: BoxDecoration(
              color: AppColors.gold,
              borderRadius: BorderRadius.circular(30),
              boxShadow: [
                BoxShadow(
                  color: AppColors.gold.withOpacity(0.4),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text('🌱', style: TextStyle(fontSize: 16)),
                const SizedBox(width: 6),
                Text(
                  '+Bs. ${widget.amount.toStringAsFixed(2)} ahorrado',
                  style: AppTextStyles.labelLarge.copyWith(
                    color: Colors.white,
                    fontSize: 13,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// ─── SECTION HEADER ───────────────────────────────────────────────────────────
class SectionHeader extends StatelessWidget {
  final String title;
  final String? action;
  final VoidCallback? onAction;

  const SectionHeader({
    super.key,
    required this.title,
    this.action,
    this.onAction,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(title, style: AppTextStyles.headingMedium),
        if (action != null)
          GestureDetector(
            onTap: onAction,
            child: Text(
              action!,
              style: AppTextStyles.labelLarge.copyWith(
                color: AppColors.primary,
              ),
            ),
          ),
      ],
    );
  }
}

// ─── TRANSACTION ROW ──────────────────────────────────────────────────────────
class TransactionRow extends StatelessWidget {
  final Map<String, dynamic> transaction;

  const TransactionRow({super.key, required this.transaction});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: Row(
        children: [
          Container(
            width: 46,
            height: 46,
            decoration: BoxDecoration(
              color: AppColors.surfaceBeige,
              borderRadius: BorderRadius.circular(14),
            ),
            child: Center(
              child: Text(
                transaction['icon'] as String,
                style: const TextStyle(fontSize: 22),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  transaction['merchant'] as String,
                  style: AppTextStyles.headingSmall,
                ),
                const SizedBox(height: 2),
                Text(
                  transaction['time'] as String,
                  style: AppTextStyles.bodySmall,
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                'Bs. ${(transaction['amount'] as double).abs().toStringAsFixed(2)}',
                style: AppTextStyles.labelLarge.copyWith(
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 2),
              Row(
                children: [
                  const Text('🌱', style: TextStyle(fontSize: 11)),
                  const SizedBox(width: 2),
                  Text(
                    '+${(transaction['saved'] as double).toStringAsFixed(2)}',
                    style: AppTextStyles.bodySmall.copyWith(
                      color: AppColors.success,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}
