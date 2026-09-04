package hsf302.fa25.s3.backend.modules.auth.service;

import hsf302.fa25.s3.backend.modules.auth.entity.Like;

import java.util.List;
import java.util.UUID;

public interface LikeService {
    Like addLikeToTask(UUID taskId, String username, String action, String amounts);
    List<Like> getAllLikeById(UUID taskId, String amounts);
    void removeLikeFromTask(UUID taskId, String username, String action, String amounts);
}
