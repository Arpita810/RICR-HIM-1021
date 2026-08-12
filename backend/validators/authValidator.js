// ── Auth Validators ───────────────────────────────────────────────────────────

export const validateRegister = (data) => {
      const errors = {};
      const { name, email, password, role, phone } = data;

      if (!name?.trim()) errors.name = 'Name is required';
      else if (name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
      else if (name.trim().length > 100) errors.name = 'Name cannot exceed 100 characters';

      if (!email?.trim()) errors.email = 'Email is required';
      else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Invalid email address';

      if (!password) errors.password = 'Password is required';
      else if (password.length < 8) errors.password = 'Password must be at least 8 characters';
      else if (!/(?=.*[A-Z])/.test(password)) errors.password = 'Password must contain at least one uppercase letter';
      else if (!/(?=.*[a-z])/.test(password)) errors.password = 'Password must contain at least one lowercase letter';
      else if (!/(?=.*\d)/.test(password)) errors.password = 'Password must contain at least one number';

      if (phone && !/^[6-9]\d{9}$/.test(phone)) errors.phone = 'Enter a valid 10-digit Indian mobile number';

      const validRoles = ['citizen', 'officer', 'admin'];
      if (role && !validRoles.includes(role)) errors.role = 'Invalid role';

      return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateLogin = (data) => {
      const errors = {};
      const { email, password } = data;

      if (!email?.trim()) errors.email = 'Email is required';
      else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Invalid email address';

      if (!password) errors.password = 'Password is required';

      return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateOTP = (data) => {
      const errors = {};
      const { email, otp } = data;

      if (!email?.trim()) errors.email = 'Email is required';
      else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Invalid email address';

      if (!otp) errors.otp = 'OTP is required';
      else if (!/^\d{6}$/.test(otp)) errors.otp = 'OTP must be exactly 6 digits';

      return { isValid: Object.keys(errors).length === 0, errors };
};
