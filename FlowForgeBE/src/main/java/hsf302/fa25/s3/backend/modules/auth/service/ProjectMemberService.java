package hsf302.fa25.s3.backend.modules.auth.service;

import hsf302.fa25.s3.backend.modules.auth.dto.request.ProjectMemberRequest;
import hsf302.fa25.s3.backend.modules.auth.dto.response.ProjectMemberResponse;
import hsf302.fa25.s3.backend.modules.auth.dto.response.ProjectResponse;
import hsf302.fa25.s3.backend.modules.auth.entity.Project;
import hsf302.fa25.s3.backend.modules.auth.entity.User;

import java.util.List;
import java.util.UUID;

public interface ProjectMemberService {

    ProjectMemberResponse addMember(UUID projectId, UUID userId, ProjectMemberRequest req, UUID loggedInUserId);

    List<ProjectMemberResponse> getMembersByProjectId(UUID projectId);

    ProjectMemberResponse updateRole(UUID projectId, UUID userId, ProjectMemberRequest req, UUID loggedInUserId);

    void removeMember(UUID projectId, UUID userId, UUID loggedInUserId);

    List<ProjectMemberResponse> getProjectsByUserId(UUID userId);
}