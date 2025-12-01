import Swal, { SweetAlertOptions } from 'sweetalert2';

// Default configuration for all alerts
const defaultConfig = {
  confirmButtonColor: '#3B82F6', // Blue color matching the theme
  cancelButtonColor: '#EF4444', // Red color
  confirmButtonText: 'OK',
  cancelButtonText: 'Cancel',
  allowOutsideClick: false,
  allowEscapeKey: true,
  showCloseButton: true,
};

// Success alert
export const showSuccess = (
  title: string,
  text?: string,
  options?: SweetAlertOptions
) => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'success',
    title,
    text,
    timer: options?.timer || undefined,
    timerProgressBar: options?.timer ? true : false,
    showConfirmButton: options?.timer ? false : true,
    ...options,
  });
};

// Error alert
export const showError = (
  title: string,
  text?: string,
  options?: SweetAlertOptions
) => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'error',
    title,
    text,
    confirmButtonText: 'Try Again',
    allowOutsideClick: false, // Force user to click button
    allowEscapeKey: false, // Don't allow ESC key
    allowEnterKey: true, // Allow Enter to dismiss
    ...options,
  });
};

// Warning alert
export const showWarning = (
  title: string,
  text?: string,
  options?: SweetAlertOptions
) => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'warning',
    title,
    text,
    ...options,
  });
};

// Info alert
export const showInfo = (
  title: string,
  text?: string,
  options?: SweetAlertOptions
) => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'info',
    title,
    text,
    ...options,
  });
};

// Confirmation dialog
export const showConfirm = (
  title: string,
  text?: string,
  options?: SweetAlertOptions
) => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'question',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    ...options,
  });
};

// Delete confirmation
export const showDeleteConfirm = (
  itemName: string = 'this item',
  options?: SweetAlertOptions
) => {
  return Swal.fire({
    ...defaultConfig,
    icon: 'warning',
    title: 'Are you sure?',
    text: `Do you want to delete ${itemName}? This action cannot be undone.`,
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    confirmButtonColor: '#EF4444', // Red for delete
    cancelButtonText: 'Cancel',
    ...options,
  });
};

// Loading alert
export const showLoading = (title: string = 'Please wait...') => {
  return Swal.fire({
    title,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

// Close loading
export const closeLoading = () => {
  Swal.close();
};

// Toast notification (bottom-right corner)
export const showToast = (
  icon: 'success' | 'error' | 'warning' | 'info',
  title: string,
  timer: number = 3000
) => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  return Toast.fire({
    icon,
    title,
  });
};
