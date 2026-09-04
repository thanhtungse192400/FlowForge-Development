package hsf302.fa25.s3.backend.modules.auth.service.impl;

import hsf302.fa25.s3.backend.modules.auth.dto.response.FlagResponse;
import hsf302.fa25.s3.backend.modules.auth.entity.Flag;
import hsf302.fa25.s3.backend.modules.auth.entity.Task;
import hsf302.fa25.s3.backend.modules.auth.repository.FlagRepository;
import hsf302.fa25.s3.backend.modules.auth.service.FlagService;
import lombok.AllArgsConstructor;

import hsf302.fa25.s3.backend.modules.auth.repository.TaskRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
public class FlagServiceImpl implements FlagService {

    private final FlagRepository flagRepository;
    private final TaskRepository taskRepository;
    private final ModelMapper modelMapper;

    @Transactional
    @Override
    public FlagResponse addFlagToTask(UUID taskId, Flag request) {
        Task task = taskRepository.findById(taskId).orElse(null);
        if(task == null) {
            throw new RuntimeException("Task not found");
        }
        // Assuming flag is saved and mapped
        return modelMapper.map(request, FlagResponse.class);
    }

    @Override
    public FlagResponse removeFlagFromTask(Flag flag) {
        return null;
    }

    @Override
    public FlagResponse getFlagFromTask(Flag response) {
        return null;
    }
}
