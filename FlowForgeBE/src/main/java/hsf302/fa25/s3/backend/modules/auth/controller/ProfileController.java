package hsf302.fa25.s3.backend.modules.auth.controller;

import hsf302.fa25.s3.backend.modules.auth.dto.request.ProfileRequest;
import hsf302.fa25.s3.backend.modules.auth.dto.response.ApiResponse;
import hsf302.fa25.s3.backend.modules.auth.dto.response.ProfileResponse;
import hsf302.fa25.s3.backend.modules.auth.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/profile")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('USER', 'ADMIN', 'LEAD')")
public class ProfileController {

    private final ProfileService profileService;

    /**
     * Lấy thông tin hồ sơ cá nhân của người dùng hiện tại (đang đăng nhập)
     */
    @GetMapping
    public ApiResponse<ProfileResponse> getMyProfile(Principal principal) {
        UUID userId = UUID.fromString(principal.getName());
        ProfileResponse response = profileService.getProfile(userId);
        return ApiResponse.success("Get profile success", response);
    }

    /**
     * Cập nhật thông tin chữ (text) của Profile cá nhân (name, fullName, phone)
     */
    @PutMapping
    public ApiResponse<ProfileResponse> updateMyProfile(
            @RequestBody ProfileRequest req,
            Principal principal
    ) {
        UUID userId = UUID.fromString(principal.getName());
        ProfileResponse response = profileService.updateProfile(userId, req);
        return ApiResponse.success("Update profile success", response);
    }

    /**
     * Tải ảnh đại diện (avatar) của người dùng hiện tại lên Cloudinary
     * Đặt consumes là MULTIPART_FORM_DATA_VALUE để hỗ trợ truyền file từ Client
     */
    @PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<ProfileResponse> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            Principal principal
    ) {
        UUID userId = UUID.fromString(principal.getName());
        ProfileResponse response = profileService.uploadAvatar(userId, file);
        return ApiResponse.success("Upload avatar success", response);
    }
}
