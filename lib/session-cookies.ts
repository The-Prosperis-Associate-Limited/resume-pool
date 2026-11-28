// Prefixed because localhost cookies ignore the port, and Haya on :3000 sets unprefixed ones with an overlapping CLIENT role.
export const SESSION_COOKIES = {
  access: "rp_session_id",
  refresh: "rp_session_id_ref",
  type: "rp_session_type",
} as const;
