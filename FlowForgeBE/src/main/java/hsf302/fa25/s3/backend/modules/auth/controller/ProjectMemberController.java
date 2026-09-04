package hsf302.fa25.s3.backend.modules.auth.controller;

import hsf302.fa25.s3.backend.modules.auth.dto.request.ProjectMemberRequest;
import hsf302.fa25.s3.backend.modules.auth.dto.response.ApiResponse;
import hsf302.fa25.s3.backend.modules.auth.dto.response.ProjectMemberResponse;
import hsf302.fa25.s3.backend.modules.auth.service.ProjectMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('USER', 'ADMIN', 'LEAD')")
public class ProjectMemberController {

    private final ProjectMemberService projectMemberService;

    // ================= ADD MEMBER =================
    @PostMapping("/{projectId}/members/{userId}")
    public ApiResponse<ProjectMemberResponse> addMember(
            @PathVariable UUID projectId,
            @PathVariable UUID userId,
            @RequestBody ProjectMemberRequest req,
            Principal principal
    ) {
        UUID loggedInUserId = UUID.fromString(principal.getName());
        ProjectMemberResponse response = projectMemberService.addMember(projectId, userId, req, loggedInUserId);
        return ApiResponse.success("Add member success", response);
    }

    // ================= GET MEMBERS =================
    @GetMapping("/{projectId}/members")
    public ApiResponse<List<ProjectMemberResponse>> getMembers(
            @PathVariable UUID projectId
    ) {
        List<ProjectMemberResponse> response = projectMemberService.getMembersByProjectId(projectId);
        return ApiResponse.success("Get members success", response);
    }

    // ================= UPDATE ROLE =================
    @PutMapping("/{projectId}/members/{userId}")
    public ApiResponse<ProjectMemberResponse> updateRole(
            @PathVariable UUID projectId,
            @PathVariable UUID userId,
            @RequestBody ProjectMemberRequest req,
            Principal principal
    ) {
        UUID loggedInUserId = UUID.fromString(principal.getName());
        ProjectMemberResponse response = projectMemberService.updateRole(projectId, userId, req, loggedInUserId);
        return ApiResponse.success("Update role success", response);
    }

    // ================= REMOVE MEMBER =================
    @DeleteMapping("/{projectId}/members/{userId}")
    public ApiResponse<?> removeMember(
            @PathVariable UUID projectId,
            @PathVariable UUID userId,
            Principal principal
    ) {
        UUID loggedInUserId = UUID.fromString(principal.getName());
        projectMemberService.removeMember(projectId, userId, loggedInUserId);
        return ApiResponse.success("Remove member success", null);
    }

    // ================= USER PROJECTS =================
    @GetMapping("/members/user/{userId}")
    public ApiResponse<List<ProjectMemberResponse>> getProjectsByUser(
            @PathVariable UUID userId
    ) {
        List<ProjectMemberResponse> response = projectMemberService.getProjectsByUserId(userId);
        return ApiResponse.success(response.isEmpty() ? "No projects found for user" : "Get projects by user success", response);
    }
}
