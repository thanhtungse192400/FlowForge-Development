package hsf302.fa25.s3.backend.modules.auth.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import hsf302.fa25.s3.backend.modules.auth.dto.request.ProfileRequest;
import hsf302.fa25.s3.backend.modules.auth.dto.response.ProfileResponse;
import hsf302.fa25.s3.backend.modules.auth.entity.User;
import hsf302.fa25.s3.backend.modules.auth.exception.TaskException;
import hsf302.fa25.s3.backend.modules.auth.repository.UserRepository;
import hsf302.fa25.s3.backend.modules.auth.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final UserRepository userRepository;
    private final Cloudinary cloudinary;
    private final ModelMapper modelMapper;

    @Override
    @Transactional(readOnly = true)
    public ProfileResponse getProfile(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new TaskException("User not found"));
        return modelMapper.map(user, ProfileResponse.class);
    }

    @Override
    @Transactional
    public ProfileResponse updateProfile(UUID userId, ProfileRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new TaskException("User not found"));

        // Kiểm tra trùng lặp trường 'name' (username) nếu user muốn đổi
        if (req.getName() != null && !req.getName().equals(user.getName())) {
            if (userRepository.existsByName(req.getName().trim())) {
                throw new TaskException("Username already taken");
            }
            user.setName(req.getName().trim());
        }

        // Cập nhật thông tin dựa theo đúng thuộc tính Entity của bạn
        if (req.getFullName() != null) {
            user.setFullName(req.getFullName().trim()); // Áp dụng cho trường 'FullName' (Lombok tự xử lý camelCase thành setFullName)
        }
        if (req.getPhone() != null) {
            user.setPhone(req.getPhone().trim()); // Khớp với trường 'phone' trong Entity
        }

        User updatedUser = userRepository.save(user);
        return modelMapper.map(updatedUser, ProfileResponse.class);
    }

    @Override
    @Transactional
    public ProfileResponse uploadAvatar(UUID userId, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new TaskException("User not found"));

        if (file == null || file.isEmpty()) {
            throw new TaskException("File is empty");
        }

        try {
            // Đẩy tệp tin lên hệ thống Cloudinary
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap("folder", "avatars"));

            String avatarUrl = (String) uploadResult.get("secure_url");

            // Lưu trực tiếp đường dẫn ảnh vào trường 'avatarUrl' của Entity
            user.setAvatarUrl(avatarUrl);
            User updatedUser = userRepository.save(user);

            return modelMapper.map(updatedUser, ProfileResponse.class);
        } catch (IOException e) {
            throw new TaskException("Failed to upload image to Cloudinary");
        }
    }
}