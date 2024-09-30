// Function to check if the user has the required role(s)
export const hasRole = (state, requiredRoles) => {
    const userRoles = state.userRoles;
    // Guard clauses to check if userRoles or requiredRoles is undefined or empty
    if (!userRoles || !requiredRoles || userRoles.length === 0 || requiredRoles.length === 0) {
        return false;
    }

    return requiredRoles.every(role => userRoles.includes(role));
};
