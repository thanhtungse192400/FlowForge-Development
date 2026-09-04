package hsf302.fa25.s3.backend.modules.auth.service;

import hsf302.fa25.s3.backend.modules.auth.dto.request.ProjectRequest;
import hsf302.fa25.s3.backend.modules.auth.dto.response.ProjectMemberResponse;
import hsf302.fa25.s3.backend.modules.auth.dto.response.ProjectResponse;

import java.util.List;
import java.util.UUID;

public interface ProjectService {
    ProjectResponse createProject(ProjectRequest req, UUID userId);

    List<ProjectResponse> getAllProjects();

    ProjectResponse getProjectById(UUID id, UUID userId);

    ProjectResponse updateProject(
            UUID id,
            ProjectRequest req,
            UUID userId
    );

    void deleteProject(UUID id, UUID userId);

    List<ProjectMemberResponse> getProjectsByUser(UUID userId);
}
