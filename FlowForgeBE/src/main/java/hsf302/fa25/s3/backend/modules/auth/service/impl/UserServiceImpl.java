package hsf302.fa25.s3.backend.modules.auth.service.impl;

import org.modelmapper.ModelMapper;
import hsf302.fa25.s3.backend.modules.auth.dto.response.UserResponse;
import hsf302.fa25.s3.backend.modules.auth.entity.User;
import hsf302.fa25.s3.backend.modules.auth.repository.UserRepository;
import hsf302.fa25.s3.backend.modules.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> searchUsers(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            // Return empty list if no keyword is provided
            return List.of();
        }

        return userRepository.searchUsers(keyword.trim()).stream()
                .map(user -> modelMapper.map(user, UserResponse.class))
                .collect(Collectors.toList());
    }
}
