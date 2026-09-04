package hsf302.fa25.s3.backend.modules.auth.repository;

import hsf302.fa25.s3.backend.modules.auth.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
@Repository
public interface LikeRepository extends JpaRepository<Like, UUID> {
    List<Like> findByTaskId(UUID taskId);
}
