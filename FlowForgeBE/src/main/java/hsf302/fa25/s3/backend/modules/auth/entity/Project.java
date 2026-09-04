package hsf302.fa25.s3.backend.modules.auth.entity;

import hsf302.fa25.s3.backend.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@Table(name = "projects")
@NoArgsConstructor
@AllArgsConstructor
public class Project extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private UUID projectId;
    @Column(nullable = false)
    private String name;
    private String description;
    @OneToMany(mappedBy = "project")
    private List<Task> tasks;

    @OneToMany(mappedBy = "project")
    private List<ProjectMember> members;


}
