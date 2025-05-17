import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * password Encoding 테스트용 소스
 * */
public class PwdEncodeTest {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    PasswordEncoder passwordEncoder; // DI

    void pwdEnc() {

        String pwd = "1234";
        String encodedPwd = passwordEncoder.encode(pwd); //암호화 하는부분
        logger.info(encodedPwd);

    }
}
