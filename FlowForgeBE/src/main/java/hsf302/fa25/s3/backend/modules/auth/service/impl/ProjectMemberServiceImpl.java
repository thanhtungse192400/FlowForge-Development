package hsf302.fa25.s3.backend.modules.auth.service.impl;

import hsf302.fa25.s3.backend.modules.auth.dto.request.ProjectMemberRequest;
import hsf302.fa25.s3.backend.modules.auth.dto.response.ProjectMemberResponse;
import hsf302.fa25.s3.backend.modules.auth.entity.Project;
import org.modelmapper.ModelMapper;
import hsf302.fa25.s3.backend.modules.auth.entity.ProjectMember;
import hsf302.fa25.s3.backend.modules.auth.entity.User;
import hsf302.fa25.s3.backend.modules.auth.enums.ProjectRoleStatus;
import hsf302.fa25.s3.backend.modules.auth.exception.ProjectError;
import hsf302.fa25.s3.backend.modules.auth.exception.TaskException;
import hsf302.fa25.s3.backend.modules.auth.repository.ProjectMemberRepository;
import hsf302.fa25.s3.backend.modules.auth.repository.ProjectRepository;
import hsf302.fa25.s3.backend.modules.auth.repository.UserRepository;
import hsf302.fa25.s3.backend.modules.auth.service.ProjectMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectMemberServiceImpl implements ProjectMemberService {

    private final ProjectMemberRepository projectMemberRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    private final ModelMapper modelMapper;

    // ================= ADD MEMBER =================
    @Override
    @Transactional
    public ProjectMemberResponse addMember(UUID projectId, UUID userId, ProjectMemberRequest req, UUID loggedInUserId) {

        if (projectId == null || userId == null) {
            throw new TaskException("projectId or userId is null");
        }

        if (req == null || req.getRole() == null) {
            throw new TaskException("role is required");
        }

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new TaskException(ProjectError.PROJECT_NOT_FOUND));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new TaskException(ProjectError.USER_NOT_FOUND));

        // CHECK OWNER
        boolean isOwner = projectMemberRepository.existsByProject_ProjectIdAndUser_IdAndStatus(
                projectId, loggedInUserId, ProjectRoleStatus.OWNER
        );
        if (!isOwner) {
            throw new TaskException("Access denied: Only project owner can add members");
        }

        // CHECK DUPLICATE
        boolean exists = projectMemberRepository
                .existsByProject_ProjectIdAndUser_Id(projectId, userId);

        if (exists) {
            throw new TaskException(ProjectError.USER_ALREADY_IN_PROJECT);
        }

        ProjectMember member = new ProjectMember();
        member.setProject(project);
        member.setUser(user);
        member.setStatus(req.getRole());
        member.setJoinedAt(LocalDateTime.now());

        projectMemberRepository.save(member);

        return map(member);
    }

    // ================= GET MEMBERS BY PROJECT =================
    @Override
    @Transactional(readOnly = true)
    public List<ProjectMemberResponse> getMembersByProjectId(UUID projectId) {

        if (projectId == null) {
            throw new TaskException("projectId is null");
        }

        return projectMemberRepository
                .findByProject_ProjectId(projectId)
                .stream()
                .map(this::map)
                .toList();
    }

    // ================= UPDATE ROLE =================
    @Override
    @Transactional
    public ProjectMemberResponse updateRole(UUID projectId, UUID userId, ProjectMemberRequest req, UUID loggedInUserId) {

        if (req == null || req.getRole() == null) {
            throw new TaskException("role is required");
        }

        // CHECK OWNER
        boolean isOwner = projectMemberRepository.existsByProject_ProjectIdAndUser_IdAndStatus(
                projectId, loggedInUserId, ProjectRoleStatus.OWNER
        );
        if (!isOwner) {
            throw new TaskException("Access denied: Only project owner can update roles");
        }

        ProjectMember member = projectMemberRepository
                .findByProject_ProjectIdAndUser_Id(projectId, userId)
                .orElseThrow(() -> new TaskException(ProjectError.MEMBER_NOT_FOUND));

        member.setStatus(req.getRole());

        projectMemberRepository.save(member);

        return map(member);
    }

    // ================= REMOVE MEMBER =================
    @Override
    @Transactional
    public void removeMember(UUID projectId, UUID userId, UUID loggedInUserId) {

        // CHECK OWNER OR SELF
        boolean isOwner = projectMemberRepository.existsByProject_ProjectIdAndUser_IdAndStatus(
                projectId, loggedInUserId, ProjectRoleStatus.OWNER
        );
        boolean isSelf = loggedInUserId.equals(userId);

        if (!isOwner && !isSelf) {
            throw new TaskException("Access denied: Only project owner or the member themselves can remove this member");
        }

        boolean exists = projectMemberRepository
                .existsByProject_ProjectIdAndUser_Id(projectId, userId);

        if (!exists) {
            throw new TaskException(ProjectError.MEMBER_NOT_FOUND);
        }

        projectMemberRepository
                .deleteByProject_ProjectIdAndUser_Id(projectId, userId);
    }

    // ================= GET PROJECTS BY USER =================
    @Override
    @Transactional(readOnly = true)
    public List<ProjectMemberResponse> getProjectsByUserId(UUID userId) {

        if (userId == null) {
            throw new TaskException("userId is null");
        }

        return projectMemberRepository
                .findByUser_Id(userId)
                .stream()
                .map(this::map)
                .toList();
    }

    // ================= MAPPER =================
    private ProjectMemberResponse map(ProjectMember pm) {
        ProjectMemberResponse response = modelMapper.map(pm, ProjectMemberResponse.class);
        response.setProjectName(pm.getProject().getName());
        response.setUserEmail(pm.getUser().getEmail());
        response.setProjectId(pm.getProject().getProjectId());
        response.setUserId(pm.getUser().getId());
        response.setUserName(pm.getUser().getName());
        response.setRole(pm.getStatus());
        return response;
    }
}