// ── Complaint Validators ──────────────────────────────────────────────────────

const VALID_CATEGORIES = [
      'electricity', 'water_supply', 'roads_transport', 'sanitation',
      'police', 'healthcare', 'municipal', 'education', 'other',
];
const VALID_PRIORITIES = ['low', 'medium', 'high', 'emergency'];

export const validateComplaint = (data) => {
      const errors = {};
      const { title, description, category, priority } = data;

      if (!title?.trim()) errors.title = 'Title is required';
      else if (title.trim().length < 5) errors.title = 'Title must be at least 5 characters';
      else if (title.trim().length > 200) errors.title = 'Title cannot exceed 200 characters';

      if (!description?.trim()) errors.description = 'Description is required';
      else if (description.trim().length < 20) errors.description = 'Description must be at least 20 characters';
      else if (description.trim().length > 2000) errors.description = 'Description cannot exceed 2000 characters';

      if (!category) errors.category = 'Category is required';
      else if (!VALID_CATEGORIES.includes(category)) errors.category = 'Invalid category';

      if (priority && !VALID_PRIORITIES.includes(priority)) errors.priority = 'Invalid priority level';

      return { isValid: Object.keys(errors).length === 0, errors };
};

export const validateStatusUpdate = (data) => {
      const errors = {};
      const VALID_STATUSES = ['pending', 'assigned', 'in_progress', 'resolved', 'closed', 'rejected'];

      if (!data.status) errors.status = 'Status is required';
      else if (!VALID_STATUSES.includes(data.status)) errors.status = 'Invalid status value';

      return { isValid: Object.keys(errors).length === 0, errors };
};
