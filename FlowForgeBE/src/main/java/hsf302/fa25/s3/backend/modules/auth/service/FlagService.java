package hsf302.fa25.s3.backend.modules.auth.service;

import hsf302.fa25.s3.backend.modules.auth.dto.response.FlagResponse;
import hsf302.fa25.s3.backend.modules.auth.entity.Flag;

import java.util.List;
import java.util.UUID;

public interface FlagService {
    FlagResponse addFlagToTask(UUID taskId, Flag request);
    FlagResponse removeFlagFromTask(Flag flag);
    FlagResponse getFlagFromTask(Flag response);
}
