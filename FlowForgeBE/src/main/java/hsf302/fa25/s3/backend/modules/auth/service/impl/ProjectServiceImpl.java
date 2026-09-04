package hsf302.fa25.s3.backend.modules.auth.service.impl;

import hsf302.fa25.s3.backend.modules.auth.dto.request.ProjectRequest;
import hsf302.fa25.s3.backend.modules.auth.dto.response.ProjectMemberResponse;
import hsf302.fa25.s3.backend.modules.auth.dto.response.ProjectResponse;
import hsf302.fa25.s3.backend.modules.auth.entity.Project;
import hsf302.fa25.s3.backend.modules.auth.entity.ProjectMember;
import hsf302.fa25.s3.backend.modules.auth.entity.User;
import hsf302.fa25.s3.backend.modules.auth.enums.ProjectRoleStatus;
import hsf302.fa25.s3.backend.modules.auth.exception.ProjectError;
import hsf302.fa25.s3.backend.modules.auth.exception.TaskException;
import hsf302.fa25.s3.backend.modules.auth.repository.ProjectMemberRepository;
import hsf302.fa25.s3.backend.modules.auth.repository.ProjectRepository;
import hsf302.fa25.s3.backend.modules.auth.repository.UserRepository;
import hsf302.fa25.s3.backend.modules.auth.service.ProjectMemberService;
import hsf302.fa25.s3.backend.modules.auth.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final ProjectMemberService projectMemberService;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public ProjectResponse createProject(ProjectRequest req, UUID userId) {

        if (req == null || req.name == null || req.name.trim().isEmpty()) {
            throw new TaskException("Project name is required");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new TaskException("User not found"));

        Project project = new Project();
        project.setName(req.name.trim());
        project.setDescription(
                req.description != null
                        ? req.description.trim()
                        : null
        );

        Project savedProject = projectRepository.save(project);

        ProjectMember member = new ProjectMember();
        member.setProject(savedProject);
        member.setUser(user);
        member.setStatus(ProjectRoleStatus.OWNER);

        projectMemberRepository.save(member);

        return map(savedProject);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> getAllProjects() {

        return projectRepository.findAll()
                .stream()
                .map(this::map)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(UUID id, UUID userId) {

        if (id == null) {
            throw new TaskException("id is null");
        }

        Project project = projectRepository.findById(id)
                .orElseThrow(() ->
                        new TaskException(ProjectError.PROJECT_NOT_FOUND));

        boolean isMember = projectMemberRepository.existsByProject_ProjectIdAndUser_Id(id, userId);
        if (!isMember) {
            throw new TaskException("Access denied: You are not a member of this project");
        }

        return map(project);
    }

    @Override
    @Transactional
    public ProjectResponse updateProject(
            UUID id,
            ProjectRequest req,
            UUID userId
    ) {

        if (id == null) {
            throw new TaskException("id is null");
        }

        if (req == null || req.name == null || req.name.trim().isEmpty()) {
            throw new TaskException("Project name is required");
        }

        Project project = projectRepository.findById(id)
                .orElseThrow(() ->
                        new TaskException(ProjectError.PROJECT_NOT_FOUND));

        boolean isOwner = projectMemberRepository.existsByProject_ProjectIdAndUser_IdAndStatus(
                id, userId, ProjectRoleStatus.OWNER
        );
        if (!isOwner) {
            throw new TaskException("Access denied: Only the project owner can update this project");
        }

        project.setName(req.name.trim());
        project.setDescription(
                req.description != null
                        ? req.description.trim()
                        : null
        );

        projectRepository.save(project);

        return map(project);
    }

    @Override
    @Transactional
    public void deleteProject(UUID id, UUID userId) {

        if (id == null) {
            throw new TaskException("id is null");
        }

        Project project = projectRepository.findById(id)
                .orElseThrow(() ->
                        new TaskException(ProjectError.PROJECT_NOT_FOUND));

        boolean isOwner = projectMemberRepository.existsByProject_ProjectIdAndUser_IdAndStatus(
                id, userId, ProjectRoleStatus.OWNER
        );
        if (!isOwner) {
            throw new TaskException("Access denied: Only the project owner can delete this project");
        }

        projectRepository.delete(project);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectMemberResponse> getProjectsByUser(
            UUID userId
    ) {

        if (userId == null) {
            throw new TaskException("userId is null");
        }

        List<ProjectMemberResponse> list = projectMemberService.getProjectsByUserId(userId);
        if (list == null || list.isEmpty()) {
            return Collections.emptyList();
        }
        return list;
    }

    private ProjectResponse map(Project p) {
        ProjectResponse response = modelMapper.map(p, ProjectResponse.class);
        response.setProjectName(p.getName()); // Explicit mapping for difference
        return response;
    }
}