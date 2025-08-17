package upce.backend;

import io.github.cdimascio.dotenv.Dotenv;
import io.github.cdimascio.dotenv.DotenvEntry;
import org.jetbrains.annotations.NotNull;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.env.MutablePropertySources;
import org.springframework.core.env.StandardEnvironment;

import java.util.Map;
import java.util.stream.Collectors;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        Map<String, Object> env = Dotenv
                .configure()
                .directory("implementation/backend")
                .load()
                .entries()
                .stream()
                .collect(
                        Collectors.toMap(DotenvEntry::getKey, DotenvEntry::getValue));

        new SpringApplicationBuilder(BackendApplication.class)
                .environment(new StandardEnvironment() {
                    @Override
                    protected void customizePropertySources(@NotNull MutablePropertySources propertySources) {
                        super.customizePropertySources(propertySources);
                        propertySources.addLast(new MapPropertySource("dotenvProperties", env));
                    }
                }).run(args);
    }
}
