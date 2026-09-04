package hsf302.fa25.s3.backend.infrastructure.cloudinary;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dsbtbnme2",
                "api_key", "634187717873262",
                "api_secret", "1JV-lO9joWU8W9ZYwJLghCrTFFM",
                "secure", true
        ));
    }
}