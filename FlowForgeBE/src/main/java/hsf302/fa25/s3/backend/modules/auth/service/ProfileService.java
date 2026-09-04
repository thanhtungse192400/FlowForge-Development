package hsf302.fa25.s3.backend.modules.auth.service;

import hsf302.fa25.s3.backend.modules.auth.dto.request.ProfileRequest;
import hsf302.fa25.s3.backend.modules.auth.dto.response.ProfileResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

public interface ProfileService {
    ProfileResponse getProfile(UUID userId);
    ProfileResponse updateProfile(UUID userId, ProfileRequest request);
    ProfileResponse uploadAvatar(UUID userId, MultipartFile file);
}
