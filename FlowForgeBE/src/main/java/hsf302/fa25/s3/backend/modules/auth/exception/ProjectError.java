package hsf302.fa25.s3.backend.modules.auth.exception;

public class ProjectError {

    public static final String PROJECT_NOT_FOUND = "Project not found";
    public static final String PROJECT_ALREADY_EXISTS = "Project already exists";

    public static final String USER_NOT_IN_PROJECT = "User is not in this project";
    public static final String USER_ALREADY_IN_PROJECT = "User already joined this project";

    public static final String MEMBER_NOT_FOUND = "Project member not found";

    public static final String ONLY_OWNER_CAN_DELETE =
            "Only project owner can delete this project";

    public static final String ONLY_ADMIN_CAN_ADD_MEMBER =
            "Only admin can add project members";

    public static final String CANNOT_ASSIGN_NON_MEMBER =
            "Cannot assign task to non-project member";
    public static final String USER_NOT_FOUND = "User is not in this project";
}
