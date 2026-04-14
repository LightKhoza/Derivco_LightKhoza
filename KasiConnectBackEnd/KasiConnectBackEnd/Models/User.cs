namespace KasiConnectBackEnd.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; }

        public CustomerProfile CustomerProfile { get; set; }
        public ProviderProfile ProviderProfile { get; set; }

        public string? ResetToken { get; set; }
        public DateTime? ResetTokenExpiry { get; set; }

        public string? ProfileImageUrl { get; set; }
    }
}
