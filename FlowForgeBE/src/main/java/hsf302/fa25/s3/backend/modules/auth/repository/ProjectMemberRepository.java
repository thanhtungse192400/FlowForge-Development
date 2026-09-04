package hsf302.fa25.s3.backend.modules.auth.repository;

import hsf302.fa25.s3.backend.modules.auth.entity.ProjectMember;
import hsf302.fa25.s3.backend.modules.auth.enums.ProjectRoleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProjectMemberRepository extends JpaRepository<ProjectMember, UUID> {

    List<ProjectMember> findByUser_Id(UUID userId);

    List<ProjectMember> findByProject_ProjectId(UUID projectId);

    Optional<ProjectMember> findByProject_ProjectIdAndUser_Id(UUID projectId, UUID userId);

    boolean existsByProject_ProjectIdAndUser_Id(UUID projectId, UUID userId);

    boolean existsByProject_ProjectIdAndUser_IdAndStatus(
            UUID projectId,
            UUID userId,
            ProjectRoleStatus status
    );

    void deleteByProject_ProjectIdAndUser_Id(UUID projectId, UUID userId);

    void deleteByProject_ProjectId(UUID projectId);
}