package hsf302.fa25.s3.backend.modules.auth.service;

import hsf302.fa25.s3.backend.modules.auth.dto.response.UserResponse;

import java.util.List;

public interface UserService {
    List<UserResponse> searchUsers(String keyword);
}
