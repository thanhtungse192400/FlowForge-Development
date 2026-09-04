package hsf302.fa25.s3.backend.modules.auth.repository;

import hsf302.fa25.s3.backend.modules.auth.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {

}
