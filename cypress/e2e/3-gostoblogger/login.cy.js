const MSG_INPUT_ALL_FIELDS = "Please input all fields"
const MSG_EMAIL_REQUIRED = "Email is required!"
const MSG_PASSWORD_REQUIRED = "Password is required!"
const MSG_WELCOME_BACK = "Welcome back"
const MSG_INVALID_EMAIL_ADDRESS = "Invalid email address!"
const MSG_INCORRECT_INFO = "Email or password is incorrect.."

describe('Role User', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.visit('http://localhost:3000/login')
    })

    it('1. Đăng nhập với tài khoản User hợp lệ', () => {
        const email = 'lelong.ll32@gmail.com';
        const password = '12345678'

        cy.get('#login_form_email').type(email)
        cy.get('#login_form_password').type(password)

        cy.get('#btn-login').click()

        // Error input field
        cy.get('.ant-form-item-explain-error').should('not.exist')

        cy.get('.Toastify').should('exist').and('contain.text', 'Welcome back')
    })

    it('2. Đăng nhập với tài khoản User không tồn tại', () => {
        const email = 'user@gmail.com';
        const password = '12345678'

        cy.get('#login_form_email').type(email)
        cy.get('#login_form_password').type(password)

        cy.get('#btn-login').click()

        // Error input field
        cy.get('.ant-form-item-explain-error').should('not.exist')

        cy.get('.Toastify').should('exist').and('contain.text', MSG_INCORRECT_INFO)
    })

    it('3. Đăng nhập với tài khoản User sai mật khẩu', () => {
        const email = 'lelong.ll32@gmail.com';
        const password = 'lelong'

        cy.get('#login_form_email').type(email)
        cy.get('#login_form_password').type(password)

        cy.get('#btn-login').click()

        // Error input field
        cy.get('.ant-form-item-explain-error').should('not.exist')

        cy.get('.Toastify').should('exist').and('contain.text', MSG_INCORRECT_INFO)
    })

    it('4. Đăng nhập với tài khoản User (Email hoặc Password để trống)', () => {
        // 4.1. Email để trống
        const password = '12345678';

        cy.get('#login_form_password').type(password);
        cy.get('#btn-login').click();

        // Error email input field
        cy.get('.ant-form-item-explain-error').should('exist').and('contain.text', MSG_EMAIL_REQUIRED);
        cy.get('.Toastify').should('contain.text', MSG_INPUT_ALL_FIELDS)

        // Clear password field
        cy.get('#login_form_password').clear();

        // 4.2. Password để trống
        const email = 'lelong.ll32@gmail.com';

        cy.get('#login_form_email').type(email);
        cy.get('#btn-login').click();

        // Error password input field
        cy.get('.ant-form-item-explain-error').should('exist').and('contain.text', MSG_PASSWORD_REQUIRED);
        cy.get('.Toastify').should('contain.text', MSG_INPUT_ALL_FIELDS)

        // Clear email field
        cy.get('#login_form_email').clear();
    })

    it('5. Đăng nhập với tài khoản User (để trống cả hai trường Email và Password)', () => {
        cy.get('#btn-login').click();

        // Error email & password input field
        cy.get('.ant-form-item-explain-error')
            .should('exist')
            .and('contain.text', MSG_EMAIL_REQUIRED)
            .and('contain.text', MSG_PASSWORD_REQUIRED)
        cy.get('.Toastify').should('contain.text', MSG_INPUT_ALL_FIELDS)
    })

    it('6. Đăng nhập với email sai định dạng', () => {
        const email = 'lelong.com';
        const password = '12345678'

        cy.get('#login_form_email').type(email)
        cy.get('#login_form_password').type(password)

        cy.get('#btn-login').click();

        // Error input field
        cy.get('.ant-form-item-explain-error').should('exist').and('contain.text', MSG_INVALID_EMAIL_ADDRESS)

        cy.get('.Toastify').should('exist').and('contain.text', MSG_INPUT_ALL_FIELDS)
    })
})

describe('Role Admin', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.visit('http://localhost:3000/login')
    })

    it('7. Đăng nhập với tài khoản Admin hợp lệ', () => {
        const email = 'dean72@example.org';
        const password = '12345678'

        cy.get('#login_form_email').type(email)
        cy.get('#login_form_password').type(password)

        cy.get('#btn-login').click()

        // Error input field
        cy.get('.ant-form-item-explain-error').should('not.exist')

        cy.get('.Toastify').should('contain.text', MSG_WELCOME_BACK)

        // Kiểm tra xem URL có chứa chuỗi "forgot-password" hay không
        cy.url().should('include', 'admin');
    })

    it('8. Đăng nhập với tài khoản Admin không tồn tại', () => {
        const email = 'admin@gmail.com';
        const password = '12345678'

        cy.get('#login_form_email').type(email)
        cy.get('#login_form_password').type(password)

        cy.get('#btn-login').click()

        // Error input field
        cy.get('.ant-form-item-explain-error').should('not.exist')

        cy.get('.Toastify').should('exist').and('contain.text', MSG_INCORRECT_INFO)
    })

    it('9. Đăng nhập với tài khoản Admin sai mật khẩu', () => {
        const email = 'dean72@example.org';
        const password = 'dean'

        cy.get('#login_form_email').type(email)
        cy.get('#login_form_password').type(password)

        cy.get('#btn-login').click()

        // Error input field
        cy.get('.ant-form-item-explain-error').should('not.exist')

        cy.get('.Toastify').should('exist').and('contain.text', MSG_INCORRECT_INFO)
    })

    it('10. Đăng nhập với tài khoản Admin (Email hoặc Password để trống)', () => {
        // 4.1. Email để trống
        const password = '12345678';

        cy.get('#login_form_password').type(password);
        cy.get('#btn-login').click();

        // Error email input field
        cy.get('.ant-form-item-explain-error').should('exist').and('contain.text', MSG_EMAIL_REQUIRED);
        cy.get('.Toastify').should('contain.text', MSG_INPUT_ALL_FIELDS)

        // Clear password field
        cy.get('#login_form_password').clear();

        // 4.2. Password để trống
        const email = 'dean72@example.org';

        cy.get('#login_form_email').type(email);
        cy.get('#btn-login').click();

        // Error password input field
        cy.get('.ant-form-item-explain-error').should('exist').and('contain.text', MSG_PASSWORD_REQUIRED);
        cy.get('.Toastify').should('contain.text', MSG_INPUT_ALL_FIELDS)

        // Clear email field
        cy.get('#login_form_email').clear();

        // 4.3. Cả email và password để trống
        cy.get('#btn-login').click();

        // Error email & password input field
        cy.get('.ant-form-item-explain-error')
            .should('exist')
            .and('contain.text', MSG_EMAIL_REQUIRED)
            .and('contain.text', MSG_PASSWORD_REQUIRED)
        cy.get('.Toastify').should('contain.text', MSG_INPUT_ALL_FIELDS)
    })
})

describe('Quên mật khẩu', () => {
    it('11. Click vào đường link "Quên mật khẩu"', () => {
        cy.viewport(1920, 1080)
        cy.visit('http://localhost:3000/login')

        cy.get('#forgot-password').should('contain.text', 'Forgot Password')
        cy.get('#forgot-password').click()

        // Kiểm tra xem URL có chứa chuỗi "forgot-password" hay không
        cy.url().should('include', 'forgot-password');
        cy.get('#login-link').should('exist').and('contain.text', 'Back to login')
    })
})
