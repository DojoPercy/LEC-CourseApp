/** Matches the real API response from LEC-course-platform */
export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone?: string | null;
  profilePicture?: string | null; // was "avatar"
  megaCenter?: string | null;     // UUID of mega center
  role: string;
}
