using System.Security.Claims;

namespace KasiConnectBackEnd.Services
{
    public static class UserExtensions
    {
        public static int GetUserId(this ClaimsPrincipal user)
        {
            var value = user.FindFirstValue("sub");

            if (string.IsNullOrEmpty(value))
                return 0;

            return int.Parse(value);
        }
    }
}
