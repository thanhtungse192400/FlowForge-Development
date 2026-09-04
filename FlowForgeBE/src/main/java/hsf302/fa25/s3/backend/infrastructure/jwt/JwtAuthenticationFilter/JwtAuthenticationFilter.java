package hsf302.fa25.s3.backend.infrastructure.jwt.JwtAuthenticationFilter;
import hsf302.fa25.s3.backend.infrastructure.jwt.JwtService.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // 1. Lấy chuỗi Authorization từ Header của Request gửi lên
        String authHeader = request.getHeader("Authorization");

        // Nếu không có header hoặc không bắt đầu bằng "Bearer ", bỏ qua bộ lọc này (chuyển sang filter tiếp theo)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Cắt bỏ chữ "Bearer " (7 ký tự) để lấy chính xác chuỗi JWT Token
        String token = authHeader.substring(7);

        try {
            // 2. Sử dụng JwtService để giải mã lấy userId ra khỏi Token
            String userId = jwtService.extractUserId(token);

            // 3. Nếu lấy được UserId hợp lệ và hệ thống Security chưa thiết lập phiên làm việc (Authentication)
            if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // Giải mã Role từ Token
                String role = jwtService.extractRole(token);
                List<SimpleGrantedAuthority> authorities;
                if (role != null) {
                    String authorityRole = role;
                    if ("LEADER".equalsIgnoreCase(role)) {
                        authorityRole = "LEAD";
                    }
                    authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + authorityRole.toUpperCase()));
                } else {
                    authorities = Collections.emptyList();
                }

                // Tạo một chứng chỉ xác thực hợp lệ (đóng dấu thông hành) cho Spring Security
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userId, null, authorities
                );

                // Nạp chứng chỉ này vào Context của hệ thống để xác nhận: "Request này đã được log-in"
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            // Nếu token sai, bị sửa đổi hoặc hết hạn, logic sẽ nhảy vào đây.
            // Ta không nạp authentication vào Context -> Lát nữa Spring Security quét qua sẽ tự động chặn lại và báo lỗi 403.
            System.err.println("JWT Verification failed: " + e.getMessage());
            e.printStackTrace();
        }

        // Chuyển tiếp request sang filter tiếp theo trong chuỗi FilterChain
        filterChain.doFilter(request, response);
    }
}