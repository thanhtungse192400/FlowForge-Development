package hsf302.fa25.s3.backend.modules.auth.entity;

import hsf302.fa25.s3.backend.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter

public class Flag extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private  String username;
    @Column(columnDefinition = "TEXT")
    private String action;


    private String amounts;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id",referencedColumnName = "id")
    private Task task;




}
