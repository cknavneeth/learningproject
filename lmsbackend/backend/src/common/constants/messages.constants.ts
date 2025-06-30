export const MESSAGE = {
    AUTH: {
        LOGIN_SUCCESS: 'Login successful',
        LOGIN_FAILED: 'Invalid credentials',
        LOGOUT_SUCCESS: 'Logout successful',
        USER_BLOCKED: 'User is blocked',
        INVALID_TOKEN: 'Invalid token',
        TOKEN_EXPIRED: 'Token has expired',
        UNAUTHORIZED: 'Unauthorized access',
        EMAIL_ALREADY_EXISTS: 'Email already exists',
        ACCOUNT_NOT_VERIFIED: 'Account not verified',
        OTP_SENT: 'OTP has been sent to your email',
        OTP_VERIFIED: 'OTP verified successfully',
        OTP_INVALID: 'Invalid OTP',
        OTP_EXPIRED: 'OTP has expired',
        PASSWORD_RESET_SUCCESS: 'Password reset successful',
        GOOGLE_AUTH_FAILED: 'Google authentication failed'
    },

    USER: {
        CREATED: 'User created successfully',
        UPDATED: 'User updated successfully',
        DELETED: 'User deleted successfully',
        NOT_FOUND: 'User not found',
        BLOCKED: 'User has been blocked',
        UNBLOCKED: 'User has been unblocked',
        PROFILE_UPDATED: 'Profile updated successfully'
    },

    COURSE: {
        CREATED: 'Course created successfully',
        UPDATED: 'Course updated successfully',
        DELETED: 'Course deleted successfully',
        NOT_FOUND: 'Course not found',
        PUBLISHED: 'Course published successfully',
        UNPUBLISHED: 'Course unpublished successfully',
        ALREADY_EXISTS: 'Course already exists',
        UPLOAD_SUCCESS: 'Upload successful',
        UPLOAD_FAILED: 'Upload failed',
        INVALID_FILE: 'Invalid file type',
        NO_FILE: 'No file uploaded',
        VIDEO_REQUIRED: 'Video file is required',
        THUMBNAIL_REQUIRED: 'Thumbnail is required'
    },

    CATEGORY: {
        CREATED: 'Category created successfully',
        UPDATED: 'Category updated successfully',
        DELETED: 'Category deleted successfully',
        NOT_FOUND: 'Category not found',
        ALREADY_EXISTS: 'Category already exists',
        LISTED: 'Category listed successfully',
        UNLISTED: 'Category unlisted successfully'
    },

    CART: {
        ADDED: 'Item added to cart successfully',
        REMOVED: 'Item removed from cart successfully',
        CLEARED: 'Cart cleared successfully',
        NOT_FOUND: 'Cart not found',
        ITEM_NOT_FOUND: 'Item not found in cart',
        ALREADY_IN_CART: 'Item already in cart'
    },

    WISHLIST: {
        ADDED: 'Item added to wishlist successfully',
        REMOVED: 'Item removed from wishlist successfully',
        CLEARED: 'Wishlist cleared successfully',
        NOT_FOUND: 'Wishlist not found',
        ITEM_NOT_FOUND: 'Item not found in wishlist',
        ALREADY_IN_WISHLIST: 'Item already in wishlist'
    },

    INSTRUCTOR: {
        CREATED: 'Instructor created successfully',
        UPDATED: 'Instructor updated successfully',
        DELETED: 'Instructor deleted successfully',
        NOT_FOUND: 'Instructor not found',
        APPROVED: 'Instructor approved successfully',
        REJECTED: 'Instructor rejected',
        BLOCKED: 'Instructor has been blocked',
        UNBLOCKED: 'Instructor has been unblocked',
        CERTIFICATE_REQUIRED: 'Certificate is required'
    },

    FILE: {
        UPLOAD_SUCCESS: 'File uploaded successfully',
        UPLOAD_FAILED: 'File upload failed',
        INVALID_TYPE: 'Invalid file type',
        SIZE_EXCEEDED: 'File size exceeded',
        NOT_FOUND: 'File not found',
        NO_FILE: 'No file provided',
        EMPTY_BUFFER: 'File buffer is empty'
    },

    COMMON: {
        SERVER_ERROR: 'Internal server error',
        BAD_REQUEST: 'Bad request',
        NOT_FOUND: 'Resource not found',
        FORBIDDEN: 'Access forbidden',
        SUCCESS: 'Operation successful',
        FAILED: 'Operation failed',
        INVALID_ID: 'Invalid ID format',
        VALIDATION_ERROR: 'Validation error'
    },
    PAYMENT:{
        ALREADY_PURCHASED:'These course is already purchased'
    }
} as const;