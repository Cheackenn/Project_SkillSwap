import { ValidationResult, UserProfile } from '../types/messaging';

// Message content validation
export function validateMessageContent(content: string): ValidationResult {
  const errors: string[] = [];
  const trimmed = content.trim();
  
  if (trimmed.length === 0) {
    errors.push('Message cannot be empty');
  }
  
  if (trimmed.length > 5000) {
    errors.push(`Message is too long (${trimmed.length}/5000 characters)`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Format timestamp for display
export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString();
}

// Get display name for user
export function getDisplayName(user: UserProfile | null): string {
  if (!user) return 'Unknown User';
  
  return user.user_metadata?.full_name || 
         user.user_metadata?.username || 
         user.email.split('@')[0];
}

// Format message preview for conversation list
export function formatMessagePreview(
  message: {
    content: string;
    sender_id: string;
    attachment_type: 'image' | 'file' | null;
    attachment_name: string | null;
  } | null,
  currentUserId: string
): string {
  if (!message) return 'No messages yet';
  
  const isOwn = message.sender_id === currentUserId;
  const prefix = isOwn ? 'You: ' : '';
  
  // If there's an attachment
  if (message.attachment_type) {
    if (message.attachment_type === 'image') {
      const imageText = '📷 Photo';
      return message.content ? `${prefix}${imageText}` : `${prefix}${imageText}`;
    } else {
      const fileText = '📎 File';
      return message.content ? `${prefix}${fileText}` : `${prefix}${fileText}`;
    }
  }
  
  // Just text message
  return `${prefix}${message.content}`;
}

// User ID validation (UUID v4 format)
export function validateUserId(userId: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(userId);
}
