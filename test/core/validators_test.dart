import 'package:flutter_test/flutter_test.dart';
import 'package:labilletera/core/utils/validators.dart';

void main() {
  group('Validators', () {
    test('email returns null for valid email', () {
      expect(Validators.email('test@example.com'), isNull);
    });

    test('email returns error for invalid email', () {
      expect(Validators.email('invalid'), isNotNull);
    });

    test('password returns null for valid password', () {
      expect(Validators.password('123456'), isNull);
    });

    test('password returns error for short password', () {
      expect(Validators.password('123'), isNotNull);
    });
  });
}
