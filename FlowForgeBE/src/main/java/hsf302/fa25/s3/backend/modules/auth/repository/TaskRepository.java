package hsf302.fa25.s3.backend.modules.auth.repository;

import hsf302.fa25.s3.backend.modules.auth.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {
    @Query("SELECT t FROM Task t JOIN t.project p JOIN p.members m WHERE m.user.id = :userId")
    List<Task> findAllTasksByMemberId(@Param("userId") UUID userId);

    List<Task> findAllByProjectProjectId(UUID projectId);
}