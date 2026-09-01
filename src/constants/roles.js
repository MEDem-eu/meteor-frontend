export const USER_ROLES = Object.freeze({
    ANON: 0,
    CONTRIBUTOR: 1,
    REVIEWER: 2,
    MEDEM_INTERNAL_REVIEWER: 3,
    ADMIN: 10,
});

export const USER_ROLE_LABELS = Object.freeze({
    [USER_ROLES.ANON]: "Anon",
    [USER_ROLES.CONTRIBUTOR]: "Contributor",
    [USER_ROLES.REVIEWER]: "Reviewer",
    [USER_ROLES.MEDEM_INTERNAL_REVIEWER]: "Medem Internal Reviewer",
    [USER_ROLES.ADMIN]: "Admin",
});

export const USER_ROLE_OPTIONS = Object.entries(USER_ROLE_LABELS).map(
    ([value, label]) => ({
        value,
        label,
    })
);

export const getUserRoleLabel = (role) =>
    USER_ROLE_LABELS[Number(role)] ?? `Unknown role (${role})`;


