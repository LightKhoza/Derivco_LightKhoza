namespace KasiConnectBackEnd.Models
{
    public class ProviderProfile
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public string Description { get; set; }
        public string Location { get; set; }
        public decimal HourlyRate { get; set; }

        public bool IsActive { get; set; } = true;

        public List<ProviderService> ProviderServices { get; set; } = new();
    }
}
