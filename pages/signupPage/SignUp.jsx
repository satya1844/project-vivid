import { toast } from 'react-hot-toast';

function isValidPassword(password) {
  // At least 8 characters, one number, one special character
  return /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password);
}

function SignUp() {
  // ... existing code ...

  const handleSubmit = (e) => {
    e.preventDefault();
    // ... other validations ...

    if (!isValidPassword(password)) {
      toast.error('Password must be at least 8 characters, include a number and a special character.');
      return;
    }

    // ... continue signup logic ...
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... your form fields ... */}
      {/* Remove or comment out any inline password error display here */}
      {/* {passwordError && <span className="error">{passwordError}</span>} */}
      <button type="submit">Sign Up</button>
    </form>
  );
}

export default SignUp;