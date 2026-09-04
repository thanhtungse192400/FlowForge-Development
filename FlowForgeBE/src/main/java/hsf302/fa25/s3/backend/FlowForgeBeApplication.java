package hsf302.fa25.s3.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class FlowForgeBeApplication {

    public static void main(String[] args) {
        SpringApplication.run(FlowForgeBeApplication.class, args);
    }

}
