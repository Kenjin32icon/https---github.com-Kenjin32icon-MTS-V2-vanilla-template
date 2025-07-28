
    // Initialize Supabase
    // const supabaseUrl = 'YOUR_SUPABASE_URL';
    // const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
    // const supabase = supabase.createClient(supabaseUrl, supabaseKey);

    // DOM elements
    const loginToggle = document.getElementById('login-toggle');
    const signupToggle = document.getElementById('signup-toggle');
    const authForm = document.getElementById('auth-form');
    const formTitle = document.getElementById('form-title');
    const formSubtitle = document.getElementById('form-subtitle');
    const nameField = document.getElementById('name-field');
    const passwordConfirmField = document.getElementById('password-confirm-field');
    const authFeedback = document.getElementById('auth-feedback');
    const submitBtn = document.getElementById('submit-btn');
    const authSuccess = document.getElementById('auth-success');
    const successMessage = document.getElementById('success-message');

    let isLogin = true;

    // Toggle between login and signup
    loginToggle.addEventListener('click', () => {
      if (isLogin) return;
      toggleForms(true);
    });

    signupToggle.addEventListener('click', () => {
      if (!isLogin) return;
      toggleForms(false);
    });

    function toggleForms(showLogin) {
      isLogin = showLogin;
      loginToggle.classList.toggle('active', showLogin);
      loginToggle.classList.toggle('text-gray-800', showLogin);
      loginToggle.classList.toggle('text-gray-500', !showLogin);
      signupToggle.classList.toggle('active', !showLogin);
      signupToggle.classList.toggle('text-gray-800', !showLogin);
      signupToggle.classList.toggle('text-gray-500', showLogin);

      nameField.classList.toggle('hidden', showLogin);
      passwordConfirmField.classList.toggle('hidden', showLogin);

      if (showLogin) {
        formTitle.textContent = 'Welcome Back';
        formSubtitle.textContent = 'Please sign in to your account';
        submitBtn.textContent = 'Sign In';
      } else {
        formTitle.textContent = 'Create Account';
        formSubtitle.textContent = 'Get started with your account today';
        submitBtn.textContent = 'Sign Up';
      }

      authFeedback.classList.add('hidden');
      authSuccess.classList.add('hidden');
    }

    // Form submission
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      submitBtn.disabled = true;
      submitBtn.innerHTML = isLogin ? 
        `<span class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Signing in...
        </span>` :
        `<span class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Creating account...
        </span>`;

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const name = isLogin ? null : document.getElementById('name').value;
      const passwordConfirm = isLogin ? null : document.getElementById('password-confirm').value;

      authFeedback.classList.add('hidden');

      // Validate inputs
      if (!isLogin && password !== passwordConfirm) {
        showError('Passwords do not match');
        return;
      }

      try {
        let response;
        if (isLogin) {
          // Sign in
          response = await supabase.auth.signInWithPassword({ email, password });
        } else {
          // Sign up
          response = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name: name,
              }
            }
          });
        }

        const { error } = response;
        if (error) {
          showError(error.message);
        } else {
          if (isLogin) {
            showSuccess('Successfully signed in! Redirecting...');
            // Redirect or update UI for logged in user
          } else {
            showSuccess('Account created! Please check your email for confirmation.');
            toggleForms(true);
          }
        }
      } catch (err) {
        showError('An unexpected error occurred');
        console.error(err);
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = isLogin ? 'Sign In' : 'Sign Up';
      }
    });

    function showError(message) {
      authFeedback.textContent = message;
      authFeedback.classList.remove('hidden');
      submitBtn.disabled = false;
      submitBtn.textContent = isLogin ? 'Sign In' : 'Sign Up';
    }

    function showSuccess(message) {
      successMessage.textContent = message;
      authSuccess.classList.remove('hidden');
      authForm.reset();
    }
  