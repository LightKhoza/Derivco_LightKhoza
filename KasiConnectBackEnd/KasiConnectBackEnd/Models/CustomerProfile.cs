namespace KasiConnectBackEnd.Models
{
    public class CustomerProfile
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public string? Phone { get; set; }
    }
}
