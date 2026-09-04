package hsf302.fa25.s3.backend.modules.auth.entity;

import hsf302.fa25.s3.backend.common.entity.BaseEntity;
import hsf302.fa25.s3.backend.modules.auth.enums.RoleStatus;
import jakarta.persistence.*;
import lombok.*;

import javax.management.relation.Role;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;


    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    private String password;
    private String phone;
    @Enumerated(EnumType.STRING)
    private RoleStatus role;
    private String avatarUrl;

    private String FullName;


    @OneToMany(mappedBy = "createdBy")
    private List<Task> createdTasks;

    @OneToMany(mappedBy = "assignedTo")
    private List<Task> assignedTasks;

    @OneToMany(mappedBy = "user")
    private List<ProjectMember> projectMembers;


}