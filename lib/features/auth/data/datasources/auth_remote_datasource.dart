import 'package:dio/dio.dart';
import '../../../../core/constants/api_constants.dart';
import '../../../../core/network/api_client.dart';

abstract class AuthRemoteDataSource {
  Future<Map<String, dynamic>> login(String email, String password);
  Future<Map<String, dynamic>> register(String email, String password, String? name);
}

class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final ApiClient apiClient;

  AuthRemoteDataSourceImpl(this.apiClient);

  @override
  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await apiClient.post(
      '/auth/login',
      data: {'email': email, 'password': password},
    );
    return response.data;
  }

  @override
  Future<Map<String, dynamic>> register(
      String email, String password, String? name) async {
    final response = await apiClient.post(
      '/auth/register',
      data: {'email': email, 'password': password, 'name': name},
    );
    return response.data;
  }
}
