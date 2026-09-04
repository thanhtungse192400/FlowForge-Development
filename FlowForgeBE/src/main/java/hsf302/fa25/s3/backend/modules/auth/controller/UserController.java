package hsf302.fa25.s3.backend.modules.auth.controller;

import hsf302.fa25.s3.backend.modules.auth.dto.response.ApiResponse;
import hsf302.fa25.s3.backend.modules.auth.dto.response.UserResponse;
import hsf302.fa25.s3.backend.modules.auth.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('USER', 'ADMIN', 'LEAD')")
public class UserController {

    private final UserService userService;

    @GetMapping("/search")
    public ApiResponse<List<UserResponse>> searchUsers(@RequestParam String keyword) {
        List<UserResponse> list = userService.searchUsers(keyword);
        return ApiResponse.success("Search users success", list);
    }
//    @GetMapping("/profile")
//    public ApiResponse<UserResponse> profile(@RequestParam String username) {
//        return userService.searchUsers()
//    }
}
