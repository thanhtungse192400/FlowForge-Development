package hsf302.fa25.s3.practicehrai.entity;

import hsf302.fa25.s3.practicehrai.dto.InterviewStatus;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Getter
@Setter
@Builder
public class InterviewSession {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String candidateName;

    @Enumerated(EnumType.STRING) // Lưu enum dưới dạng chữ (VARCHAR) trong DB
    private InterviewStatus status;

    private Integer aiScore;
}